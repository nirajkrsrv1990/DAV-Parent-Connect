import { Request, Response } from "express";
import pool from "../config/db";

export const adminLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM admin_users
      WHERE email = $1
      AND password = $2
      AND status='Active'
      `,
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    res.json({
      success: true,
      admin: result.rows[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
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