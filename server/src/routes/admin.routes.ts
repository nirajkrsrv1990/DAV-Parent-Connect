import { Router } from "express";

import {
  adminLogin,
  getDashboardStats,
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

export default router;