import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

// CREATE CHECKOUT
router.post("/create-checkout", protect, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/"
  });

  res.json({ url: session.url });
});

// SUCCESS WEBHOOK (SIMPLIFIED)
router.post("/success", protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    plan: "pro"
  });

  res.json({ success: true });
});

export default router;