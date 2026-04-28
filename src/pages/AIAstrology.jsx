import { useState } from "react";

export default function AIAstrology() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    setAnswer("AI is thinking... (connect OpenAI API here)");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 AI Astrology Assistant</h2>

      <textarea onChange={(e) => setQuery(e.target.value)} />

      <button onClick={askAI}>Ask AI</button>

      <p>{answer}</p>
    </div>
  );
}