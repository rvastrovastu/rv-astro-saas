import express from "express";

const router = express.Router();

// ========================
// BASIC PROFILE ROUTE
// ========================

// GET PROFILE (test)
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Profile route working ✅"
  });
});

// CREATE / UPDATE PROFILE (future use)
router.post("/", (req, res) => {
  const { name, dob, time, place } = req.body;

  res.json({
    success: true,
    message: "Profile saved (mock)",
    data: { name, dob, time, place }
  });
});

export default router;