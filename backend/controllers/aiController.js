import OpenAI from "openai";
import AstroProfile from "../models/AstroProfile.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  const profile = await AstroProfile.findOne({
    userId: req.user.id
  });

  const prompt = `
You are a Vedic astrologer.

User:
Name: ${profile?.name}
DOB: ${profile?.dob}
Time: ${profile?.time}
Place: ${profile?.place}

Question: ${message}

Give accurate astrology reading + remedies.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({
    reply: response.choices[0].message.content
  });
};