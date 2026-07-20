import { Router } from "express";


import {
  createTeacher,
  teacherLogin,
  getTeachers,
  assignClassTeacher,
  getClassTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller";

const router = Router();

/* ===========================
   CREATE TEACHER
=========================== */

router.post(
  "/create",
  createTeacher
);

/* ===========================
   TEACHER LOGIN
=========================== */

router.post(
  "/login",
  teacherLogin
);

/* ===========================
   GET ALL TEACHERS
=========================== */

router.get(
  "/",
  getTeachers
);
/* ===========================
   GET ALL TEACHERS
=========================== */

router.get(
  "/",
  getTeachers
);

/* ===========================
   ASSIGN CLASS TEACHER
=========================== */

router.post(
  "/assign-class-teacher",
  assignClassTeacher
);

/* ===========================
   GET CLASS TEACHER
=========================== */

router.get(
  "/class-teacher/:teacher_id",
  getClassTeacher
);
/* ===========================
   DELETE TEACHER
=========================== */

router.delete(
  "/:id",
  deleteTeacher
);
export default router;