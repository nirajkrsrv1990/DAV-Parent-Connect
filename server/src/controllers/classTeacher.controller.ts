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

    const { teacher_id } = req.params;

    const result = await pool.query(

      `
      SELECT
        teacher_id,
        class_name,
        section
      FROM class_teacher_master
      WHERE teacher_id=$1
      LIMIT 1
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