import { Request, Response } from "express";
import pool from "../config/db";

export const assignClassTeacher = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      teacher_id,
      class_name,
      section
    } = req.body;

    await pool.query(

      `
      INSERT INTO class_teacher_master
      (
        teacher_id,
        class_name,
        section
      )
      VALUES ($1,$2,$3)
      `,

      [
        teacher_id,
        class_name,
        section
      ]

    );

    res.json({

      success: true

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Unable to Assign Class Teacher"

    });

  }

};
export const getClassTeacher = async (
  req: Request,
  res: Response
) => {
  try {
    const teacher_id = String(req.params.teacher_id).trim();

    console.log("=================================");
    console.log("Teacher ID received:", teacher_id);

    const dbInfo = await pool.query(`
      SELECT
        current_database() AS database_name,
        current_user AS db_user,
        inet_server_addr()::text AS server_ip
    `);

    console.log("Node DB:", dbInfo.rows[0]);

    const result = await pool.query(
      `
      SELECT
        teacher_id,
        class_name,
        section
      FROM class_teacher_master
      WHERE TRIM(teacher_id) = $1
      LIMIT 1
      `,
      [teacher_id]
    );

    console.log("Assignment Result:", result.rows);

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        assignment: null,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      assignment: result.rows[0],
    });

  } catch (err) {
    console.error("Get Class Teacher Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to Load Class Teacher",
    });
  }
};