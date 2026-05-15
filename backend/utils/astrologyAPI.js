import fetch from "node-fetch";

const USER_ID = process.env.ASTROLOGY_USER_ID;
const API_KEY = process.env.ASTROLOGY_API_KEY;
const FREE_API_KEY = process.env.FREE_ASTROLOGY_API_KEY;
const FREE_ASTRO_BASE = "https://api.freeastroapi.com";
const FREE_ASTRO_CHART_URL = "https://api.freeastroapi.com/api/v2/vedic/chart";

const parseTime = (time) => {
  const [hour = 0, minute = 0] = String(time || "00:00").split(":").map((v) => Number(v));
  return { hour, minute };
};

const normalizeFreeAstroResponse = (chart, birthData) => {
  const root = chart?.output || chart?.data || chart;
  const planetArray = root.planets || root.planet || [];
  const planets = {};

  (Array.isArray(planetArray) ? planetArray : Object.values(planetArray)).forEach((planet) => {
    const name = planet.name || planet.planet || planet.id;
    if (!name) return;
    planets[name] = {
      sign: planet.sign,
      degree: planet.degree_in_sign ?? planet.degree ?? planet.longitude ?? null,
      absolute_degree: planet.absolute_degree ?? planet.longitude ?? null,
      house: planet.house ?? planet.house_number ?? planet.house_no ?? null,
      retrograde: planet.is_retrograde ?? planet.retrograde ?? false,
      nakshatra: planet.nakshatra,
      nakshatra_id: planet.nakshatra_id,
      pada: planet.pada,
      nakshatra_lord: planet.nakshatra_lord || planet.nakshatraLord,
      longitude: planet.longitude,
      speed: planet.speed,
      zodiac: planet.zodiac
    };
  });

  const houseArray = root.houses || root.house || [];
  const houses = {};
  (Array.isArray(houseArray) ? houseArray : Object.values(houseArray)).forEach((house) => {
    const idx = house.house ?? house.number ?? house.house_no ?? house.houseNumber;
    if (!idx) return;
    houses[`House_${idx}`] = {
      sign: house.sign,
      degree: house.degree ?? house.cusp ?? null,
      lord: house.lord,
      nakshatra: house.nakshatra
    };
  });

  const dashaArray = root.dasha || root.vimshottari_dasha || root.vimsottari_dasha || root.dashas || [];
  const dasha = (Array.isArray(dashaArray) ? dashaArray : Object.values(dashaArray)).map((item) => ({
    planet: item.planet || item.name || item.title || "Unknown",
    from: item.from || item.start || item.begin,
    to: item.to || item.end,
    years: item.years || item.duration || item.duration_years || item.length
  }));

  return {
    native: {
      name: birthData.name,
      dob: birthData.dob,
      time: birthData.time,
      place: birthData.place,
      lat: birthData.lat,
      lng: birthData.lng,
      tz_str: birthData.tz_str || "AUTO",
      ayanamsha: birthData.ayanamsha || "lahiri",
      house_system: birthData.house_system || "whole_sign",
      node_type: birthData.node_type || "mean"
    },
    ascendant: root.ascendant?.sign || root.lagna?.sign || root.ascendant || root.lagna,
    ascendant_degree: root.ascendant?.degree ?? root.lagna?.degree ?? root.ascendant_degree,
    ascendantRaw: root.ascendant || root.lagna,
    sunSign: planets.Sun?.sign,
    moonSign: planets.Moon?.sign,
    planets,
    houses,
    dasha,
    sade_sati: root.sade_sati || root.sade_sathi || root.sade_sati_details,
    yoga: root.yogas || root.yoga || [],
    metadata: {
      ...root.metadata,
      engine: root.engine || "freeastro",
      calculation_time: root.calculation_time || root.generated_at || root.generated_at_time,
      raw_source: root.source
    },
    location: {
      city: root.city || birthData.place,
      lat: root.latitude ?? root.lat ?? birthData.lat,
      lng: root.longitude ?? root.lng ?? birthData.lng,
      timezone: root.tz || root.tz_str || birthData.tz_str
    },
    raw: root,
    source: "FREE_ASTRO_API",
    meta: {
      ...root.metadata,
      engine: root.engine || "freeastro",
      calculation_time: root.calculation_time || root.generated_at || root.generated_at_time,
      raw_source: root.source
    },
    metadata: {
      ...root.metadata,
      engine: root.engine || "freeastro",
      calculation_time: root.calculation_time || root.generated_at || root.generated_at_time,
      raw_source: root.source
    }
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

const buildPanchangPayload = (payload) => {
  const date = new Date(payload.date);

  return {
    question: payload.question || "panchang",
    date: payload.date,
    time: payload.time || undefined,
    language: payload.language || "en",
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    city: payload.place || payload.city || undefined,
    lat: payload.lat !== undefined && payload.lat !== "" ? Number(payload.lat) : undefined,
    lng: payload.lon !== undefined && payload.lon !== "" ? Number(payload.lon) : undefined,
    tz_str: payload.tzone || payload.tz_str || payload.timezone || "AUTO",
    ayanamsha: payload.ayanamsha || "lahiri",
    house_system: payload.house_system || "whole_sign",
    node_type: payload.node_type || "mean"
  };
};

const fetchFreeAstroEndpoint = async (path, payload) => {
  if (!FREE_API_KEY) return null;

  try {
    const response = await fetch(`${FREE_ASTRO_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": FREE_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.status} ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`⚠️ FreeAstro endpoint failed (${path}):`, error.message);
    return null;
  }
};

export const getAdvancedFreeAstroData = async (birthData) => {
  const payload = buildFreeAstroPayload(birthData);
  const endpoints = [
    { key: "fullCalculate", path: "/api/v2/vedic/calculate" },
    { key: "chart", path: "/api/v2/vedic/chart" },
    { key: "dasha", path: "/api/v2/vedic/dasha" },
    { key: "dashaInsights", path: "/api/v2/vedic/dasha/insights" },
    { key: "gocharTimeline", path: "/api/v2/vedic/gochar/timeline" },
    { key: "gocharInsights", path: "/api/v2/vedic/gochar/timeline/insights" },
    { key: "yogas", path: "/api/v2/vedic/yogas" },
    { key: "strength", path: "/api/v2/vedic/strength" },
    { key: "divisionalCharts", path: "/api/v2/vedic/vargas" },
    { key: "panchang", path: "/api/v2/vedic/panchang" }
  ];

  const advanced = {};

  for (const endpoint of endpoints) {
    const response = await fetchFreeAstroEndpoint(endpoint.path, payload);
    if (response) {
      advanced[endpoint.key] = response;
    }
  }

  return advanced;
};

export const getDailyPanchang = async (options) => {
  const payload = buildPanchangPayload(options);

  if (FREE_API_KEY) {
    const response = await fetchFreeAstroEndpoint("/api/v2/vedic/panchang", payload);
    if (response) {
      return {
        success: true,
        source: "FREE_ASTRO_PANCHANG",
        panchang: response,
        raw: response
      };
    }
  }

  return {
    success: false,
    message: "Daily Panchang API unavailable"
  };
};

/**
 * ===============================
 * 🪐 REAL KUNDALI API ENGINE
 * ===============================
 */
export const getKundaliFromAPI = async (birthData, advanced = false) => {
  try {
    const { name, dob, time, place } = birthData;

    if (FREE_API_KEY) {
      try {
        const payload = buildFreeAstroPayload(birthData);
        const response = await fetch(FREE_ASTRO_CHART_URL, {
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
        const kundali = normalizeFreeAstroResponse(chart, birthData);

        if (advanced) {
          kundali.advanced = await getAdvancedFreeAstroData(birthData);
        }

        return {
          success: true,
          source: "FREE_ASTRO_API",
          kundali
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