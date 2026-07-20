import { Router } from "express";

import {
  saveClass,
  getClasses,
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

export default router;