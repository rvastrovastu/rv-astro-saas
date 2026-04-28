import swe from "swisseph";

const PLANETS = {
  Sun: swe.SUN,
  Moon: swe.MOON,
  Mars: swe.MARS,
  Mercury: swe.MERCURY,
  Jupiter: swe.JUPITER,
  Venus: swe.VENUS,
  Saturn: swe.SATURN
};

// Convert date → Julian day
function getJulianDay(date) {
  return swe.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours()
  );
}

// 🪐 REAL PLANET LONGITUDE CALCULATION
export function getPlanetPositions(dob, time) {
  const date = new Date(`${dob}T${time}`);
  const jd = getJulianDay(date);

  const result = {};

  Object.entries(PLANETS).forEach(([name, id]) => {
    const [longitude] = swe.swe_calc_ut(jd, id, swe.FLG_SWIEPH);
    result[name] = {
      longitude: longitude,
      sign: getZodiac(longitude)
    };
  });

  return result;
}

// 🔮 Convert longitude → zodiac sign
function getZodiac(deg) {
  const signs = [
    "Aries","Taurus","Gemini","Cancer",
    "Leo","Virgo","Libra","Scorpio",
    "Sagittarius","Capricorn","Aquarius","Pisces"
  ];
  return signs[Math.floor(deg / 30)];
}