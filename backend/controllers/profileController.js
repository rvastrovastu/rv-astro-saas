import AstroProfile from "../models/AstroProfile.js";

export const saveProfile = async (req, res) => {
  const profile = await AstroProfile.create({
    userId: req.user.id,
    ...req.body
  });

  res.json(profile);
};

export const getProfile = async (req, res) => {
  const profile = await AstroProfile.findOne({ userId: req.user.id });
  res.json(profile);
};