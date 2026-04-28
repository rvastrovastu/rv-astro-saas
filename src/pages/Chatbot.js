import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    dob: "",
    time: "",
    place: ""
  });

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    // add user message instantly
    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: userMsg.text,

        // fallback safety (IMPORTANT)
        userDetails: {
          name: user.name || "Guest",
          dob: user.dob || "Not provided",
          time: user.time || "Not provided",
          place: user.place || "Not provided"
        }
      });

      const aiMsg = {
        role: "ai",
        text: res?.data?.reply || "No response from AI"
      };

      setChat((prev) => [...prev, aiMsg]);

    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ AI server error. Please try again." }
      ]);
    }

    setLoading(false);
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.container}>

      <h2 style={styles.header}>🤖 AI Astrology Chatbot</h2>

      {/* ================= USER DETAILS ================= */}
      <div style={styles.form}>
        <input
          placeholder="Name"
          style={styles.input}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        <input
          type="date"
          style={styles.input}
          onChange={(e) => setUser({ ...user, dob: e.target.value })}
        />

        <input
          type="time"
          style={styles.input}
          onChange={(e) => setUser({ ...user, time: e.target.value })}
        />

        <input
          placeholder="Birth Place"
          style={styles.input}
          onChange={(e) => setUser({ ...user, place: e.target.value })}
        />
      </div>

      {/* ================= CHAT BOX ================= */}
      <div style={styles.chatBox}>
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#D4AF37" : "#1e1e1e",
              color: msg.role === "user" ? "#000" : "#fff"
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <p style={{ color: "#888" }}>🔮 AI is analyzing your kundali...</p>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div style={styles.inputArea}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about love, career, marriage..."
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    background: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    flexDirection: "column"
  },

  header: {
    textAlign: "center",
    color: "#D4AF37"
  },

  form: {
    display: "grid",
    gap: 10,
    marginBottom: 15
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    border: "1px solid #333",
    borderRadius: 10,
    marginBottom: 10
  },

  message: {
    padding: "10px 14px",
    borderRadius: 12,
    margin: 5,
    maxWidth: "70%"
  },

  inputArea: {
    display: "flex",
    gap: 10
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none"
  },

  button: {
    padding: "10px 16px",
    background: "#D4AF37",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold"
  }
};  