import express from "express";
import OpenAI from "openai";

const router = express.Router();

// ========================
// AI CHAT (ASTROLOGY ENGINE)
// ========================
router.post("/chat", async (req, res) => {
  try {
    const { message, userDetails = {} } = req.body;

    // ========================
    // VALIDATION SAFETY LAYER
    // ========================
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        reply: "Message is required"
      });
    }

    // ========================
    // ENV CHECK (CRITICAL FIX)
    // ========================
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY missing in environment");
      return res.status(500).json({
        success: false,
        reply: "OPENAI_API_KEY not configured on server"
      });
    }

    // ========================
    // SAFE OPENAI INIT (ONLY WHEN NEEDED)
    // ========================
    const openai = new OpenAI({
      apiKey
    });

    // ========================
    // USER DATA NORMALIZATION (SAFE DEFAULTS)
    // ========================
    const name = userDetails?.name?.trim() || "Unknown";
    const dob = userDetails?.dob?.trim() || "Not provided";
    const time = userDetails?.time?.trim() || "Not provided";
    const place = userDetails?.place?.trim() || "Not provided";

    // ========================
    // PREMIUM ASTROLOGY PROMPT (UNCHANGED CORE LOGIC)
    // ========================
    const prompt = `
You are a highly experienced Vedic astrologer with deep knowledge of Jyotish Shastra.

User Birth Details:
- Name: ${name}
- Date of Birth: ${dob}
- Time of Birth: ${time}
- Place of Birth: ${place}

User Question:
${message}

Instructions:
- Give a personalized astrology reading
- Use simple, human-friendly language
- Mention planetary influence when relevant
- Do NOT be vague
- Keep response practical and actionable
- Limit to 6–10 sentences
`;

    // ========================
    // OPENAI CALL (SAFE HANDLING)
    // ========================
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a precise Vedic astrology expert."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const aiReply = response?.choices?.[0]?.message?.content || "No response generated";

    return res.json({
      success: true,
      reply: aiReply
    });

  } catch (error) {
    console.error("🔥 AI ERROR:", error);

    return res.status(500).json({
      success: false,
      reply: "⚠️ Astrology AI temporarily unavailable. Please try again shortly."
    });
  }
});

// ========================
// HEALTH CHECK
// ========================
router.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "RV Astro AI Engine",
    status: "running"
  });
});

export default router;