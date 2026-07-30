import { Router } from "express";
import multer from "multer";
import path from "path";
import { createHomework, getStudentHomework } from "../controllers/homework.controller";

const router = Router();

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

router.post(
  "/create",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createHomework
);

// Yeh route frontend ke naye fetch URL ke sath match ho raha hai
router.get("/student/:admission_no", getStudentHomework);

export default router;