import { Router } from "express";

import upload from "../middleware/upload";

import {
  uploadStudents,
  getStudents,
  getStudentByAdmission,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";

const router = Router();


/* ===========================
   Upload Student Excel
=========================== */

router.post(
  "/upload",
  upload.single("file"),
  uploadStudents
);


/* ===========================
   Get All Students
=========================== */

router.get(
  "/",
  getStudents
);


/* ===========================
   Get Student By Admission No
=========================== */

router.get(
  "/admission/:admission_no",
  getStudentByAdmission
);


/* ===========================
   Update Student
=========================== */

router.put(
  "/:id",
  updateStudent
);


/* ===========================
   Delete Student
=========================== */

router.delete(
  "/:id",
  deleteStudent
);


export default router;