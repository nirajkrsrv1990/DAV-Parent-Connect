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
/* ===========================
   SAVE MARKS PATTERN
=========================== */

export const saveMarksPattern = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      examName,
      className,
      subjectName,
      subjectCategory,
      components,
      passingMarks,
      weightage,
      status,
    } = req.body;

    if (
      !examName ||
      !className ||
      !subjectName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Exam, Class and Subject are required.",
      });
    }

    if (
      !Array.isArray(components) ||
      components.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one marks component is required.",
      });
    }

    const invalidComponent =
      components.some(
        (item: any) =>
          !item.name ||
          Number(item.fullMarks) < 0
      );

    if (invalidComponent) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid marks component.",
      });
    }

    const totalMarks =
      components.reduce(
        (total: number, item: any) =>
          total +
          Number(item.fullMarks || 0),
        0
      );

    const duplicate =
      await pool.query(
        `
        SELECT id
        FROM marks_pattern_master
        WHERE exam_name = $1
          AND class_name = $2
          AND subject_name = $3
        `,
        [
          examName,
          className,
          subjectName,
        ]
      );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Marks pattern already exists for this Exam, Class and Subject.",
      });
    }

    const result =
      await pool.query(
        `
        INSERT INTO marks_pattern_master
        (
          exam_name,
          class_name,
          subject_name,
          subject_category,
          components,
          total_marks,
          passing_marks,
          weightage,
          status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
          examName,
          className,
          subjectName,
          subjectCategory ||
            "Major",

          JSON.stringify(
            components
          ),

          totalMarks,

          Number(
            passingMarks || 0
          ),

          Number(
            weightage || 100
          ),

          status || "Active",
        ]
      );

    res.json({
      success: true,
      pattern:
        result.rows[0],
    });

  } catch (err) {

    console.error(
      "SAVE MARKS PATTERN ERROR:"
    );

    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to save marks pattern.",
    });

  }
};


/* ===========================
   GET MARKS PATTERNS
=========================== */

export const getMarksPatterns =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await pool.query(
          `
          SELECT *
          FROM marks_pattern_master
          ORDER BY
            class_name,
            subject_name,
            exam_name
          `
        );

      res.json({
        success: true,
        patterns:
          result.rows,
      });

    } catch (err) {

      console.error(
        "GET MARKS PATTERNS ERROR:"
      );

      console.error(err);

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch marks patterns.",
      });

    }

  };


/* ===========================
   DELETE MARKS PATTERN
=========================== */

export const deleteMarksPattern =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const { id } =
        req.params;

      const result =
        await pool.query(
          `
          DELETE FROM
            marks_pattern_master
          WHERE id = $1
          RETURNING id
          `,
          [id]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Marks pattern not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Marks pattern deleted successfully.",
      });

    } catch (err) {

      console.error(
        "DELETE MARKS PATTERN ERROR:"
      );

      console.error(err);

      res.status(500).json({
        success: false,
        message:
          "Unable to delete marks pattern.",
      });

    }

  };
  /* ===========================
   UPDATE MARKS PATTERN
=========================== */

export const updateMarksPattern = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      examName,
      className,
      subjectName,
      subjectCategory,
      components,
      passingMarks,
      weightage,
      status,
    } = req.body;

    if (!examName || !className || !subjectName) {
      return res.status(400).json({
        success: false,
        message:
          "Exam, Class and Subject are required.",
      });
    }

    if (
      !Array.isArray(components) ||
      components.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one marks component is required.",
      });
    }

    const invalidComponent = components.some(
      (item: any) =>
        !item.name ||
        Number(item.fullMarks) < 0
    );

    if (invalidComponent) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid marks component.",
      });
    }

    const totalMarks = components.reduce(
      (total: number, item: any) =>
        total + Number(item.fullMarks || 0),
      0
    );

    const duplicate = await pool.query(
      `
      SELECT id
      FROM marks_pattern_master
      WHERE exam_name = $1
        AND class_name = $2
        AND subject_name = $3
        AND id <> $4
      `,
      [
        examName,
        className,
        subjectName,
        id,
      ]
    );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Another marks pattern already exists for this Exam, Class and Subject.",
      });
    }

    const result = await pool.query(
      `
      UPDATE marks_pattern_master
      SET
        exam_name = $1,
        class_name = $2,
        subject_name = $3,
        subject_category = $4,
        components = $5,
        total_marks = $6,
        passing_marks = $7,
        weightage = $8,
        status = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
      `,
      [
        examName,
        className,
        subjectName,
        subjectCategory || "Major",
        JSON.stringify(components),
        totalMarks,
        Number(passingMarks || 0),
        Number(weightage || 100),
        status || "Active",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Marks pattern not found.",
      });
    }

    res.json({
      success: true,
      pattern: result.rows[0],
      message:
        "Marks pattern updated successfully.",
    });

  } catch (err) {
    console.error(
      "UPDATE MARKS PATTERN ERROR:"
    );

    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to update marks pattern.",
    });
  }
};