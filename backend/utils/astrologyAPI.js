import fetch from "node-fetch";

const USER_ID = process.env.ASTROLOGY_USER_ID;
const API_KEY = process.env.ASTROLOGY_API_KEY;

/**
 * ===============================
 * 🪐 REAL KUNDALI API ENGINE
 * ===============================
 */
export const getKundaliFromAPI = async (birthData) => {
  try {
    const { name, dob, time, place } = birthData;

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