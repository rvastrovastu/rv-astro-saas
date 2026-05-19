import express from "express";
import { getKundaliFromAPI } from "../utils/astrologyAPI.js";
import Kundali from "../models/Kundali.js";
import { protect } from "../middleware/authMiddleware.js";

// optional ephemeris (safe fallback)
let getPlanetPositions;
try {
  ({ getPlanetPositions } = await import("../utils/ephemeris.js"));
} catch (e) {
  console.warn("⚠️ Ephemeris engine not found, using fallback math engine");
}

const router = express.Router();

// =====================================================
// 🪐 1. GENERATE KUNDALI (PUBLIC / CORE ENGINE)
// =====================================================
router.post("/generate", async (req, res) => {
  try {
    const { name, dob, time, place, lat, lng } = req.body;
    const advanced = req.query.advanced === "true";

    // ================= VALIDATION =================
    if (!dob || !time || (!place && (!lat || !lng))) {
      return res.status(400).json({
        success: false,
        message: "Birth details required: either place or latitude/longitude must be provided"
      });
    }

    // =====================================================
    // 🪐 STEP 1: REAL ASTRO API
    // =====================================================
    try {
      const apiResult = await getKundaliFromAPI(req.body, advanced);

      if (apiResult?.success && apiResult?.kundali) {
        return res.json({
          success: true,
          source: "REAL_ASTROLOGY_API",
          kundali: apiResult.kundali
        });
      }
    } catch (err) {
      console.warn("⚠️ External API failed → switching engine");
    }

    // =====================================================
    // 🪐 STEP 2: EPHEMERIS ENGINE
    // =====================================================
    let planets = null;

    if (getPlanetPositions) {
      try {
        planets = getPlanetPositions(dob, time);
      } catch (err) {
        console.warn("⚠️ Ephemeris failed → fallback");
      }
    }

    // =====================================================
    // 🪐 STEP 3: FALLBACK ENGINE
    // =====================================================
    const seed = new Date(dob).getTime();

    const planetNames = [
      "Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"
    ];

    const signs = [
      "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
      "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
    ];

    if (!planets) {
      planets = {};
      planetNames.forEach((p, i) => {
        const idx = (seed + i * 97) % 12;
        planets[p] = {
          sign: signs[idx],
          degree: (seed + i * 13) % 30
        };
      });
    }

    // ================= CORE VALUES =================
    const sunSign = planets.Sun.sign;
    const moonSign = planets.Moon.sign;
    const ascendant = signs[seed % 12];

    // ================= HOUSES =================
    const houses = {};
    for (let i = 1; i <= 12; i++) {
      houses[`House_${i}`] = signs[(seed + i * 13) % 12];
    }

    // ================= DASHA =================
    const dasha = generateDasha(seed);

    // ================= RESPONSE =================
    return res.json({
      success: true,
      source: getPlanetPositions ? "EPHEMERIS_ENGINE" : "FALLBACK_ENGINE",

      kundali: {
        native: {
          name,
          dob,
          time,
          place,
          lat: req.body.lat,
          lng: req.body.lng,
          tz_str: req.body.tz_str,
          ayanamsha: req.body.ayanamsha,
          house_system: req.body.house_system,
          node_type: req.body.node_type
        },

        ascendant,
        sunSign,
        moonSign,

        planets,
        houses,
        dasha,

        meta: {
          engine: getPlanetPositions
            ? "astro_ephemeris_v1"
            : "astro_math_v1"
        }
      }
    });

  } catch (error) {
    console.error("🔥 KUNDALI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Kundali generation failed"
    });
  }
});

// =====================================================
// 💾 2. SAVE KUNDALI (PROTECTED)
// =====================================================
router.post("/save", protect, async (req, res) => {
  try {
    const { name, dob, time, place, data } = req.body;

    const saved = await Kundali.create({
      userId: req.user.id,
      name,
      dob,
      time,
      place,
      data
    });

    res.json({
      success: true,
      kundali: saved
    });

  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

// =====================================================
// 📊 3. GET USER KUNDALIS (PROTECTED)
// =====================================================
router.get("/my", protect, async (req, res) => {
  try {
    const list = await Kundali.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// =====================================================
// 🔎 GET KUNDALI BY ID (PROTECTED, OWNER ONLY)
// =====================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const item = await Kundali.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Kundali not found" });
    }

    if (String(item.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this kundali" });
    }

    res.json(item);
  } catch (err) {
    console.error("❌ Fetch by id error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// =====================================================
// 🧿 DASHA ENGINE
// =====================================================
function generateDasha(seed) {
  const planets = ["Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn"];

  return planets.map((p, i) => ({
    planet: p,
    years: [6, 10, 7, 18, 16, 19][i],
    startOffset: (seed + i * 3) % 120
  }));
}

export default router;