import { Request, Response } from "express";
import pool from "../config/db";

/* =====================================================
   GET ACADEMIC CALENDAR
   Holidays + Vacations + Celebrations + Exams
===================================================== */

export const getAcademicCalendar = async (
  req: Request,
  res: Response
) => {
  try {
    const session =
      typeof req.query.session === "string"
        ? req.query.session.trim()
        : "2026-27";

    const result = await pool.query(
      `
      SELECT
        id,
        session,
        event_type,
        title,
        start_date,
        end_date,
        date_text,
        description,
        is_tentative,
        is_active,
        created_at
      FROM academic_calendar
      WHERE session = $1
        AND is_active = TRUE
      ORDER BY
        start_date NULLS LAST,
        id ASC
      `,
      [session]
    );

    return res.json({
      success: true,
      session,
      data: result.rows,
    });
  } catch (err) {
    console.error("Academic Calendar Fetch Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch academic calendar.",
    });
  }
};