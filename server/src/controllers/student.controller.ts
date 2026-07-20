import { Request, Response } from "express";
import * as XLSX from "xlsx";
import pool from "../config/db";

/* ===========================
   UPLOAD STUDENTS
=========================== */

export const uploadStudents = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const file = (req as any).file;

    if (!file) {

      res.status(400).json({

        success: false,
        message: "No Excel file selected."

      });

      return;

    }

    const workbook = XLSX.readFile(file.path);

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const students: any[] =
      XLSX.utils.sheet_to_json(sheet);

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
          status
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
        `,

        [

          row["Admission No"],
          row["Student Name"],
          row["Father Name"],
          row["Mother Name"],
          row["Mobile No"],
          row["Class"],
          row["Section"],
          row["Roll No"],
          row["Gender"],
          row["DOB"],
          row["House"],
          row["Status"]

        ]

      );

      inserted++;

    }

    res.status(200).json({

      success: true,

      message:
        `${inserted} Students Imported Successfully`

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Student Upload Failed"

    });

  }

};
/* ===========================
   GET STUDENTS
=========================== */

export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const studentClass =
      req.query.class as string;

    const section =
      req.query.section as string;

    let query = `
      SELECT *
      FROM students
    `;

    const values: any[] = [];

    if (studentClass && section) {

      query += `
        WHERE class = $1
        AND section = $2
        ORDER BY roll_no ASC
      `;

      values.push(studentClass);
      values.push(section);

    }

    else {

      query += `
        ORDER BY class,
                 section,
                 roll_no
      `;

    }

    const result = await pool.query(
      query,
      values
    );

    res.status(200).json({

      success: true,

      total: result.rows.length,

      students: result.rows

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Unable to Fetch Students"

    });

  }

};

/* ===========================
   GET STUDENT BY ADMISSION NO
=========================== */

export const getStudentByAdmission = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { admission_no } = req.params;

    const result = await pool.query(

      `
      SELECT
        admission_no,
        student_name,
        class,
        section,
        father_name,
        mother_name,
        mobile_no,
        roll_no
      FROM students
      WHERE admission_no = $1
      `,

      [admission_no]

    );

    if (result.rows.length === 0) {

      res.json({

        success: false,

        message: "Student Not Found"

      });

      return;

    }

    res.json({

      success: true,

      student: result.rows[0]

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Unable to Fetch Student"

    });

  }

};