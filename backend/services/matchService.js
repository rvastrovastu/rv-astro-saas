const normalizePlanetDegree = (planet) => {
  if (planet == null) return 0;
  if (typeof planet === "number") return planet;
  if (typeof planet === "object") {
    return Number(planet.degree ?? planet.longitude ?? planet.absolute_degree ?? 0) || 0;
  }
  return 0;
};

export const getMoonSign = (moonDeg) => {
  const degree = normalizePlanetDegree(moonDeg);
  return Math.floor(degree / 30);
};

// ================================
// 🔥 ASHTAKOOT SYSTEM (SIMPLIFIED)
// Max = 36 points
// ================================
const ashtakoot = {
  varna: 1,
  vashya: 2,
  tara: 3,
  yoni: 4,
  graha_maitri: 5,
  gana: 6,
  bhakoot: 7,
  nadi: 8
};

// ================================
// 💞 MATCH CALCULATION CORE
// ================================
export const calculateKundaliMatch = (k1, k2) => {
  let score = 0;

  const moon1 = getMoonSign(k1.planets?.Moon);
  const moon2 = getMoonSign(k2.planets?.Moon);

  // ================================
  // 🌙 MOON SIGN COMPATIBILITY
  // ================================
  if (moon1 === moon2) score += 6;
  else if (Math.abs(moon1 - moon2) === 1) score += 4;
  else score += 2;

  // ================================
  // 🔥 VENUS HARMONY (LOVE FACTOR)
  // ================================
  const venus1 = getMoonSign(k1.planets?.Venus || 0);
  const venus2 = getMoonSign(k2.planets?.Venus || 0);

  if (venus1 === venus2) score += 6;
  else score += 3;

  // ================================
  // 🔴 MARS COMPATIBILITY (ANGER / ENERGY)
  // ================================
  const mars1 = getMoonSign(k1.planets?.Mars || 0);
  const mars2 = getMoonSign(k2.planets?.Mars || 0);

  if (mars1 === mars2) score += 4;
  else if (Math.abs(mars1 - mars2) < 3) score += 2;

  // ================================
  // 💥 MANGAL DOSHA CHECK
  // ================================
  const manglik1 = [1, 4, 7, 8, 12].includes(mars1);
  const manglik2 = [1, 4, 7, 8, 12].includes(mars2);

  let mangalMatch = "No Dosha Conflict";

  if (manglik1 && manglik2) {
    score += 4;
    mangalMatch = "Both Manglik - Neutralized";
  } else if (manglik1 || manglik2) {
    score -= 5;
    mangalMatch = "Manglik Mismatch";
  }

  // ================================
  // 🌟 FINAL COMPATIBILITY SCORE
  // ================================
  const maxScore = 20;
  const percentage = Math.min(100, Math.round((score / maxScore) * 100));

  let matchType = "Low Compatibility";

  if (percentage >= 75) matchType = "Excellent Match 💞";
  else if (percentage >= 50) matchType = "Good Match 👍";
  else if (percentage >= 30) matchType = "Average Match ⚖️";

  return {
    score: percentage,
    matchType,
    mangalDosha: mangalMatch,
    breakdown: {
      moon: moon1 === moon2,
      venus: venus1 === venus2,
      mars: mars1 === mars2
    }
  };
};