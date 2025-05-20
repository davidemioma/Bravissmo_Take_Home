import express from "express";
import { db } from "../database";
import { eq } from "drizzle-orm";
import { users } from "../database/schema";
import { OnBoardSchema } from "../utils/validators";
import verifyAuth from "../middleware/verify-auth";

const router = express.Router();

// POST /api/onboard
router.post("/onboard", async (req, res) => {
  try {
    const values = OnBoardSchema.safeParse(req.body);

    if (values.success) {
      const validatedData = values.data;

      // Check if user exists
      const userExists = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, validatedData.clerkId))
        .then((res) => res[0]);

      // Onboard if user does not exist
      if (userExists) {
        res.status(200).json({
          success: true,
          message: "User already exists",
        });
      } else {
        await db.insert(users).values({
          ...validatedData,
        });
        res.status(201).json({
          success: true,
          message: "New user created",
        });
      }
    } else {
      console.log("Zod validation Err (Onboard)");

      res.status(400).json({
        success: false,
        message: values.error.errors[0].message,
      });
    }
  } catch (err) {
    console.log("Onboard Err", err);

    res.status(500).json({ success: false });
  }
});

// GET /api/user
router.get("/user", verifyAuth, async (req, res) => {
  res.status(200).json({ user: req.currentUser });
});

export default router;
