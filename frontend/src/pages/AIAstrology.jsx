import { useState } from "react";

export default function AIAstrology() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    setAnswer(`AI is thinking about: ${query || "your question"}...`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 AI Astrology Assistant</h2>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask your astrology question..."
      />

      <br />

      <button onClick={askAI}>Ask AI</button>

      <p>{answer}</p>
    </div>
  );
}