import express from "express";
import Stripe from "stripe";
import AuthUser from "../models/AuthUser.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

if (!stripeSecretKey) {
  console.warn("⚠️ STRIPE_SECRET_KEY missing — Stripe disabled");
}

router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY in backend .env"
      });
    }

    if (!process.env.STRIPE_PRO_PRICE_ID) {
      return res.status(500).json({
        message: "STRIPE_PRO_PRICE_ID missing in backend .env"
      });
    }

    const user = await AuthUser.findById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: String(user._id)
        }
      });

      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: String(user._id)
      },
      subscription_data: {
        metadata: {
          userId: String(user._id)
        }
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ message: "Stripe checkout failed" });
  }
});

router.post("/customer-portal", protect, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY in backend .env"
      });
    }

    const user = await AuthUser.findById(req.user._id || req.user.id);

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ message: "No Stripe customer found" });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ url: portal.url });
  } catch (err) {
    console.error("Stripe Portal Error:", err);
    res.status(500).json({ message: "Customer portal failed" });
  }
});

router.get("/me/subscription", protect, async (req, res) => {
  try {
    const user = await AuthUser.findById(req.user._id || req.user.id).select(
      "name email plan subscriptionStatus stripeSubscriptionId"
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan || "free",
        subscriptionStatus: user.subscriptionStatus || "inactive",
        stripeSubscriptionId: user.stripeSubscriptionId || null
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load subscription" });
  }
});

export default router;