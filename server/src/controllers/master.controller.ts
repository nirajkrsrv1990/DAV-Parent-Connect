import { Request, Response } from "express";
import pool from "../config/db";


/* ===========================
   SAVE CLASS
=========================== */

export const saveClass = async (
  req: Request,
  res: Response
) => {
console.log("BODY RECEIVED:", req.body);
  try {

    const {
      className,
      sections,
      displayOrder,
      status
    } = req.body;
    const check = await pool.query(
  "SELECT id FROM class_master WHERE class_name = $1",
  [className]
);

if (check.rows.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Class already exists."
  });
}

    const query = `
      INSERT INTO class_master
      (
        class_name,
        sections,
        display_order,
        status
      )
      VALUES
      ($1,$2,$3,$4)
      RETURNING *
    `;

    const values = [
      className,
      sections,
      displayOrder,
      status
    ];

    const result = await pool.query(
      query,
      values
    );
    console.log("INSERT SUCCESS");

    res.json({

      success: true,

      class: result.rows[0]

    });

  }

  catch (err) {

  console.error("SAVE CLASS ERROR:");
  console.error(err);

  res.status(500).json({

    success: false,

    message: "Unable to Save"

  });

}
};

/* ===========================
   GET ALL CLASSES
=========================== */

export const getClasses = async (

  req: Request,

  res: Response

) => {

  try {

    const result = await pool.query(

      `
      SELECT *
      FROM class_master
      ORDER BY display_order
      `

    );

    res.json({

      success: true,

      classes: result.rows

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false

    });

  }

};