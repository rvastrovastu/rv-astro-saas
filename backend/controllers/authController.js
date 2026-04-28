import bcrypt from "bcrypt";
import AuthUser from "../models/AuthUser.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

/**
 * ===============================
 * REGISTER USER
 * ===============================
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    const existingUser = await AuthUser.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthUser.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan || "free"
      }
    });
  } catch (err) {
    console.error("Register Error:", err);

    res.status(500).json({
      message: "Registration failed"
    });
  }
};

/**
 * ===============================
 * LOGIN USER
 * ===============================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await AuthUser.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan || "free"
      }
    });
  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({
      message: "Login failed"
    });
  }
};