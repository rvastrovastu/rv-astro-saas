import fetch from "node-fetch";

const USER_ID = process.env.ASTROLOGY_USER_ID;
const API_KEY = process.env.ASTROLOGY_API_KEY;
const FREE_API_KEY = process.env.FREE_ASTROLOGY_API_KEY;
const FREE_ASTRO_URL = "https://api.freeastroapi.com/api/v2/vedic/chart";

const parseTime = (time) => {
  const [hour = 0, minute = 0] = String(time || "00:00").split(":").map((v) => Number(v));
  return { hour, minute };
};

const normalizeFreeAstroResponse = (chart, birthData) => {
  const planets = {};
  (chart.planets || []).forEach((planet) => {
    planets[planet.name] = {
      sign: planet.sign,
      degree: planet.degree_in_sign ?? planet.degree ?? null,
      absolute_degree: planet.absolute_degree,
      house: planet.house,
      retrograde: planet.is_retrograde,
      nakshatra: planet.nakshatra,
      nakshatra_id: planet.nakshatra_id,
      pada: planet.pada,
      nakshatra_lord: planet.nakshatra_lord
    };
  });

  const houses = {};
  (chart.houses || []).forEach((house) => {
    houses[`House_${house.house}`] = house.sign;
  });

  return {
    native: {
      name: birthData.name,
      dob: birthData.dob,
      time: birthData.time,
      place: birthData.place
    },
    ascendant: chart.ascendant?.sign,
    ascendantRaw: chart.ascendant,
    sunSign: planets.Sun?.sign,
    moonSign: planets.Moon?.sign,
    planets,
    houses,
    sade_sati: chart.sade_sati,
    meta: chart.metadata,
    source: "FREE_ASTRO_API"
  };
};

const buildFreeAstroPayload = (birthData) => {
  const date = new Date(birthData.dob);
  const { hour, minute } = parseTime(birthData.time);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour,
    minute,
    city: birthData.place || undefined,
    lat: birthData.lat !== undefined && birthData.lat !== "" ? Number(birthData.lat) : undefined,
    lng: birthData.lng !== undefined && birthData.lng !== "" ? Number(birthData.lng) : undefined,
    tz_str: birthData.tz_str || "AUTO",
    ayanamsha: birthData.ayanamsha || "lahiri",
    house_system: birthData.house_system || "whole_sign",
    node_type: birthData.node_type || "mean"
  };
};

/**
 * ===============================
 * 🪐 REAL KUNDALI API ENGINE
 * ===============================
 */
export const getKundaliFromAPI = async (birthData) => {
  try {
    const { name, dob, time, place } = birthData;

    if (FREE_API_KEY) {
      try {
        const payload = buildFreeAstroPayload(birthData);
        const response = await fetch(FREE_ASTRO_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": FREE_API_KEY
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`FreeAstro API failed: ${response.status} ${errorText}`);
        }

        const chart = await response.json();

        return {
          success: true,
          source: "FREE_ASTRO_API",
          kundali: normalizeFreeAstroResponse(chart, birthData)
        };
      } catch (error) {
        console.warn("⚠️ FreeAstro Basic Chart failed → fallback:", error.message);
      }
    }

    if (!USER_ID || !API_KEY) {
      throw new Error("Astrology API credentials missing");
    }

    const response = await fetch(
      "https://json.astrologyapi.com/v1/planets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "Basic " +
            Buffer.from(USER_ID + ":" + API_KEY).toString("base64")
        },
        body: JSON.stringify({
          day: new Date(dob).getDate(),
          month: new Date(dob).getMonth() + 1,
          year: new Date(dob).getFullYear(),
          hour: time.split(":")[0],
          min: time.split(":")[1],

          // default coordinates (can later be dynamic by place API)
          lat: 28.6139,
          lon: 77.2090,
          tzone: 5.5
        })
      }
    );

    const data = await response.json();

    return {
      success: true,
      name,
      place,
      planets: data
    };

  } catch (error) {
    console.error("ASTRO API ERROR:", error.message);

    return {
      success: false,
      message: "Astrology API failed",
      error: error.message
    };
  }
};