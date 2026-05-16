import express from "express";
import { fetchFreeAstroEndpoint, buildFreeAstroPayload } from "../utils/astrologyAPI.js";

const router = express.Router();

// POST /api/western/birth-chart
router.post("/birth-chart", async (req, res) => {
  try {
    const birth = req.body || {};

    // Build payload similar to vedic but keep fields compatible
    const payload = buildFreeAstroPayload(birth);

    // Try western natal chart endpoint first, then fallback to Vedic chart if needed
    const candidates = [
      "/api/v1/natal/calculate",
      "/api/v2/vedic/chart"
    ];

    for (const path of candidates) {
      const result = await fetchFreeAstroEndpoint(path, payload);
      if (result) {
        return res.json({ success: true, source: "FREEASTRO", path, data: result });
      }
    }

    return res.status(502).json({ success: false, message: "Western birth chart API unavailable" });
  } catch (err) {
    console.error("Western birth-chart error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/western/daily-horoscope
router.post("/daily-horoscope", async (req, res) => {
  try {
    const { sign, language = "en", date, tz_str = "AUTO" } = req.body || {};

    if (!sign) {
      return res.status(400).json({ success: false, message: "Sign is required (e.g. aries)" });
    }

    const payload = {
      sign: String(sign).toLowerCase(),
      locale: language,
      date: date || "today",
      tz_str
    };

    const candidates = [
      { path: "/api/v2/horoscope/daily/sign", method: "GET" }
    ];

    for (const endpoint of candidates) {
      const result = await fetchFreeAstroEndpoint(endpoint.path, payload, { method: endpoint.method });
      if (result) {
        return res.json({ success: true, source: "FREEASTRO_HOROSCOPE", path: endpoint.path, data: result });
      }
    }

    return res.status(502).json({ success: false, message: "Daily horoscope API unavailable" });
  } catch (err) {
    console.error("Daily horoscope error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
