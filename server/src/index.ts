import dotenv from "dotenv";
import app from "./app";
import "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log(`🚀 DAV ERP Server Running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("==================================");
});