import { Request, Response } from "express";
import pool from "../config/db";

export const createNotice = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      title,
      description,
      notice_date,
    } = req.body;
    const pdf_url = req.file
  ? `/uploads/notices/${req.file.filename}`
  : null;

    await pool.query(
      `
      INSERT INTO notices
      (
        title,
        description,
        notice_date
        pdf_url
      )
      VALUES
      ($1,$2,$3,$4)
      `,
      [
    title,
  description,
  notice_date,
  pdf_url,
]
    );

    res.json({
      success: true,
      message: "Notice uploaded successfully.",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Notice upload failed.",
    });

  }

};

export const getNotices = async (
  req: Request,
  res: Response
) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM notices
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch notices.",
    });

  }

};