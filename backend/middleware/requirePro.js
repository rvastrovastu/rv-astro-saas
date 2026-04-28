export const requirePro = (req, res, next) => {
  if (req.user.plan !== "pro") {
    return res.status(403).json({ message: "Upgrade required" });
  }
  next();
};