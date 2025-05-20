import multer from "multer";

// Set up Multer to handle files in memory (no disk storage)
export const multerUpload = multer({
  storage: multer.memoryStorage(), // Files will be in req.files as Buffers
});
