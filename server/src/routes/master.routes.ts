import { Router } from "express";

import {
  saveClass,
  getClasses,
  saveMarksPattern,
  getMarksPatterns,
  deleteMarksPattern,
  updateMarksPattern,
} from "../controllers/master.controller";

const router = Router();

/* ==========================
   SAVE CLASS
========================== */

router.post(
  "/class",
  saveClass
);

/* ==========================
   GET CLASSES
========================== */

router.get(
  "/class",
  getClasses
);
/* ==========================
   MARKS PATTERN
========================== */

router.post(
  "/marks-pattern",
  saveMarksPattern
);

router.get(
  "/marks-pattern",
  getMarksPatterns
);

router.delete(
  "/marks-pattern/:id",
  deleteMarksPattern
);
router.put(
  "/marks-pattern/:id",
  updateMarksPattern
);

export default router;