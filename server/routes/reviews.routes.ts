import express from "express";
import { db } from "../database";
import { and, eq } from "drizzle-orm";
import { reviews } from "../database/schema";
import verifyAuth from "../middleware/verify-auth";

const router = express.Router();

// GET /api/reviews/:id
router.get("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.currentUser;

    const allReviews = await db
      .select()
      .from(reviews)
      .where(
        and(eq(reviews.productId, id), eq(reviews.userId, currentUser.id))
      );

    res.status(200).json({ success: true, reviews: allReviews });
  } catch (err) {
    console.log("Get Reviews Err", err);

    res.status(500).json({ success: false });
  }
});

// POST /api/reviews/:id
router.post("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.currentUser;

    const { comment, rating } = req.body;

    await db.insert(reviews).values({
      userId: currentUser.id,
      productId: id,
      name: currentUser.name,
      comment,
      rating,
    });

    res
      .status(201)
      .json({ success: true, message: "Add review successfully!" });
  } catch (err) {
    console.log("Add Review Err", err);

    res.status(500).json({ success: false });
  }
});

export default router;
