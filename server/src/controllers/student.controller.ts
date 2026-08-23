import { Request, Response } from "express";
import * as XLSX from "xlsx";
import pool from "../config/db";

/* =========================================================
   UPLOAD STUDENTS
========================================================= */

export const uploadStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = (req as any).file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "No Excel file selected.",
      });

      return;
    }

    const workbook = XLSX.readFile(file.path);

    if (!workbook.SheetNames.length) {
      res.status(400).json({
        success: false,
        message: "Excel file contains no worksheet.",
      });

      return;
    }

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const students: any[] =
      XLSX.utils.sheet_to_json(sheet);

    if (!students.length) {
      res.status(400).json({
        success: false,
        message: "Excel file contains no student records.",
      });

      return;
    }

    let inserted = 0;

    for (const row of students) {
      await pool.query(
        `
        INSERT INTO students
        (
          admission_no,
          student_name,
          father_name,
          mother_name,
          mobile_no,
          class,
          section,
          roll_no,
          gender,
          dob,
          house,
          status,
          student_status,
          removal_reason,
          removed_at
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15
        )
        `,
        [
          row["Admission"] ||
            row["Admission No"] ||
            null,

          row["Student Name"] || null,

          row["Father Name"] || null,

          row["Mother Name"] || null,

          row["Mobile No"] || null,

          row["Class"] || null,

          row["Section"] || null,

          row["Roll No"] || null,

          row["Gender"] || null,

          row["DOB"] || null,

          row["House"] || null,

          row["Status"] || "Active",

          "Active",

          null,

          null,
        ]
      );

      inserted++;
    }

    res.status(200).json({
      success: true,
      message:
        `${inserted} Students Imported Successfully`,
      inserted,
    });
  } catch (error) {
    console.error(
      "Student Upload Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Student Upload Failed",
    });
  }
};


/* =========================================================
   GET STUDENTS
   ---------------------------------------------------------
   Admin:
   /api/students

   Optional filters:
   /api/students?class=VII&section=A
========================================================= */

export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentClass =
      req.query.class as string;

    const section =
      req.query.section as string;

    const studentStatus =
      req.query.student_status as string;

    let query = `
      SELECT
        id,
        admission_no,
        student_name,
        father_name,
        mother_name,
        mobile_no,
        class,
        section,
        roll_no,
        gender,
        dob,
        house,
        status,
        student_status,
        removal_reason,
        removed_at
      FROM students
    `;

    const conditions: string[] = [];

    const values: any[] = [];

    let parameterIndex = 1;


    /* =========================
       CLASS FILTER
    ========================= */

    if (studentClass) {
      conditions.push(
        `class = $${parameterIndex}`
      );

      values.push(studentClass);

      parameterIndex++;
    }


    /* =========================
       SECTION FILTER
    ========================= */

    if (section) {
      conditions.push(
        `section = $${parameterIndex}`
      );

      values.push(section);

      parameterIndex++;
    }


    /* =========================
       STUDENT STATUS FILTER
    ========================= */

    if (studentStatus) {
      conditions.push(
        `student_status = $${parameterIndex}`
      );

      values.push(studentStatus);

      parameterIndex++;
    }


    /* =========================
       WHERE
    ========================= */

    if (conditions.length > 0) {
      query += `
        WHERE ${conditions.join(" AND ")}
      `;
    }


    /* =========================
       ORDER
    ========================= */

    query += `
      ORDER BY
        class ASC,
        section ASC,
        roll_no ASC,
        student_name ASC
    `;


    const result =
      await pool.query(
        query,
        values
      );


    res.status(200).json({
      success: true,

      total:
        result.rows.length,

      students:
        result.rows,
    });

  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to Fetch Students",
    });
  }
};


/* =========================================================
   GET STUDENT BY ADMISSION NO
========================================================= */

export const getStudentByAdmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      admission_no,
    } = req.params;

    const result =
      await pool.query(
        `
        SELECT
          id,
          admission_no,
          student_name,
          class,
          section,
          father_name,
          mother_name,
          mobile_no,
          roll_no,
          gender,
          dob,
          house,
          status,
          student_status,
          removal_reason,
          removed_at
        FROM students
        WHERE admission_no = $1
        `,
        [admission_no]
      );


    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message:
          "Student Not Found",
      });

      return;
    }


    res.status(200).json({
      success: true,
      student:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Get Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to Fetch Student",
    });
  }
};


/* =========================================================
   UPDATE STUDENT
   ---------------------------------------------------------
   Admin can update complete student record.
========================================================= */

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      admission_no,
      student_name,
      father_name,
      mother_name,
      mobile_no,
      class: studentClass,
      section,
      roll_no,
      gender,
      dob,
      house,
      status,
      student_status,
      removal_reason,
    } = req.body;


    const result =
      await pool.query(
        `
        UPDATE students
        SET
          admission_no = $1,
          student_name = $2,
          father_name = $3,
          mother_name = $4,
          mobile_no = $5,
          class = $6,
          section = $7,
          roll_no = $8,
          gender = $9,
          dob = $10,
          house = $11,
          status = $12,
          student_status = $13,
          removal_reason = $14,

          removed_at =
            CASE
              WHEN $13 = 'Active'
              THEN NULL
              WHEN $13 IN
                ('Inactive',
                 'Transferred',
                 'School Left')
              AND removed_at IS NULL
              THEN CURRENT_TIMESTAMP
              ELSE removed_at
            END

        WHERE id = $15

        RETURNING *
        `,
        [
          admission_no,
          student_name,
          father_name,
          mother_name,
          mobile_no,
          studentClass,
          section,
          roll_no,
          gender,
          dob,
          house,
          status,
          student_status || "Active",
          removal_reason || null,
          id,
        ]
      );


    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message:
          "Student Not Found",
      });

      return;
    }


    res.status(200).json({
      success: true,

      message:
        "Student Updated Successfully",

      student:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Update Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to Update Student",
    });
  }
};


/* =========================================================
   REMOVE / DEACTIVATE STUDENT
   ---------------------------------------------------------
   IMPORTANT:
   This does NOT permanently delete the student.

   Student remains in database.
========================================================= */

export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      removal_reason,
    } = req.body || {};


    const result =
      await pool.query(
        `
        UPDATE students

        SET
          student_status = 'Inactive',

          removal_reason =
            COALESCE(
              $1,
              'Removed from active student list'
            ),

          removed_at =
            CURRENT_TIMESTAMP

        WHERE id = $2

        RETURNING
          id,
          admission_no,
          student_name,
          class,
          section,
          student_status,
          removal_reason,
          removed_at
        `,
        [
          removal_reason || null,
          id,
        ]
      );


    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message:
          "Student Not Found",
      });

      return;
    }


    res.status(200).json({
      success: true,

      message:
        "Student Removed Successfully. Record is محفوظ in database.",

      student:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Remove Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to Remove Student",
    });
  }
};