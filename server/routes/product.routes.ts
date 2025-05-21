import express from "express";
import { db } from "../database";
import { eq, sql } from "drizzle-orm";
import type { Request } from "express";
import { uploadFiles } from "../lib/s3";
import { multerUpload } from "../lib/multer";
import { products } from "../database/schema";
import verifyAuth from "../middleware/verify-auth";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const conditions = [];

    const { query, type, minPrice, maxPrice } = req.query;

    if (typeof query === "string" && query.trim()) {
      conditions.push(
        sql`LOWER(${products.name}) LIKE LOWER(${"%" + query.trim() + "%"})`
      );
    }

    if (type !== "any" && typeof type === "string" && type.trim()) {
      conditions.push(sql`${products.type} = ${type.trim()}`);
    }

    const minPriceNum = Number(minPrice) || 0;

    const maxPriceNum = Number(maxPrice) || 200;

    // const minPriceNum = 0;

    // const maxPriceNum = 200;

    if (!isNaN(minPriceNum) && minPriceNum >= 0) {
      conditions.push(sql`${products.price} >= ${minPriceNum}`);
    }

    if (!isNaN(maxPriceNum) && maxPriceNum >= 0) {
      conditions.push(sql`${products.price} <= ${maxPriceNum}`);
    }

    const filteredProducts = await db
      .select()
      .from(products)
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      );

    res.status(200).json({ success: true, products: filteredProducts });
  } catch (err) {
    console.log("Get filtered products Err", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((res) => res[0]);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.log("Get product Err", err);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const getProductDetails = (req: Request) => {
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

  return {
    name,
    type,
    color,
    price,
    quantity,
    parsedSizes,
    parsedBandSizes,
    parsedCupSizes,
    parsedImages,
  };
};

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
        parsedSizes,
        parsedBandSizes,
        parsedCupSizes,
        parsedImages,
      } = getProductDetails(req);

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

// PATCH /api/products/:id
router.patch(
  "/:id",
  verifyAuth,
  multerUpload.array("newFiles"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const currentUser = req.currentUser;

      const {
        name,
        type,
        color,
        price,
        quantity,
        parsedSizes,
        parsedBandSizes,
        parsedCupSizes,
        parsedImages,
      } = getProductDetails(req);

      const newFiles = (req.files as Express.Multer.File[]).map((file) => ({
        buffer: file.buffer,
        fileName: file.originalname,
        contentType: file.mimetype,
      }));

      // Upload Images to s3
      const imageUrls = await uploadFiles(newFiles);

      // Update product
      await db
        .update(products)
        .set({
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
        })
        .where(eq(products.id, id));

      res.status(200).json({ success: true, message: "Product updated!" });
    } catch (err) {
      console.log("Update product Err", err);

      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

// DELETE /api/products/:id
router.delete("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.currentUser;

    // Check if product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((res) => res[0]);

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found!" });
    }

    // Check if user created that product
    if (product.userId !== currentUser.id) {
      res.status(401).json({
        success: false,
        message: "You can only delete your own product!",
      });
    }

    await db.delete(products).where(eq(products.id, id));

    res.status(200).json({ success: true, message: "Product deleted!" });
  } catch (err) {
    console.log("Delete product Err", err);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
