import { Request, Response } from "express";
import pool from "../config/db";

/* ===========================
   PARENT LOGIN (Mapped via admission_no)
=========================== */
export const parentLogin = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    const result = await pool.query(
      `
      SELECT 
        p.id AS parent_id,
        p.admission_no,
        p.parent_name,
        p.mobile,
        p.email,
        s.id AS student_db_id,
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
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to Login" });
  }
};

/* ===========================
   GET PARENT DASHBOARD DATA 
   (Total Working Days % & Daily Real-time Notifications)
=========================== */
export const getParentDashboard = async (req: Request, res: Response) => {
  try {
    const { admission_no } = req.params;

    // 1. Calculate Attendance Percentage based on Total Working Days
    const attendanceResult = await pool.query(
      `
      SELECT 
        COUNT(DISTINCT a.attendance_date) AS total_working_days,
        COUNT(CASE WHEN a.status = 'P' THEN 1 END) AS present_days
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE s.admission_no = $1
      `,
      [admission_no]
    );

    const totalWorkingDays = parseInt(attendanceResult.rows[0].total_working_days, 10) || 0;
    const presentDays = parseInt(attendanceResult.rows[0].present_days, 10) || 0;
    
    // Percentage Calculation
    const attendancePercentage = totalWorkingDays > 0 
      ? Math.round((presentDays / totalWorkingDays) * 100) 
      : 0;

    // 2. Fetch Daily Notifications (Absent / Present Alerts mapped by admission_no)
    const notificationResult = await pool.query(
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
      attendancePercentage,
      totalWorkingDays,
      presentDays,
      notifications: notificationResult.rows,
    });
  } catch (err) {
    console.error("Dashboard Data Error:", err);
    res.status(500).json({ success: false, message: "Unable to load dashboard data" });
  }
};