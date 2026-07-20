import teacherRoutes from "./routes/teacher.routes";
import adminRoutes from "./routes/admin.routes";
import masterRoutes from "./routes/master.routes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/student.routes";
import classTeacherRoutes from "./routes/classTeacher.routes";
import parentRoutes from "./routes/parent.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("DAV ERP Backend Running...");
});

app.use("/api/students", studentRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use(
  "/api/class-teacher",
  classTeacherRoutes
);
app.use(
  "/api/parents",
  parentRoutes
);


export default app;