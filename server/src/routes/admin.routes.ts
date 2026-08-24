import { Router } from "express";

import {
  adminLogin,
  getDashboardStats,
  getAdminParentMessages,
} from "../controllers/admin.controller";

const router = Router();

/* Login */

router.post(
  "/login",
  adminLogin
);

/* Dashboard */

router.get(
  "/dashboard-stats",
  getDashboardStats
);
/* Parent Messages */

router.get(
  "/parent-messages",
  getAdminParentMessages
);

export default router;