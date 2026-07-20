import { Router } from "express";

import upload from "../middleware/upload";

import {
  uploadStudents,
  getStudents,
  getStudentByAdmission,
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
   Get Students
=========================== */

router.get(
  "/admission/:admission_no",
  getStudentByAdmission
);

export default router;