import { Router } from "express";
import {
  assignClassTeacher,
  createTeacher,
  getClassTeacher,
  teacherLogin,
  getTeachers,
  deleteTeacher,
  saveAttendance,
  getAttendance,
} from "../controllers/teacher.controller";

const router = Router();

// Auth Routes
router.post("/login", teacherLogin);

// Teacher CRUD Routes
router.get("/", getTeachers);
router.post("/create", createTeacher);
router.delete("/:id", deleteTeacher);

// Class Assignment Routes
router.post("/assign-class", assignClassTeacher);
router.get("/class-teacher/:teacher_id", getClassTeacher);

// Attendance Routes
router.post("/attendance", saveAttendance);
router.get("/attendance", getAttendance);

export default router;