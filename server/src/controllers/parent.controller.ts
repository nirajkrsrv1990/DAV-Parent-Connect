import { Request, Response } from "express";
import pool from "../config/db";

/* ===========================
   PARENT SIGNUP
=========================== */
export const parentSignup = async (req: Request, res: Response) => {
  try {
    const { admission_no, parent_name, mobile, email, password } = req.body;

    /* Check Student */
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

    /* Check Existing Parent */
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
   PARENT LOGIN
=========================== */
export const parentLogin = async (req: Request, res: Response) => {
  try {
    const { admission_no, password } = req.body;

    // Support both admission_no or mobile number login safely
    const parent = await pool.query(
      `SELECT * FROM parents WHERE (CAST(admission_no AS TEXT) = $1 OR mobile = $1) AND password = $2`,
      [admission_no, password]
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
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};

/* ===========================
   PARENT DASHBOARD & NOTIFICATIONS (FIXED QUERY)
=========================== */
export const getParentDashboard = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    // 1. Fetch Student Database Primary Key (id) using admission_no
    const studentRes = await pool.query(
      `SELECT id, student_name, admission_no, class, section FROM students WHERE admission_no = $1`,
      [admission_no]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const student = studentRes.rows[0];
    const studentId = student.id; // Correct database integer ID (e.g., 2)

    // 2. Fetch Attendance using studentId
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

    // 3. Fetch Notifications using studentId (Matches pgAdmin student_id = 2)
    const notificationsRes = await pool.query(
      `SELECT * FROM parent_notifications 
       WHERE student_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [studentId]
    );

    return res.json({
      success: true,
      student,
      attendancePercentage,
      totalWorkingDays: totalDays,
      presentDays: presentDays,
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