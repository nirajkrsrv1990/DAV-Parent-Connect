import { Request, Response } from "express";
import pool from "../config/db";

/* ===========================
   PARENT LOGIN
=========================== */
export const parentLogin = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    // Admission No se Student Record JOIN karke Student ID auto-fetch karein
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        s.id AS student_id,
        s.student_name, 
        s.class, 
        s.section 
      FROM parents p
      JOIN students s ON p.admission_no = s.admission_no
      WHERE p.mobile = $1 
        AND p.password = $2 
        AND p.status = 'Active'
      `,
      [mobile, password]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Mobile Number or Password",
      });
    }

    res.json({
      success: true,
      parent: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Login",
    });
  }
};

/* ===========================
   GET PARENT NOTIFICATIONS / ATTENDANCE
=========================== */
export const getParentNotifications = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    // Admission Number se direct Notifications & Attendance records JOIN karke fetch karein
    const result = await pool.query(
      `
      SELECT pn.* 
      FROM parent_notifications pn
      JOIN students s ON pn.student_id = s.id
      WHERE s.admission_no = $1
      ORDER BY pn.id DESC
      `,
      [admission_no]
    );

    res.json({
      success: true,
      notifications: result.rows,
    });
  } catch (err) {
    console.log("Get Notifications Error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load notifications",
    });
  }
};