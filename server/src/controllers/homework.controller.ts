import { Request, Response } from "express";
import pool from "../config/db";

/* ==========================================
   CREATE HOMEWORK & SEND NOTIFICATIONS
========================================== */
export const createHomework = async (req: Request, res: Response) => {
  try {
    const {
  class_name,
  section,
  subject,
  description,
  due_date,
  teacher_id,
} = req.body;
if (!teacher_id) {
  return res.status(400).json({
    success: false,
    message: "Teacher ID is required.",
  });
}

    // Handle uploaded files via Multer
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const pdfFile = files?.pdf?.[0]
      ? `/uploads/${files.pdf[0].filename}`
      : null;

    const imageFile = files?.image?.[0]
      ? `/uploads/${files.image[0].filename}`
      : null;

    // Validate at least one content
    if (!description?.trim() && !pdfFile && !imageFile) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide at least one content type: Text description, PDF, or Image.",
      });
    }

    // Auto title
    const title = `${subject} Homework`;

    // Insert Homework
    const homeworkRes = await pool.query(
  `
  INSERT INTO homework
(
  teacher_id,
  class,
  section,
  subject,
  title,
  description,
  due_date,
  pdf_url,
  image_url
)
  VALUES
(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9
)
  RETURNING *
  `,
  [
  teacher_id,
  class_name,
  section,
  subject,
  title,
  description || null,
  due_date,
  pdfFile,
  imageFile,
]
);
    const newHomework = homeworkRes.rows[0];

    // Fetch Students
    const studentsRes = await pool.query(
      `SELECT id FROM students WHERE class = $1 AND section = $2`,
      [class_name, section]
    );

    // Send Notifications
    const notifTitle = `New Homework: ${subject}`;
    const notifMsg = `Homework assigned for ${subject}. Due Date: ${due_date}`;

    for (const student of studentsRes.rows) {
      await pool.query(
        `
        INSERT INTO parent_notifications
        (student_id, title, message, type)
        VALUES ($1, $2, $3, 'homework')
        `,
        [student.id, notifTitle, notifMsg]
      );
    }

    return res.status(201).json({
      success: true,
      message: `Homework uploaded successfully and notified ${studentsRes.rows.length} parents.`,
      homework: newHomework,
    });
  } catch (err) {
    console.error("Create Homework Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error while uploading homework.",
    });
  }
};
/* ==========================================
   FETCH HOMEWORK UPLOADED BY TEACHER
========================================== */
export const getTeacherHomework = async (
  req: Request,
  res: Response
) => {
  try {
    const { teacher_id } = req.params;

    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required.",
      });
    }

    const homeworkRes = await pool.query(
  `
  SELECT
    id,
    teacher_id,
    subject,
    class,
    section,
    description,
    pdf_url,
    image_url,
    due_date,
    created_at
  FROM homework
  WHERE teacher_id = $1
    AND created_at::date =
        (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
  ORDER BY created_at DESC
  `,
  [teacher_id]
);

    return res.json({
      success: true,
      homework: homeworkRes.rows,
    });

  } catch (err) {
    console.error(
      "Get Teacher Homework Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch teacher homework.",
    });
  }
};

/* ==========================================
   FETCH HOMEWORK FOR PARENT / STUDENT
========================================== */
export const getStudentHomework = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    const studentRes = await pool.query(
      `SELECT class, section FROM students WHERE admission_no = $1`,
      [admission_no]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const { class: stdClass, section: stdSection } = studentRes.rows[0];

    const homeworkRes = await pool.query(
      `
      SELECT *
      FROM homework
      WHERE class = $1
        AND section = $2
      ORDER BY due_date DESC
      `,
      [stdClass, stdSection]
    );

    return res.json({
      success: true,
      homework: homeworkRes.rows,
    });
  } catch (err) {
    console.error("Get Homework Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching homework.",
    });
  }
};
/* ==========================================
   FETCH TODAY'S HOMEWORK FOR CLASS TEACHER
========================================== */
export const getClassTeacherHomework = async (
  req: Request,
  res: Response
) => {
  try {
    const teacher_id = String(req.params.teacher_id).trim();

    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required.",
      });
    }

    // Find the class and section assigned to this Class Teacher
    const assignmentRes = await pool.query(
      `
      SELECT
        class_name,
        section
      FROM class_teacher_master
      WHERE TRIM(teacher_id) = $1
      LIMIT 1
      `,
      [teacher_id]
    );

    if (assignmentRes.rows.length === 0) {
      return res.json({
        success: false,
        assignment: null,
        homework: [],
        message: "This teacher is not assigned as a Class Teacher.",
      });
    }

    const {
      class_name,
      section,
    } = assignmentRes.rows[0];

    // Fetch ONLY TODAY'S homework for the assigned class/section
    const homeworkRes = await pool.query(
      `
      SELECT
        id,
        teacher_id,
        subject,
        class,
        section,
        description,
        pdf_url,
        image_url,
        due_date,
        created_at
      FROM homework
      WHERE class = $1
        AND section = $2
        AND created_at::date =
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
      ORDER BY created_at DESC
      `,
      [class_name, section]
    );

    return res.json({
      success: true,
      assignment: {
        class_name,
        section,
      },
      homework: homeworkRes.rows,
    });

  } catch (err) {
    console.error(
      "Get Class Teacher Homework Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch class teacher homework.",
    });
  }
};