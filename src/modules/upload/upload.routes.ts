import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { uploadImageBufferToCloudinary } from "../../config/cloudinary";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

const handleSingleImageUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Image size must be less than 5MB"
            : err.message,
      });
    }
    if (err instanceof Error) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

router.post(
  "/",
  handleSingleImageUpload,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image file to upload",
        });
      }

      const result = await uploadImageBufferToCloudinary(req.file.buffer);
      return res.status(200).json({
        success: true,
        data: result,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    }
  }
);

export const uploadRouter = router;
