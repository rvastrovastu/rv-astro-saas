import { calculateKundaliMatch } from "../services/matchService.js";
import { getKundaliFromAPI } from "../utils/astrologyAPI.js";

export const matchKundali = async (req, res) => {
  try {
    const { kundali1, kundali2, boy, girl } = req.body;

    let firstKundali = kundali1;
    let secondKundali = kundali2;

    if (!firstKundali && boy) {
      const apiResult = await getKundaliFromAPI(boy);
      firstKundali = apiResult?.kundali || boy;
    }

    if (!secondKundali && girl) {
      const apiResult = await getKundaliFromAPI(girl);
      secondKundali = apiResult?.kundali || girl;
    }

    const result = calculateKundaliMatch(firstKundali, secondKundali);

    res.json({
      success: true,
      match: result
    });

  } catch (err) {
    res.status(500).json({
      error: "Match calculation failed",
      details: err.message
    });
  }
};