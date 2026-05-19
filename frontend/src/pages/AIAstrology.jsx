import { useState } from "react";

export default function AIAstrology() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = () => {
    const text = question.trim();

    if (!text) {
      setAnswer("⚠️ Please enter a question.");
      return;
    }

    setAnswer(`🔮 AI is analyzing: "${text}"...`);
  };

  const containerStyle = {
    padding: 20,
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff"
  };

  const titleStyle = {
    color: "#D4AF37",
    marginBottom: 20
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 120,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    marginBottom: 10
  };

  const buttonStyle = {
    padding: "12px 18px",
    background: "#D4AF37",
    color: "#000",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  };

  const answerStyle = {
    marginTop: 16,
    background: "#111",
    padding: 16,
    borderRadius: 10,
    border: "1px solid #333"
  };

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    containerStyle.padding = 16;
    titleStyle.fontSize = 22;
    textareaStyle.minHeight = 140;
    textareaStyle.padding = 14;
    buttonStyle.width = "100%";
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🤖 AI Astrology Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your astrology question..."
        rows={4}
        style={textareaStyle}
      />

      <button type="button" onClick={askAI} style={buttonStyle}>
        Ask AI
      </button>

      {answer && <p style={answerStyle}>{answer}</p>}
    </div>
  );
}
