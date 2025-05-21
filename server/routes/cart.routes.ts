import express from "express";
import { db } from "../database";
import { and, eq } from "drizzle-orm";
import verifyAuth from "../middleware/verify-auth";
import { cartItem, products } from "../database/schema";

const router = express.Router();

// GET /api/cart
router.get("/", verifyAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;

    // Get cart items
    const cartItems = await db
      .select()
      .from(cartItem)
      .innerJoin(products, eq(products.id, cartItem.productId))
      .where(eq(cartItem.userId, currentUser.id));

    res.status(200).json({ success: true, items: cartItems });
  } catch (err) {
    console.log("Get cart items Err", err);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/cart
router.post("/", verifyAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;

    const { productId, quantity } = req.body;

    // Check if product exists
    const productExist = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then((res) => res[0]);

    if (!productExist) {
      res.status(404).json({ success: false, message: "Product not found!" });
    }

    // Check if product is available (product quantity > cart item quantity)
    if (productExist.quantity && productExist.quantity < quantity) {
      res.status(400).json({
        success: false,
        message: `Only ${productExist.quantity} available in stocks`,
      });
    }

    // Add cart item
    await db.insert(cartItem).values({
      userId: currentUser.id,
      productId: productExist.id,
      quantity: 1,
    });

    res.status(201).json({ success: true, message: "Added product to cart" });
  } catch (err) {
    console.log("Add cart items Err", err);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PATCH /api/cart/:id
router.patch("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.currentUser;

    const { quantity, task } = req.body;

    // Input validation
    if (typeof quantity !== "number" || quantity < 0) {
      res.status(400).json({
        success: false,
        message: "Bad request! quantity must be a postive number",
      });
    }

    if (task !== "add" && task !== "reduce") {
      res.status(400).json({
        success: false,
        message: "Bad request! task must be either 'add' or 'reduce'",
      });
    }

    // Check if cart item exist
    const cartItemExist = await db
      .select()
      .from(cartItem)
      .innerJoin(products, eq(products.id, cartItem.productId))
      .where(and(eq(cartItem.id, id), eq(cartItem.userId, currentUser.id)))
      .then((res) => res[0]);

    if (!cartItemExist) {
      res.status(404).json({ success: false, message: "Item not found!" });
    }

    const currentQuantity = cartItemExist.cartItem.quantity ?? 0;

    const productQuantity = cartItemExist.products.quantity ?? 0;

    if (task === "add") {
      // Check if product is available (product quantity > cart item quantity + quality)
      if (productQuantity < currentQuantity + quantity) {
        res.status(400).json({
          success: false,
          message: `Only ${productQuantity} available in stocks`,
        });
      }

      // Update cart item quantity
      await db
        .update(cartItem)
        .set({ quantity: currentQuantity + quantity })
        .where(and(eq(cartItem.id, id), eq(cartItem.userId, currentUser.id)));

      res.status(200).json({ success: true, message: "Cart item updated!" });
    } else if (task === "reduce") {
      // Check if reduced quantity will give 0 and if yes, delete cart item.
      if (currentQuantity - quantity === 0) {
        await db
          .delete(cartItem)
          .where(and(eq(cartItem.id, id), eq(cartItem.userId, currentUser.id)));

        res.status(200).json({ success: true, message: "Cart item deleted!" });
      } else {
        // Update cart item quantity
        await db
          .update(cartItem)
          .set({ quantity: currentQuantity - quantity })
          .where(and(eq(cartItem.id, id), eq(cartItem.userId, currentUser.id)));

        res.status(200).json({ success: true, message: "Cart item updated!" });
      }
    }
  } catch (err) {
    console.log("Update cart items Err", err);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE /api/cart/:id
router.delete("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.currentUser;

    // Check if cart item exist
    const cartItemExist = await db
      .select()
      .from(cartItem)
      .innerJoin(products, eq(products.id, cartItem.productId))
      .where(and(eq(cartItem.id, id), eq(cartItem.userId, currentUser.id)))
      .then((res) => res[0]);

    if (!cartItemExist) {
      res.status(404).json({ success: false, message: "Item not found!" });
    }

    // Delete cart item
    await db
      .delete(cartItem)
      .where(and(eq(cartItem.id, id), eq(cartItem.userId, currentUser.id)));

    res.status(200).json({ success: true, message: "Cart item deleted!" });
  } catch (err) {
    console.log("Delete cart items Err", err);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
