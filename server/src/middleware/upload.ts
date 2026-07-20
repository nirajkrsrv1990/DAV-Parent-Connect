import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (
  _req: Request,
  _file: Express.Multer.File,
  cb
) => {
    cb(null, uploadPath);
  },

  filename: (
  _req: Request,
  file: Express.Multer.File,
  cb
) => {
    const fileName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

    cb(null, fileName);
  },
});

const upload = multer({
  storage,

  fileFilter: (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".xlsx" || ext === ".xls") {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed."));
    }
  },
});

export default upload;