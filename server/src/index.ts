import dotenv from "dotenv";
import app from "./app";
import "./config/db";
import { cleanupOldHomework } from "./utils/homeworkCleanup";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("==================================");
  console.log(`🚀 DAV ERP Server Running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📱 Network: http://10.120.183.108:${PORT}`);
  console.log("==================================");

  // Run cleanup immediately when server starts
  cleanupOldHomework();

  // Run cleanup once every 24 hours
  setInterval(() => {
    cleanupOldHomework();
  }, 24 * 60 * 60 * 1000);
});