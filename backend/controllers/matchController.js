import { calculateKundaliMatch } from "../services/matchService.js";

export const matchKundali = async (req, res) => {
  try {
    const { kundali1, kundali2 } = req.body;

    const result = calculateKundaliMatch(kundali1, kundali2);

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