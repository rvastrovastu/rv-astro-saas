import 'dotenv/config';

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import axios from "axios";
import cookieParser from "cookie-parser";

// ========================
// ROUTES
// ========================
import matchRoutes from "./routes/matchRoutes.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import kundaliRoutes from "./routes/kundaliRoutes.js";
import panchangRoutes from "./routes/panchangRoutes.js";
import westernRoutes from "./routes/westernRoutes.js";

// STRIPE ROUTES
import stripeRoutes from "./routes/stripe.js";
import stripeWebhookRoutes from "./routes/stripeWebhook.js";

// ========================
// INIT APP
// ========================
const app = express();

// ========================
// ENV CHECK
// ========================
// Allow skipping DB during local/dev testing by setting SKIP_DB=true
if (!process.env.MONGO_URI && !process.env.SKIP_DB) {
  console.error("❌ MONGO_URI missing in .env (set SKIP_DB=true to skip DB in dev)");
  process.exit(1);
}

// ========================
// SECURITY MIDDLEWARE
// ========================
app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:3000",
    credentials: true
  })
);

// ========================
// STRIPE WEBHOOK MUST BE BEFORE express.json()
// POST /api/stripe/webhook
// ========================
app.use("/api/stripe", stripeWebhookRoutes);

// ========================
// BODY PARSER
// ========================
app.use(express.json());
app.use(cookieParser());

// ========================
// LOGGING
// ========================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ========================
// RATE LIMITING
// ========================
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later."
  })
);

// ========================
// HEALTH CHECK
// ========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 RV Astro SaaS Backend Running"
  });
});

// ========================
// ROUTES: CORE SYSTEM
// ========================
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/kundali", kundaliRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/panchang", panchangRoutes);
app.use("/api/western", westernRoutes);

// ========================
// ROUTES: STRIPE SYSTEM
// POST /api/stripe/create-checkout-session
// POST /api/stripe/customer-portal
// GET  /api/stripe/me/subscription
// ========================
app.use("/api/stripe", stripeRoutes);

// ========================
// FALLBACK KUNDALI GENERATION
// Keep this only if kundaliRoutes.js does NOT already define /generate
// ========================
app.post("/api/kundali/generate-fallback", async (req, res) => {
  try {
    const { name, dob, time, place } = req.body;

    if (!dob || !time || !place) {
      return res.status(400).json({
        success: false,
        message: "dob, time, and place are required"
      });
    }

    // TEMP GEO FIX
    // Replace with real geocoding later
    const lat = 25.3;
    const lon = 85.5;

    const response = await axios.post("http://127.0.0.1:5002/kundali", {
      name,
      dob,
      time,
      place,
      lat,
      lon
    });

    return res.json({
      success: true,
      kundali: response.data
    });
  } catch (error) {
    console.error("❌ Kundali Fallback Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Kundali generation failed"
    });
  }
});

// ========================
// BASIC AI FALLBACK
// ========================
app.post("/api/ai/chat-basic", (req, res) => {
  const message = req.body.message || "";

  res.json({
    success: true,
    reply: `🔮 Astrology Insight: Based on "${message}", planetary alignment indicates growth and opportunities.`
  });
});

// ========================
// GLOBAL ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// ========================
// DB + SERVER START
// ========================
const PORT = process.env.PORT || 5001;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 RV Astro SaaS running on port ${PORT}`);
  });
};

if (process.env.SKIP_DB) {
  console.warn("⚠️ SKIP_DB=true — starting server without DB connection (dev mode)");
  startServer();
} else {
  connectDB().then(startServer);
}