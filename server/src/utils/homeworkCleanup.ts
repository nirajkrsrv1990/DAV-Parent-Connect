import fs from "fs";
import path from "path";
import pool from "../config/db";

/* ==========================================
   AUTOMATIC HOMEWORK CLEANUP
   Deletes homework after 7 days
========================================== */

export const cleanupOldHomework = async () => {
  try {
    console.log("🧹 Checking for homework older than 7 days...");

    // Find homework older than 7 days
    const oldHomework = await pool.query(`
      SELECT
        id,
        pdf_url,
        image_url
      FROM homework
      WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
    `);

    if (oldHomework.rows.length === 0) {
      console.log("✅ No old homework found.");
      return;
    }

    const uploadsDir = path.join(__dirname, "../../uploads");

    for (const homework of oldHomework.rows) {
      // ==========================================
      // DELETE PDF FILE
      // ==========================================
      if (homework.pdf_url) {
        const pdfPath = path.join(
          uploadsDir,
          path.basename(homework.pdf_url)
        );

        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
          console.log(`🗑️ Deleted PDF: ${pdfPath}`);
        }
      }

      // ==========================================
      // DELETE IMAGE FILE
      // ==========================================
      if (homework.image_url) {
        const imagePath = path.join(
          uploadsDir,
          path.basename(homework.image_url)
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`🗑️ Deleted Image: ${imagePath}`);
        }
      }

      // ==========================================
      // DELETE DATABASE RECORD
      // ==========================================
      await pool.query(
        `DELETE FROM homework WHERE id = $1`,
        [homework.id]
      );

      console.log(`🗑️ Deleted homework record ID: ${homework.id}`);
    }

    console.log(
      `✅ Homework cleanup completed. ${oldHomework.rows.length} old homework record(s) deleted.`
    );

  } catch (error) {
    console.error("❌ Homework Cleanup Error:", error);
  }
};