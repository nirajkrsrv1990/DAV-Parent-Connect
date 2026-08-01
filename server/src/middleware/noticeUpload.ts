import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads", "notices");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const fileName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

    cb(null, fileName);
  },
});

const noticeUpload = multer({
  storage,

  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export default noticeUpload;