import { Request, Response } from "express";
import pool from "../config/db";

/* =========================================================
   GET TEACHER ASSIGNMENT
   ========================================================= */

const getTeacherAssignment = async (teacher_id: string) => {
  const result = await pool.query(
    `
    SELECT
      teacher_id,
      class_name,
      section
    FROM class_teacher_master
    WHERE teacher_id = $1
    LIMIT 1
    `,
    [teacher_id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


/* =========================================================
   GET STUDENTS OF CLASS TEACHER
   Only ACTIVE students of assigned class + section
   ========================================================= */

export const getTeacherStudents = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const teacher_id = String(req.params.teacher_id);

    if (!teacher_id) {

      res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });

      return;
    }


    /* -----------------------------------------
       Find teacher's assigned class
    ----------------------------------------- */

    const assignment =
      await getTeacherAssignment(teacher_id);


    if (!assignment) {

      res.status(404).json({
        success: false,
        message: "No class-section assigned to this teacher",
      });

      return;
    }


    /* -----------------------------------------
       Get only ACTIVE students
       of assigned class + section
    ----------------------------------------- */

    const result = await pool.query(
      `
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
      WHERE class = $1
        AND section = $2
        AND COALESCE(student_status, 'Active') = 'Active'
      ORDER BY roll_no ASC, student_name ASC
      `,
      [
        assignment.class_name,
        assignment.section,
      ]
    );


    res.status(200).json({

      success: true,

      teacher_id,

      class_name:
        assignment.class_name,

      section:
        assignment.section,

      total:
        result.rows.length,

      students:
        result.rows,

    });

  } catch (error) {

    console.error(
      "Get Teacher Students Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to Load Teacher Students",

    });

  }

};


/* =========================================================
   ADD / ASSIGN STUDENT TO TEACHER'S CLASS
   =========================================================

   If admission number already exists:
   → Student will NOT be duplicated.
   → Existing student will be moved to teacher's
     assigned class-section.

   If admission number does not exist:
   → New student will be created.
   ========================================================= */

