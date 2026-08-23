import { Router } from "express";

import {
  getAcademicCalendar,
} from "../controllers/academic-calendar.controller";

const router = Router();

/* =====================================================
   GET ACADEMIC CALENDAR
   Example:
   /api/academic-calendar?session=2026-27
===================================================== */

router.get("/", getAcademicCalendar);

export default router;