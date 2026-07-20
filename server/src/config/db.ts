import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool
  .connect()
  .then((client: any) => {
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  })
  .catch((err: Error) => {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
  });

export default pool;