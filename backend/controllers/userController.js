import User from "../models/User.js";

// ========================
// CREATE USER (BASIC)
// ========================
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========================
// GET USERS (TEST)
// ========================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};