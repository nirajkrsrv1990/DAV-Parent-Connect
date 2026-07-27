import { Router } from "express";
import { getRecentActivities } from "../controllers/activity.controller";

const router = Router();

router.get(
  "/recent",
  getRecentActivities
);

export default router;