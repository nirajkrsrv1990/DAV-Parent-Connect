import { Request, Response } from "express";
import pool from "../config/db";

/* ===========================
   PARENT SIGNUP (Export Added)
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