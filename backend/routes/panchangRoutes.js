import express from "express";
import { getDailyPanchang } from "../utils/astrologyAPI.js";

const router = express.Router();

router.post("/daily", async (req, res) => {
  try {
    const date = req.body.date;
    const place = req.body.place || req.body.city;
    const lat = req.body.lat ?? req.body.latitude;
    const lon = req.body.lon ?? req.body.lng ?? req.body.longitude;
    const tzone = req.body.tzone ?? req.body.tz_str ?? req.body.timezone ?? "AUTO";

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    const result = await getDailyPanchang({ date, place, lat, lon, tzone });

    if (result?.success && result?.panchang) {
      return res.json({
        success: true,
        source: result.source,
        date,
        place: place || "Unknown",
        location: {
          lat: lat || 0,
          lon: lon || 0,
          tzone
        },
        panchang: result.panchang,
        raw: result.raw
      });
    }

    return res.json({
      success: true,
      source: "fallback",
      place: place || "Dallas",
      date,
      location: {
        lat: lat || 32.7767,
        lon: lon || -96.797,
        tzone
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
  } catch (err) {
    console.error("Panchang Error:", err);

    return res.status(500).json({
      success: false,
      message: "Panchang generation failed"
    });
  }
});

export default router;