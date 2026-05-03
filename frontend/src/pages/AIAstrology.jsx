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

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 AI Astrology Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your astrology question..."
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <br />

      <button type="button" onClick={askAI}>
        Ask AI
      </button>

      {answer && <p>{answer}</p>}
    </div>
  );
}