import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  // ========================
  // GET TOKEN FROM HEADER
  // ========================
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ========================
  // NO TOKEN FOUND
  // ========================
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided"
    });
  }

  // ========================
  // VERIFY TOKEN
  // ========================
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired"
    });
  }
};