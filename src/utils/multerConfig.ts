import path from "node:path";
import multer from "multer";
import { Request, Express } from "express";

const storage = multer.memoryStorage(); // Store file in memory for processing

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Allowed MIME types and extensions
  const allowedMimes = ["image/jpeg", "image/png"];
  const allowedExtensions = [".jpg", ".jpeg", ".png"];

  // Check MIME type
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error("Only JPG/PNG files are allowed!"));
  }

  const fileExt = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExt)) {
    return cb(new Error("Invalid file extension. Use .jpg or .png"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadUserPhoto = upload.single("photo");
