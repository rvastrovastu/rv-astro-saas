import express from "express";

const router = express.Router();

// TEST ROUTE
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth route working ✅"
  });
});

export default router;