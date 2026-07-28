import { Router } from "express";
import multer from "multer";
import path from "path";
import { createHomework, getStudentHomework } from "../controllers/homework.controller";

const router = Router();

// Configure storage for uploaded PDF and Image files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to create homework with optional file attachments (PDF/Image)
router.post(
  "/create",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createHomework
);

// Route to fetch homework list for a specific student using admission number
router.get("/student/:admission_no", getStudentHomework);

export default router;