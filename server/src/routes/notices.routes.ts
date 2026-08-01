import { Router } from "express";
import noticeUpload from "../middleware/noticeUpload";

import {
  createNotice,
  getNotices,
} from "../controllers/notices.controller";

const router = Router();

router.post(
  "/create",
  noticeUpload.single("pdf"),
  createNotice
);

router.get(
  "/",
  getNotices
);

export default router;