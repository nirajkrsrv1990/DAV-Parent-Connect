import { Request, Response } from "express";
import pool from "../config/db";

export const assignClassTeacher = async (req: Request, res: Response) => {
  try {
    const { teacher_id, class_name, section } = req.body;

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
      [teacher_id, class_name, section]
    );

    res.json({
      success: true,
      message: "Class Teacher Assigned Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Assign Class Teacher",
    });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { teacher_name, mobile, email, qualification, designation, class_name, section } = req.body;

    await client.query("BEGIN"); // Transaction start

    const count = await client.query("SELECT COUNT(*) FROM teachers");

    const nextNumber = Number(count.rows[0].count) + 1;

    const teacher_id = "DAVT" + nextNumber.toString().padStart(4, "0");

    const password = "Dav@123";

    const result = await client.query(
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
        password,
      ]
    );

    if (class_name && section) {
      await client.query(
        `
        INSERT INTO class_teacher_master
        (
          teacher_id,
          class_name,
          section
        )
        VALUES
        ($1, $2, $3)
        `,
        [teacher_id, class_name, section]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      teacher: result.rows[0],
      message: "Teacher Added and Assigned Successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Save Teacher",
    });
  } finally {
    client.release();
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { teacher_name, mobile, email, qualification, designation, class_name, section, status } = req.body;

    await client.query("BEGIN");

    const teacherResult = await client.query(
      `
      UPDATE teachers
      SET teacher_name = $1,
          mobile = $2,
          email = $3,
          qualification = $4,
          designation = $5,
          status = $6
      WHERE id = $7
      RETURNING teacher_id
      `,
      [teacher_name, mobile, email, qualification, designation, status, id]
    );

    if (teacherResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const teacher_id = teacherResult.rows[0].teacher_id;

    const checkAssignment = await client.query(
      `SELECT * FROM class_teacher_master WHERE teacher_id = $1`,
      [teacher_id]
    );

    if (class_name && section) {
      if (checkAssignment.rows.length > 0) {
        await client.query(
          `
          UPDATE class_teacher_master
          SET class_name = $1, section = $2
          WHERE teacher_id = $3
          `,
          [class_name, section, teacher_id]
        );
      } else {
        await client.query(
          `
          INSERT INTO class_teacher_master (teacher_id, class_name, section)
          VALUES ($1, $2, $3)
          `,
          [teacher_id, class_name, section]
        );
      }
    } else {
      await client.query(
        `DELETE FROM class_teacher_master WHERE teacher_id = $1`,
        [teacher_id]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Teacher Updated Successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Update Teacher",
    });
  } finally {
    client.release();
  }
};

export const getClassTeacher = async (req: Request, res: Response) => {
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
        assignment: null,
      });
    }

    res.json({
      success: true,
      assignment: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Load Class Teacher",
    });
  }
};

export const teacherLogin = async (req: Request, res: Response) => {
  try {
    const { teacher_id, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM teachers
      WHERE teacher_id=$1
      AND password=$2
      AND status='Active'
      `,
      [teacher_id, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Teacher ID or Password",
      });
    }

    res.json({
      success: true,
      teacher: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
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
      teachers: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Load Teachers",
    });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM class_teacher_master WHERE teacher_id=(SELECT teacher_id FROM teachers WHERE id=$1)",
      [id]
    );

    await pool.query("DELETE FROM teachers WHERE id=$1", [id]);

    res.json({
      success: true,
      message: "Teacher Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to Delete Teacher",
    });
  }
};

export const saveAttendance = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { attendanceDate, teacher_db_id, teacher_id, students } = req.body;
    const teacherPrimaryKey = teacher_db_id || teacher_id;

    await client.query("BEGIN");

    for (const item of students) {
      await client.query(
        `
        DELETE FROM attendance
        WHERE
        student_id = $1
        AND attendance_date = $2
        `,
        [item.id, attendanceDate]
      );

      await client.query(
        `
        INSERT INTO attendance
        (
          student_id,
          attendance_date,
          status,
          teacher_id
        )
        VALUES
        ($1, $2, $3, $4)
        `,
        [item.id, attendanceDate, item.status, teacherPrimaryKey]
      );

      await client.query(
        `
        DELETE FROM parent_notifications
        WHERE student_id = $1 
        AND DATE(created_at) = $2 
        AND type = 'attendance'
        `,
        [item.id, attendanceDate]
      );

      const notificationTitle = "Attendance Update";
      const notificationMessage =
        item.status === "P"
          ? "Your child is Present today."
          : "Alert: Your child is Marked ABSENT today.";

      await client.query(
        `
        INSERT INTO parent_notifications
        (
          student_id,
          title,
          message,
          type
        )
        VALUES
        ($1, $2, $3, $4)
        `,
        [item.id, notificationTitle, notificationMessage, "attendance"]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Attendance Saved & Parent Notification Created Successfully!",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Attendance Save Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to Save Attendance",
    });
  } finally {
    client.release();
  }
};