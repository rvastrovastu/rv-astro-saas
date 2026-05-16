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

app.get("/api/panchang/daily", (c) => {
  return c.json({
    success: true,
    message: "Panchang API is live. Use POST method for data."
  });
});

app.post("/api/panchang/daily", async (c) => {
  try {
    const { date, place, lat, lon, tzone } = await c.req.json();

    if (!date) {
      return c.json({ success: false, message: "Date is required" }, 400);
    }

    const selectedDate = new Date(date);

    const payload = {
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1,
      day: selectedDate.getDate(),
      hour: 6,
      minute: 0,
      latitude: Number(lat) || 32.7767,
      longitude: Number(lon) || -96.797,
      timezone: Number(tzone) || -5,
      city: place || "Dallas",
      config: {
        observation_point: "topocentric",
        ayanamsha: "lahiri"
      }
    };

    const fallbackPanchang = {
      tithi: "Unavailable from API",
      nakshatra: "Unavailable from API",
      yoga: "Unavailable from API",
      karana: "Unavailable from API",
      sunrise: "Unavailable from API",
      sunset: "Unavailable from API",
      moonrise: "Unavailable from API",
      moonset: "Unavailable from API",
      rahuKaal: "Unavailable from API",
      gulikaKaal: "Unavailable from API",
      yamaGandam: "Unavailable from API",
      abhijitMuhurat: "Unavailable from API",
      brahmaMuhurat: "Unavailable from API",
      amritKaal: "Unavailable from API",
      durMuhurat: "Unavailable from API"
    };

    if (!c.env.FREE_ASTROLOGY_API_KEY) {
      return c.json({
        success: true,
        source: "fallback",
        debug: "FREE_ASTROLOGY_API_KEY is missing in Cloudflare Worker secrets",
        place: place || "Dallas",
        date,
        panchang: fallbackPanchang
      });
    }

    const endpointsToTry = [
  "https://api.freeastroapi.com/api/v2/vedic/panchang"
];
    let lastError = null;

    for (const endpoint of endpointsToTry) {
      try {
        const apiRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": c.env.FREE_ASTROLOGY_API_KEY
          },
          body: JSON.stringify(payload)
        });

        const apiText = await apiRes.text();

        let apiData;
        try {
          apiData = JSON.parse(apiText);
        } catch {
          apiData = { raw: apiText };
        }

        const deprecated =
          apiData?.output === "Deprecated :-(" ||
          apiData?.message?.toLowerCase?.().includes("deprecated");

        if (apiRes.ok && !deprecated) {
          const root = apiData?.output || apiData?.data || apiData?.panchang || apiData;

          return c.json({
            success: true,
            source: "real_api",
            endpoint,
            place: place || "Dallas",
            date,
            requestPayload: payload,
            panchang: {
              tithi: root?.tithi?.name || root?.tithi || root?.Tithi || "N/A",
              nakshatra:
                root?.nakshatra?.name ||
                root?.nakshatra ||
                root?.Nakshatra ||
                "N/A",
              yoga: root?.yoga?.name || root?.yoga || root?.Yoga || "N/A",
              karana: root?.karana?.name || root?.karana || root?.Karana || "N/A",
              sunrise:
                root?.sunrise ||
                root?.sun_rise ||
                root?.sun?.rise ||
                root?.Sunrise ||
                "N/A",
              sunset:
                root?.sunset ||
                root?.sun_set ||
                root?.sun?.set ||
                root?.Sunset ||
                "N/A",
              moonrise:
                root?.moonrise ||
                root?.moon_rise ||
                root?.moon?.rise ||
                root?.Moonrise ||
                "N/A",
              moonset:
                root?.moonset ||
                root?.moon_set ||
                root?.moon?.set ||
                root?.Moonset ||
                "N/A",
              rahuKaal:
                root?.rahuKaal ||
                root?.rahu_kaal ||
                root?.rahukaal ||
                root?.rahu_kalam ||
                "N/A",
              gulikaKaal:
                root?.gulikaKaal ||
                root?.gulika_kaal ||
                root?.gulika_kalam ||
                "N/A",
              yamaGandam:
                root?.yamaGandam ||
                root?.yama_gandam ||
                root?.yamagandam ||
                "N/A",
              abhijitMuhurat:
                root?.abhijitMuhurat ||
                root?.abhijit_muhurat ||
                root?.abhijit ||
                "N/A",
              brahmaMuhurat:
                root?.brahmaMuhurat ||
                root?.brahma_muhurat ||
                root?.brahma ||
                "N/A",
              amritKaal:
                root?.amritKaal ||
                root?.amrit_kaal ||
                root?.amrit ||
                "N/A",
              durMuhurat:
                root?.durMuhurat ||
                root?.dur_muhurat ||
                root?.durmuhurat ||
                "N/A"
            },
            rawPanchang: apiData
          });
        }

        lastError = {
          endpoint,
          status: apiRes.status,
          deprecated,
          response: apiData
        };
      } catch (apiErr) {
        lastError = {
          endpoint,
          error: apiErr.message
        };
      }
    }

    return c.json({
      success: true,
      source: "fallback",
      debug: "Real Panchang API did not return usable Panchang fields",
      lastError,
      place: place || "Dallas",
      date,
      panchang: fallbackPanchang
    });
  } catch (err) {
    return c.json(
      {
        success: false,
        message: "Panchang generation failed",
        error: err.message
      },
      500
    );
  }
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
    return c.json(
      {
        message: "Stripe is not configured yet"
      },
      500
    );
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