export const addTeacherStudent = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      teacher_id,
      admission_no,
      student_name,
      father_name,
      mother_name,
      mobile_no,
      roll_no,
      gender,
      dob,
      house,
      status,
    } = req.body;


    if (!teacher_id) {

      res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });

      return;
    }


    if (!admission_no) {

      res.status(400).json({
        success: false,
        message: "Admission Number is required",
      });

      return;
    }


    if (!student_name) {

      res.status(400).json({
        success: false,
        message: "Student Name is required",
      });

      return;
    }


    /* -----------------------------------------
       Find teacher assignment
    ----------------------------------------- */

    const assignment =
      await getTeacherAssignment(teacher_id);


    if (!assignment) {

      res.status(403).json({
        success: false,
        message:
          "You are not assigned to any class-section",
      });

      return;
    }


    /* -----------------------------------------
       Check whether student already exists
    ----------------------------------------- */

    const existingStudent =
      await pool.query(
        `
        SELECT *
        FROM students
        WHERE admission_no = $1
        LIMIT 1
        `,
        [admission_no]
      );


    /* =====================================================
       EXISTING STUDENT
       ===================================================== */

    if (existingStudent.rows.length > 0) {

      const student =
        existingStudent.rows[0];


      const updated =
        await pool.query(
          `
          UPDATE students
          SET
            class = $1,
            section = $2,
            student_status = 'Active',
            removal_reason = NULL,
            removed_at = NULL
          WHERE id = $3
          RETURNING *
          `,
          [
            assignment.class_name,
            assignment.section,
            student.id,
          ]
        );


      res.status(200).json({

        success: true,

        message:
          "Existing Student Added to Your Class Successfully",

        student:
          updated.rows[0],

      });

      return;
    }


    /* =====================================================
       NEW STUDENT
       ===================================================== */

    const result =
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
          student_status
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          'Active'
        )
        RETURNING *
        `,
        [
          admission_no,
          student_name,
          father_name || null,
          mother_name || null,
          mobile_no || null,
          assignment.class_name,
          assignment.section,
          roll_no || null,
          gender || null,
          dob || null,
          house || null,
          status || "Active",
        ]
      );


    res.status(201).json({

      success: true,

      message:
        "Student Added Successfully",

      student:
        result.rows[0],

    });

  } catch (error) {

    console.error(
      "Add Teacher Student Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to Add Student",

    });

  }

};


/* =========================================================
   UPDATE STUDENT BY CLASS TEACHER
   ========================================================= */

export const updateTeacherStudent = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { id } = req.params;

    const {
      teacher_id,
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
    } = req.body;


    if (!teacher_id) {

      res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });

      return;
    }


    if (!id) {

      res.status(400).json({
        success: false,
        message: "Student ID is required",
      });

      return;
    }


    /* -----------------------------------------
       Find teacher assignment
    ----------------------------------------- */

    const assignment =
      await getTeacherAssignment(teacher_id);


    if (!assignment) {

      res.status(403).json({
        success: false,
        message:
          "You are not assigned to any class-section",
      });

      return;
    }


    /* -----------------------------------------
       Check student belongs to teacher's
       current class-section
    ----------------------------------------- */

    const studentCheck =
      await pool.query(
        `
        SELECT *
        FROM students
        WHERE id = $1
          AND class = $2
          AND section = $3
          AND COALESCE(student_status, 'Active') = 'Active'
        `,
        [
          id,
          assignment.class_name,
          assignment.section,
        ]
      );


    if (studentCheck.rows.length === 0) {

      res.status(403).json({

        success: false,

        message:
          "This student does not belong to your active class-section",

      });

      return;
    }


    /* -----------------------------------------
       Update student

       Class / Section can also be changed.
       This allows the teacher to shift a student.
    ----------------------------------------- */

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
          student_status = 'Active',
          removal_reason = NULL,
          removed_at = NULL
        WHERE id = $13
        RETURNING *
        `,
        [
          admission_no,
          student_name,
          father_name || null,
          mother_name || null,
          mobile_no || null,
          studentClass,
          section,
          roll_no || null,
          gender || null,
          dob || null,
          house || null,
          status || "Active",
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
      "Update Teacher Student Error:",
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
   REMOVE STUDENT FROM TEACHER'S CLASS
   =========================================================

   IMPORTANT:
   This is NOT a permanent DELETE.

   Student remains in database.

   student_status = Removed
   removal_reason = supplied reason
   removed_at = current timestamp
   ========================================================= */

export const removeTeacherStudent = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { id } = req.params;

    const {
      teacher_id,
      removal_reason,
    } = req.body;


    if (!teacher_id) {

      res.status(400).json({

        success: false,

        message:
          "Teacher ID is required",

      });

      return;
    }


    if (!removal_reason) {

      res.status(400).json({

        success: false,

        message:
          "Removal reason is required",

      });

      return;
    }


    /* -----------------------------------------
       Find teacher assignment
    ----------------------------------------- */

    const assignment =
      await getTeacherAssignment(teacher_id);


    if (!assignment) {

      res.status(403).json({

        success: false,

        message:
          "You are not assigned to any class-section",

      });

      return;
    }


    /* -----------------------------------------
       Verify student belongs to teacher
    ----------------------------------------- */

    const studentCheck =
      await pool.query(
        `
        SELECT id
        FROM students
        WHERE id = $1
          AND class = $2
          AND section = $3
          AND COALESCE(student_status, 'Active') = 'Active'
        `,
        [
          id,
          assignment.class_name,
          assignment.section,
        ]
      );


    if (studentCheck.rows.length === 0) {

      res.status(403).json({

        success: false,

        message:
          "Student does not belong to your active class-section",

      });

      return;
    }


    /* -----------------------------------------
       SOFT REMOVE
       -----------------------------------------
       NEVER DELETE FROM students
    ----------------------------------------- */

    const result =
      await pool.query(
        `
        UPDATE students
        SET
          student_status = 'Removed',
          removal_reason = $1,
          removed_at = NOW()
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
          removal_reason,
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
        "Student Removed From Your Class Successfully",

      student:
        result.rows[0],

    });

  } catch (error) {

    console.error(
      "Remove Teacher Student Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to Remove Student",

    });

  }

};