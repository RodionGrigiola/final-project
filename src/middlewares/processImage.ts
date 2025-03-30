import sharp from "sharp";
import { Request, Response, NextFunction } from "express";

export const processUserPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) return next();

    // Optimize image (resize + convert to WebP + reduce quality)
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();

    // Convert to Base64
    req.body.photo = `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
    next();
  } catch (err) {
    next(err);
  }
};
