import { Router } from "express";

import {
  getTeacherStudents,
  addTeacherStudent,
  updateTeacherStudent,
  removeTeacherStudent,
} from "../controllers/teacherStudent.controller";

const router = Router();

/* =========================================================
   GET STUDENTS OF CLASS TEACHER
   ========================================================= */

router.get(
  "/:teacher_id",
  getTeacherStudents
);


/* =========================================================
   ADD / ASSIGN STUDENT
   ========================================================= */

router.post(
  "/",
  addTeacherStudent
);


/* =========================================================
   UPDATE STUDENT
   ========================================================= */

router.put(
  "/:id",
  updateTeacherStudent
);


/* =========================================================
   REMOVE STUDENT FROM TEACHER'S CLASS
   Soft Remove - NOT Permanent Delete
   ========================================================= */

router.patch(
  "/:id/remove",
  removeTeacherStudent
);


export default router;