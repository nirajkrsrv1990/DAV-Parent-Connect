import { Request, Response } from "express";
import pool from "../config/db";

/* ==========================================
   CREATE HOMEWORK & SEND NOTIFICATIONS
========================================== */
export const createHomework = async (req: Request, res: Response) => {
  try {
    const { class_name, section, subject, description, due_date } = req.body;

    // Handle uploaded files via Multer
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const pdfFile = files?.pdf ? `/uploads/${files.pdf[0].filename}` : null;
    const imageFile = files?.image ? `/uploads/${files.image[0].filename}` : null;

    // Validate that at least one content field is provided
    if (!description?.trim() && !pdfFile && !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one content type: Text description, PDF, or Image.",
      });
    }

    const title = `${subject} Homework`;

    // 1. Insert homework entry into database
    const homeworkRes = await pool.query(
      `INSERT INTO homework (class, section, subject, description, due_date, pdf_url, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [class_name, section, subject, description || null, due_date, pdfFile, imageFile]
    );

    const newHomework = homeworkRes.rows[0];

    // 2. Fetch all student IDs in the targeted class and section
    const studentsRes = await pool.query(
      `SELECT id FROM students WHERE class = $1 AND section = $2`,
      [class_name, section]
    );

    // 3. Create parent notifications for all enrolled students
    const notifTitle = `New Homework: ${subject}`;
    const notifMsg = `Homework assigned for ${subject}. Due date: ${due_date}`;

    for (const std of studentsRes.rows) {
      await pool.query(
        `INSERT INTO parent_notifications (student_id, title, message, type)
         VALUES ($1, $2, $3, 'homework')`,
        [std.id, notifTitle, notifMsg]
      );
    }

    return res.json({
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
   FETCH HOMEWORK FOR PARENT / STUDENT
========================================== */
export const getStudentHomework = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    // Fetch class and section for the student
    const studentRes = await pool.query(
      `SELECT class, section FROM students WHERE admission_no = $1`,
      [admission_no]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const { class: stdClass, section: stdSection } = studentRes.rows[0];

    // Query homework matching student's class and section
    const homeworkRes = await pool.query(
      `SELECT * FROM homework 
       WHERE class = $1 AND section = $2 
       ORDER BY due_date DESC`,
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