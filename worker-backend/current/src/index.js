import { Hono } from "hono";
import { cors } from "hono/cors";
import { SignJWT, jwtVerify } from "jose";
import Stripe from "stripe";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
  })
);

const USERS = [];

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function createToken(user, env) {
  const secret = new TextEncoder().encode(env.JWT_SECRET || "demo_secret");

  return new SignJWT({
    id: user.id,
    email: user.email,
    plan: user.plan || "free"
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

async function verifyUser(c) {
  const auth = c.req.header("Authorization");

  if (!auth || !auth.startsWith("Bearer ")) return null;

  try {
    const token = auth.split(" ")[1];
    const secret = new TextEncoder().encode(c.env.JWT_SECRET || "demo_secret");
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "🚀 RV Astro Vastu Cloudflare API Running"
  });
});

app.post("/api/auth/register", async (c) => {
  const { name, email, password } = await c.req.json();

  if (!name || !email || !password) {
    return c.json({ message: "Name, email and password required" }, 400);
  }

  const existing = USERS.find((u) => u.email === email.toLowerCase());

  if (existing) {
    return c.json({ message: "User already exists" }, 400);
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: await hashPassword(password),
    plan: "free"
  };

  USERS.push(user);

  const token = await createToken(user, c.env);

  return c.json({
    token,
    refreshToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan
    }
  });
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = USERS.find((u) => u.email === email?.toLowerCase());

  if (!user) {
    return c.json({ message: "User not found. Please create account first." }, 404);
  }

  const hashed = await hashPassword(password);

  if (hashed !== user.password) {
    return c.json({ message: "Invalid password" }, 401);
  }

  const token = await createToken(user, c.env);

  return c.json({
    token,
    refreshToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan
    }
  });
});

app.post("/api/kundali/generate", async (c) => {
  const { name, dob, time, place } = await c.req.json();

  if (!dob || !time || !place) {
    return c.json({ success: false, message: "DOB, time and place required" }, 400);
  }

  return c.json({
    success: true,
    kundali: {
      native: { name, dob, time, place },
      ascendant: "Aries",
      sunSign: "Aries",
      moonSign: "Taurus",
      planets: {
        Sun: { sign: "Aries", degree: 0 },
        Moon: { sign: "Taurus", degree: 13 },
        Mars: { sign: "Gemini", degree: 26 },
        Mercury: { sign: "Cancer", degree: 9 },
        Jupiter: { sign: "Leo", degree: 22 },
        Venus: { sign: "Virgo", degree: 5 },
        Saturn: { sign: "Libra", degree: 18 }
      },
      houses: {
        House_1: "Taurus",
        House_2: "Gemini",
        House_3: "Cancer",
        House_4: "Leo",
        House_5: "Virgo",
        House_6: "Libra",
        House_7: "Scorpio",
        House_8: "Sagittarius",
        House_9: "Capricorn",
        House_10: "Aquarius",
        House_11: "Pisces",
        House_12: "Aries"
      },
      dasha: [
        { planet: "Sun", years: 6 },
        { planet: "Moon", years: 10 },
        { planet: "Mars", years: 7 },
        { planet: "Rahu", years: 18 },
        { planet: "Jupiter", years: 16 },
        { planet: "Saturn", years: 19 }
      ],
      meta: {
        engine: "cloudflare_worker_fallback_v1"
      }
    }
  });
});

app.get("/api/kundali/my", async (c) => {
  return c.json([]);
});

app.post("/api/match/kundali", async (c) => {
  const body = await c.req.json();

  const boy = body.boy || body.kundali1;
  const girl = body.girl || body.kundali2;

  if (!boy || !girl) {
    return c.json({ message: "Boy and Girl details required" }, 400);
  }

  return c.json({
    match: {
      score: 84,
      guna: 28,
      gunaMilan: 28,
      compatibility: 84,
      mangal: "Balanced",
      mangalDosha: "Balanced",
      verdict: "Highly Compatible 💖",
      matchType: "Strong Match"
    }
  });
});

app.post("/api/panchang/daily", async (c) => {
  const { date, place, lat, lon, tzone } = await c.req.json();

  if (!date) {
    return c.json({ success: false, message: "Date is required" }, 400);
  }

  return c.json({
    success: true,
    source: "cloudflare_fallback",
    place: place || "Dallas",
    date,
    location: {
      lat: lat || 32.7767,
      lon: lon || -96.797,
      tzone: tzone || -5
    },
    panchang: {
      tithi: "Shukla Paksha",
      nakshatra: "Rohini",
      yoga: "Shubha Yoga",
      karana: "Bava",
      sunrise: "06:22 AM",
      sunset: "07:58 PM",
      moonrise: "09:12 PM",
      moonset: "07:45 AM",
      rahuKaal: "10:30 AM - 12:00 PM",
      gulikaKaal: "07:30 AM - 09:00 AM",
      yamaGandam: "03:00 PM - 04:30 PM",
      abhijitMuhurat: "12:05 PM - 12:55 PM",
      brahmaMuhurat: "04:35 AM - 05:20 AM",
      amritKaal: "06:10 PM - 07:42 PM",
      durMuhurat: "01:15 PM - 02:05 PM"
    }
  });
});

app.post("/api/ai/chat-basic", async (c) => {
  const user = await verifyUser(c);

  if (!user) {
    return c.json({ message: "Login required" }, 401);
  }

  if (user.plan !== "pro") {
    return c.json({ message: "Upgrade to Pro required" }, 403);
  }

  const { message } = await c.req.json();

  return c.json({
    success: true,
    reply: `🔮 AI Astrology Insight: Based on "${message}", planetary alignment indicates growth, patience, and strategic timing.`
  });
});

app.post("/api/stripe/create-checkout-session", async (c) => {
  const user = await verifyUser(c);

  if (!user) {
    return c.json({ message: "Login required" }, 401);
  }

  if (!c.env.STRIPE_SECRET_KEY || !c.env.STRIPE_PRO_PRICE_ID) {
    return c.json({
      message: "Stripe is not configured yet"
    }, 500);
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: c.env.STRIPE_PRO_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: `${c.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?payment=success`,
    cancel_url: `${c.env.FRONTEND_URL || "http://localhost:3000"}/pricing?payment=cancelled`,
    customer_email: user.email,
    metadata: {
      userId: user.id
    }
  });

  return c.json({ url: session.url });
});

app.get("/api/stripe/me/subscription", async (c) => {
  const user = await verifyUser(c);

  if (!user) {
    return c.json({ message: "Login required" }, 401);
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan || "free",
      subscriptionStatus: user.plan === "pro" ? "active" : "inactive"
    }
  });
});

export default app;