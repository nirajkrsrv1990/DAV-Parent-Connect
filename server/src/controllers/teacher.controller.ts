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
      section,
    } = req.body;

    await pool.query(

      `
      DELETE FROM class_teacher_master
      WHERE teacher_id=$1
      `,

      [teacher_id]

    );

    await pool.query(

      `
      INSERT INTO class_teacher_master
      (
        teacher_id,
        class_name,
        section
      )
      VALUES
      ($1,$2,$3)
      `,

      [
        teacher_id,
        class_name,
        section,
      ]

    );

    res.json({

      success: true,

      message: "Class Teacher Assigned Successfully"

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

export const createTeacher = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      teacher_name,
      mobile,
      email,
      qualification,
      designation
    } = req.body;

    const count = await pool.query(
      "SELECT COUNT(*) FROM teachers"
    );

    const nextNumber =
      Number(count.rows[0].count) + 1;

    const teacher_id =
      "DAVT" +
      nextNumber
        .toString()
        .padStart(4, "0");

    const password = "Dav@123";

    const result = await pool.query(

      `
      INSERT INTO teachers
      (
        teacher_id,
        teacher_name,
        mobile,
        email,
        qualification,
        designation,
        password
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,

      [
        teacher_id,
        teacher_name,
        mobile,
        email,
        qualification,
        designation,
        password
      ]

    );

    res.json({

      success: true,

      teacher: result.rows[0]

    });

  }

  catch(err){

    console.log(err);

    res.status(500).json({

      success:false,

      message:"Unable to Save Teacher"

    });

  }

};
export const getClassTeacher = async (
  req: Request,
  res: Response
) => {

  try {

    const { teacher_id } = req.params;

    const result = await pool.query(

      `
      SELECT
        teacher_id,
        class_name,
        section
      FROM class_teacher_master
      WHERE teacher_id=$1
      `,

      [teacher_id]

    );

    if (result.rows.length === 0) {

      return res.json({

        success: true,

        assignment: null

      });

    }

    res.json({

      success: true,

      assignment: result.rows[0]

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Unable to Load Class Teacher"

    });

  }

};
export const teacherLogin = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      teacher_id,
      password
    } = req.body;

    const result = await pool.query(

      `
      SELECT *
      FROM teachers
      WHERE teacher_id=$1
      AND password=$2
      AND status='Active'
      `,

      [
        teacher_id,
        password
      ]

    );

    if(result.rows.length===0){

      return res.status(401).json({

        success:false,

        message:"Invalid Teacher ID or Password"

      });

    }

    res.json({

      success:true,

      teacher:result.rows[0]

    });

  }

  catch(err){

    console.log(err);

    res.status(500).json({

      success:false

    });

  }

};
export const getTeachers = async (
  req: Request,
  res: Response
) => {

  try {

    const result = await pool.query(
      `
      SELECT
        id,
        teacher_id,
        teacher_name,
        mobile,
        email,
        qualification,
        designation,
        status
      FROM teachers
      ORDER BY teacher_name
      `
    );

    res.json({

      success: true,

      teachers: result.rows

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Unable to Load Teachers"

    });

  }

};
export const deleteTeacher = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM class_teacher_master WHERE teacher_id=(SELECT teacher_id FROM teachers WHERE id=$1)",
      [id]
    );

    await pool.query(
      "DELETE FROM teachers WHERE id=$1",
      [id]
    );

    res.json({

      success: true,

      message: "Teacher Deleted Successfully"

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Unable to Delete Teacher"

    });

  }

};