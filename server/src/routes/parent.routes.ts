import { Router } from "express";
import {
  parentSignup,
  parentLogin,
  getParentDashboard,
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

export default router;