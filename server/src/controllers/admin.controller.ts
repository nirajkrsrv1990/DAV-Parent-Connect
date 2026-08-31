import { Request, Response } from "express";
import pool from "../config/db";

export const adminLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password, rememberMe } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM admin_users
      WHERE email = $1
      AND password = $2
      AND status = 'Active'
      `,
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const admin = result.rows[0];

    const { generateToken } = await import("../utils/auth");

    const token = generateToken(
      {
        id: String(admin.id),
        role: "admin",
      },
      Boolean(rememberMe)
    );

    return res.json({
      success: true,
      admin,
      token,
    });

  } catch (err) {
    console.error("Admin Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   DASHBOARD LIVE STATISTICS
===================================================== */

export const getDashboardStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const students = await pool.query(
      `SELECT COUNT(*)::int AS total FROM students`
    );

    const teachers = await pool.query(
      `SELECT COUNT(*)::int AS total FROM teachers`
    );

    const parents = await pool.query(
      `SELECT COUNT(*)::int AS total FROM parents`
    );

    const notices = await pool.query(
      `SELECT COUNT(*)::int AS total FROM notices`
    );

    res.json({
      success: true,
      data: {
        students: students.rows[0].total,
        teachers: teachers.rows[0].total,
        parents: parents.rows[0].total,
        notices: notices.rows[0].total,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Dashboard statistics failed",
    });
  }
};
/* =====================================================
   ADMIN → PARENT MESSAGES
   Get all messages submitted by parents
===================================================== */

export const getAdminParentMessages = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
      SELECT
        pm.id,
        pm.student_id,
        pm.parent_id,
        pm.class_name,
        pm.section,
        pm.teacher_id,
        pm.message_type,
        pm.subject,
        pm.message,
        pm.status,
        pm.admin_read,
        pm.teacher_read,
        pm.created_at,

        s.admission_no,
        s.student_name,

        p.parent_name,
        p.mobile,
        p.email,

        t.teacher_name

      FROM parent_messages pm

      INNER JOIN students s
        ON s.id = pm.student_id

      LEFT JOIN parents p
        ON p.id = pm.parent_id

      LEFT JOIN teachers t
        ON t.teacher_id = pm.teacher_id

      ORDER BY pm.created_at DESC
      `
    );

    res.json({
      success: true,
      messages: result.rows,
    });

  } catch (error) {

    console.error(
      "Get Admin Parent Messages Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load parent messages",
    });
  }
};