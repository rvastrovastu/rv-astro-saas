export const requirePro = (req, res, next) => {
  try {
    // user comes from protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // safety normalize in case DB stores "Pro", "PRO", etc.
    const userPlan = (req.user.plan || "").toLowerCase();

    if (userPlan !== "pro") {
      return res.status(403).json({
        success: false,
        message: "🚫 Upgrade to Pro to use this feature"
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Pro check failed",
      error: err.message
    });
  }

  router.post("/save", protect, requirePro, saveController);
  
};