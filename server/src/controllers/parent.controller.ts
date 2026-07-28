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
   PARENT LOGIN (UPDATED)
=========================== */
export const parentLogin = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    // Students Table se JOIN karke Student DB ID (Primary Key) lekar aana zaroori hai
    const result = await pool.query(
      `
      SELECT 
        p.*, 
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
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Login",
    });
  }
};

/* ===========================
   GET PARENT NOTIFICATIONS (ADDED)
=========================== */
export const getParentNotifications = async (req: Request, res: Response) => {
  try {
    const { student_id } = req.params;

    const parsedStudentId = parseInt(student_id, 10);

    if (isNaN(parsedStudentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const result = await pool.query(
      `
      SELECT * 
      FROM parent_notifications 
      WHERE student_id = $1 
      ORDER BY id DESC
      `,
      [parsedStudentId]
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