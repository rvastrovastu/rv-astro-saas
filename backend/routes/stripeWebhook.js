import express from "express";
import Stripe from "stripe";
import AuthUser from "../models/AuthUser.js";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripe) {
      return res.status(500).json({
        message: "Stripe is not configured"
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
          await AuthUser.findByIdAndUpdate(userId, {
            plan: "pro",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            subscriptionStatus: "active"
          });
        }
      }

      if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object;
        const isActive = ["active", "trialing"].includes(subscription.status);

        await AuthUser.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan: isActive ? "pro" : "free",
            subscriptionStatus: subscription.status
          }
        );
      }

      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object;

        await AuthUser.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan: "free",
            subscriptionStatus: subscription.status || "cancelled"
          }
        );
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook handler failed:", err);
      res.status(500).json({ message: "Webhook handler failed" });
    }
  }
);

export default router;