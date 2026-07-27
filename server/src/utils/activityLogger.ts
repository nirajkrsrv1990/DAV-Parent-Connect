import pool from "../config/db";

export async function logActivity(
  activity: string,
  module: string,
  createdBy: number | null = null
) {
  try {
    await pool.query(
      `
      INSERT INTO activity_logs
      (
        activity,
        module,
        created_by
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      `,
      [activity, module, createdBy]
    );
  } catch (err) {
    console.error("Activity Log Error:", err);
  }
}