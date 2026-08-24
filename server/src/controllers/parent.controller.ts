import { Request, Response } from "express";
import pool from "../config/db";

/* ===========================
   PARENT SIGNUP
=========================== */
export const parentSignup = async (req: Request, res: Response) => {
  try {
    const { admission_no, parent_name, mobile, email, password } = req.body;

    const student = await pool.query(
      `SELECT admission_no FROM students WHERE admission_no=$1`,
      [admission_no]
    );

    if (student.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Admission Number",
      });
    }

    const parent = await pool.query(
      `SELECT id FROM parents WHERE admission_no=$1`,
      [admission_no]
    );

    if (parent.rows.length > 0) {
      return res.json({
        success: false,
        message: "Parent Account Already Exists",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO parents
      (admission_no, parent_name, mobile, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [admission_no, parent_name, mobile, email, password]
    );

    res.json({
      success: true,
      parent: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Register Parent",
    });
  }
};

/* ===========================
   PARENT LOGIN (ONLY THIS IS FIXED)
=========================== */
export const parentLogin = async (req: Request, res: Response) => {
  try {
    // Yahan 'email' ko bhi add kar liya kyunki frontend wahi bhej raha hai
    const { admission_no, mobile, email, password } = req.body;
    const loginIdentifier = admission_no || mobile || email;

    if (!loginIdentifier || !password) {
      return res.json({
        success: false,
        message: "Please provide credentials",
      });
    }

    const parent = await pool.query(
      `SELECT * FROM parents WHERE (CAST(admission_no AS TEXT) = $1 OR mobile = $1 OR email = $1) AND password = $2`,
      [String(loginIdentifier).trim(), String(password).trim()]
    );
    if (parent.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Admission Number/Mobile or Password",
      });
    }

    res.json({
      success: true,
      parent: parent.rows[0],
    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};

/* ===========================
   PARENT DASHBOARD & NOTIFICATIONS (UNCHANGED)
=========================== */
export const getParentDashboard = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    const studentRes = await pool.query(
  `
  SELECT
    id,
    student_name,
    admission_no,
    father_name,
    mother_name,
    father_mobile,
    mother_mobile,
    class,
    section,
    roll_no,
    house,
    address
  FROM students
  WHERE admission_no = $1
  `,
  [admission_no]
);

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const student = studentRes.rows[0];
    const studentId = student.id;

    const attendanceRes = await pool.query(
      `SELECT 
         COUNT(*) as total_days,
         COUNT(CASE WHEN status = 'Present' THEN 1 END) as present_days
       FROM attendance 
       WHERE student_id = $1`,
      [studentId]
    );

    const totalDays = parseInt(attendanceRes.rows[0]?.total_days || "0");
    const presentDays = parseInt(attendanceRes.rows[0]?.present_days || "0");
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    const notificationsRes = await pool.query(
      `SELECT * FROM parent_notifications 
       WHERE student_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [studentId]
    );

    const unreadCountRes = await pool.query(
      `SELECT COUNT(*) AS unread_count 
       FROM parent_notifications 
       WHERE student_id = $1 AND is_read = FALSE`,
      [studentId]
    );

    const notificationCount = parseInt(unreadCountRes.rows[0]?.unread_count || "0");

    const homeworkRes = await pool.query(
      `
      SELECT COUNT(*) AS pending_homework
      FROM homework
      WHERE class = $1
        AND section = $2
        AND due_date >= CURRENT_DATE
      `,
      [student.class, student.section]
    );

    const homeworkCount = parseInt(homeworkRes.rows[0]?.pending_homework || "0");

    return res.json({
      success: true,
      student,
      attendancePercentage,
      totalWorkingDays: totalDays,
      presentDays: presentDays,
      homeworkCount,
      notifications: notificationsRes.rows,
    });
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
    });
  }
};

/* ===========================
   MARK NOTIFICATIONS AS READ (UNCHANGED)
=========================== */
export const markNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    const studentRes = await pool.query(
      `SELECT id FROM students WHERE admission_no = $1`,
      [admission_no]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const studentId = studentRes.rows[0].id;

    await pool.query(
      `UPDATE parent_notifications SET is_read = TRUE WHERE student_id = $1`,
      [studentId]
    );

    return res.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (err) {
    console.error("Mark Read Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ============================================
// GET ANNUAL ATTENDANCE
// ============================================

export const getAnnualAttendance = async (
  req: Request,
  res: Response
) => {

  try {

    const { admission_no } = req.params;


    // ========================================
    // FIND STUDENT USING ADMISSION NO
    // ========================================

    const studentResult = await pool.query(
      `
      SELECT 
        id,
        admission_no,
        student_name,
        class,
        section
      FROM students
      WHERE admission_no = $1
      `,
      [admission_no]
    );


    if (studentResult.rows.length === 0) {

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }


    const student =
      studentResult.rows[0];


    // ========================================
    // GET COMPLETE ATTENDANCE
    // ========================================

    const attendanceResult =
      await pool.query(
        `
        SELECT
          attendance_date,
          status
        FROM attendance
        WHERE student_id = $1
        ORDER BY attendance_date
        `,
        [
          student.id
        ]
      );


    // ========================================
    // GET HOLIDAY / VACATION DATA
    // ========================================

    const calendarResult =
      await pool.query(
        `
        SELECT
          title,
          event_type,
          start_date,
          end_date
        FROM academic_calendar
        WHERE session = '2026-27'
        AND is_active = true
        AND event_type = 'HOLIDAY'
        ORDER BY start_date
        `
      );


    // ========================================
    // RESPONSE
    // ========================================

    // ===============================
// ATTENDANCE SUMMARY CALCULATION
// ===============================

const attendanceData = attendanceResult.rows;


const totalWorkingDays =
attendanceData.length;


const presentDays =
attendanceData.filter(
(item:any)=>
item.status === "P" ||
item.status === "Present"
).length;


const absentDays =
attendanceData.filter(
(item:any)=>
item.status === "A" ||
item.status === "Absent"
).length;


const attendancePercentage =
totalWorkingDays > 0
?
Math.round(
(presentDays / totalWorkingDays) * 100
)
:
0;


// ===============================
// RESPONSE
// ===============================

return res.json({

 success:true,

 student,

 attendance:
 attendanceResult.rows,

 holidays:
 calendarResult.rows,


 summary:{
    totalWorkingDays,
    presentDays,
    absentDays,
    attendancePercentage
 }

});


  } catch(error) {


    console.error(
      "Annual Attendance Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
        "Unable to fetch annual attendance"

    });

  }

};
/* ===========================
   PARENT ATTENDANCE CALENDAR
=========================== */
export const getParentAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const { admission_no } = req.params;

    const { month } = req.query;

    if (!month || typeof month !== "string") {
      return res.status(400).json({
        success: false,
        message: "Month is required. Format: YYYY-MM",
      });
    }

    // Find student
    const studentRes = await pool.query(
      `
      SELECT
        id,
        student_name,
        admission_no,
        class,
        section
      FROM students
      WHERE admission_no = $1
      `,
      [admission_no]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const student = studentRes.rows[0];

    // Fetch attendance for selected month
    const attendanceRes = await pool.query(
      `
      SELECT
        attendance_date,
        status
      FROM attendance
      WHERE student_id = $1
        AND attendance_date >= ($2 || '-01')::date
        AND attendance_date < (($2 || '-01')::date + INTERVAL '1 month')
      ORDER BY attendance_date
      `,
      [student.id, month]
    );

    res.json({
      success: true,
      student,
      month,
      attendance: attendanceRes.rows,
    });
  } catch (err) {
    console.error("Parent Attendance Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch attendance",
    });
  }
};
/* =====================================================
   PARENT → SCHOOL MESSAGE
===================================================== */

export const createParentMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      admission_no,
      message_type,
      subject,
      message,
    } = req.body;

    if (
      !admission_no ||
      !message_type ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* ============================
       FIND PARENT + STUDENT
    ============================ */

    const parentResult = await pool.query(
      `
      SELECT
        p.id AS parent_id,
        s.id AS student_id,
        s.class,
        s.section
      FROM parents p
      INNER JOIN students s
        ON s.admission_no = p.admission_no
      WHERE p.admission_no = $1
      AND p.status = 'Active'
      AND s.student_status = 'Active'
      LIMIT 1
      `,
      [String(admission_no).trim()]
    );

    if (parentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student/Parent record not found",
      });
    }

    const {
      parent_id,
      student_id,
      class: className,
      section,
    } = parentResult.rows[0];

    /* ============================
       FIND CLASS TEACHER
    ============================ */

    const teacherResult = await pool.query(
      `
      SELECT teacher_id
      FROM class_teacher_master
      WHERE TRIM(class_name) = TRIM($1)
      AND TRIM(section) = TRIM($2)
      LIMIT 1
      `,
      [className, section]
    );

    const teacherId =
      teacherResult.rows.length > 0
        ? teacherResult.rows[0].teacher_id
        : null;

    /* ============================
       SAVE MESSAGE
    ============================ */

    const result = await pool.query(
      `
      INSERT INTO parent_messages
      (
        student_id,
        parent_id,
        class_name,
        section,
        teacher_id,
        message_type,
        subject,
        message
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        student_id,
        parent_id,
        className,
        section,
        teacherId,
        message_type,
        subject.trim(),
        message.trim(),
      ]
    );

    res.json({
      success: true,
      message: "Your message has been submitted successfully",
      data: result.rows[0],
    });

  } catch (error) {

    console.error(
      "Create Parent Message Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to submit message",
    });
  }
};
/* =====================================================
   PARENT PROFILE → UPDATE CONTACT DETAILS
===================================================== */

export const updateParentProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const { admission_no } = req.params;

    const {
      father_mobile,
      mother_mobile,
      address,
    } = req.body;

    if (!admission_no) {
      return res.status(400).json({
        success: false,
        message: "Admission number is required",
      });
    }

    /* ============================
       FIND STUDENT
    ============================ */

    const studentResult = await pool.query(
      `
      SELECT id
      FROM students
      WHERE admission_no = $1
      LIMIT 1
      `,
      [String(admission_no).trim()]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    /* ============================
       UPDATE ONLY ALLOWED FIELDS
    ============================ */

    const result = await pool.query(
      `
      UPDATE students
      SET
        father_mobile = $1,
        mother_mobile = $2,
        address = $3
      WHERE admission_no = $4
      RETURNING
        id,
        student_name,
        admission_no,
        father_name,
        mother_name,
        father_mobile,
        mother_mobile,
        class,
        section,
        roll_no,
        house,
        address
      `,
      [
        father_mobile?.trim() || null,
        mother_mobile?.trim() || null,
        address?.trim() || null,
        String(admission_no).trim(),
      ]
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      student: result.rows[0],
    });

  } catch (error) {

    console.error(
      "Update Parent Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};