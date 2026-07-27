import { Router } from "express";

import {
  createNotice,
  getNotices,
} from "../controllers/notices.controller";

const router = Router();

router.post(
  "/create",
  createNotice
);

router.get(
  "/",
  getNotices
);

export default router;