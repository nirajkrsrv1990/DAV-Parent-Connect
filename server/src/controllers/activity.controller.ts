import { Request, Response } from "express";
import pool from "../config/db";

export const getRecentActivities = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        activity,
        module,
        created_at
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to load activities",
    });
  }
};