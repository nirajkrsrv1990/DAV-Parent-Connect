import { Router } from "express";
import {
 parentSignup,
 parentLogin,
 getParentDashboard,
 markNotificationsAsRead,
 getAnnualAttendance,
 getParentAttendance
} from "../controllers/parent.controller";

const router = Router();

/* ===========================
   PARENT SIGNUP
=========================== */
router.post("/signup", parentSignup);

/* ===========================
   PARENT LOGIN
=========================== */
router.post("/login", parentLogin);

/* ===========================
   PARENT DASHBOARD & NOTIFICATIONS
=========================== */
router.get(
  "/annual-attendance/:admission_no",
  getAnnualAttendance
);
router.get(
 "/dashboard/:admission_no",
 getParentDashboard
);
// ============================
// MONTHLY ATTENDANCE
// ============================

router.get(
 "/attendance/:admission_no",
 getParentAttendance
);

/* ===========================
   MARK NOTIFICATIONS AS READ
=========================== */
router.put("/notifications/read/:admission_no", markNotificationsAsRead);

export default router;