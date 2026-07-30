import { Router } from "express";
import {
  parentSignup,
  parentLogin,
  getParentDashboard,
  markNotificationsAsRead,
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
router.get("/dashboard/:admission_no", getParentDashboard);

/* ===========================
   MARK NOTIFICATIONS AS READ
=========================== */
router.put("/notifications/read/:admission_no", markNotificationsAsRead);

export default router;