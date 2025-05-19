import express from "express";

const router = express.Router();

// POST /api/onboard
router.post("/onboard", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
