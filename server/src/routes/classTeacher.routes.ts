import { Router } from "express";

import {
  assignClassTeacher,
  getClassTeacher,
} from "../controllers/classTeacher.controller";

const router = Router();

/* ===========================
   ASSIGN CLASS TEACHER
=========================== */

router.post(
  "/",
  assignClassTeacher
);

/* ===========================
   GET CLASS TEACHER
=========================== */

router.get(
  "/:teacher_id",
  getClassTeacher
);

export default router;