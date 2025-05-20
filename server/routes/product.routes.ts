import express from "express";
import { uploadFiles } from "../lib/s3";
import verifyAuth from "../middleware/verify-auth";
import { db } from "../database";
import { products } from "../database/schema";
import { multerUpload } from "../lib/multer";

const router = express.Router();

// POST /api/products
router.post(
  "/",
  verifyAuth,
  multerUpload.array("newFiles"),
  async (req, res) => {
    try {
      const currentUser = req.currentUser;

      const {
        name,
        type,
        color,
        price,
        quantity,
        sizes,
        bandSizes,
        cupSizes,
        existingImages,
      } = req.body;

      // Parse array fields from JSON strings
      const parsedSizes = JSON.parse(sizes || "[]");

      const parsedBandSizes = JSON.parse(bandSizes || "[]");

      const parsedCupSizes = JSON.parse(cupSizes || "[]");

      const parsedImages = JSON.parse(existingImages || "[]");

      const newFiles = (req.files as Express.Multer.File[]).map((file) => ({
        buffer: file.buffer,
        fileName: file.originalname,
        contentType: file.mimetype,
      }));

      // Upload Images to s3
      const imageUrls = await uploadFiles(newFiles);

      // Create new product
      await db.insert(products).values({
        userId: currentUser.id,
        name,
        type,
        color,
        price: Number(price),
        quantity: Number(quantity),
        sizes: parsedSizes,
        bandSizes: parsedBandSizes.map(Number),
        cupSizes: parsedCupSizes.map(Number),
        images: [...imageUrls, ...parsedImages],
      });

      res.status(201).json({ success: true, message: "New product create" });
    } catch (err) {
      console.log("Create product Err", err);

      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

export default router;
