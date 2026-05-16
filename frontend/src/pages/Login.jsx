import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      const payload =
        mode === "login"
          ? {
              email: form.email,
              password: form.password
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password
            };

      const res = await API.post(endpoint, payload);

      localStorage.setItem("token", res.data?.token || "demo-token");

      if (res.data?.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data?.user || {
            name: form.name || "RV Astro User",
            email: form.email,
            plan: "free"
          }
        )
      );

      alert(
        mode === "login"
          ? "Logged in successfully!"
          : "Account created successfully!"
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Authentication failed:", err);
      alert(err?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <div style={styles.logo}>🔮</div>

          <h1 style={styles.brand}>RV Astro Vastu</h1>

          <p style={styles.tagline}>
            AI Powered Astrology • Vastu • Kundali • Predictions
          </p>
        </div>

        <div style={styles.infoBox}>
          <h3>Welcome to RV Astro Vastu</h3>
          <p>
            Create your free account to generate Kundali, save reports, explore
            matching, Panchang, Muhurat, and unlock premium AI astrology
            features.
          </p>
        </div>

        <div style={styles.switchRow}>
          <button
            type="button"
            onClick={() => setMode("login")}
            style={mode === "login" ? styles.activeTab : styles.tab}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setMode("signup")}
            style={mode === "signup" ? styles.activeTab : styles.tab}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={submit} style={styles.form}>
          {mode === "signup" && (
            <input
              style={styles.input}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}

          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login 🔐"
              : "Create Free Account ✨"}
          </button>
        </form>

        <button
        type="button"
         onClick={() => navigate("/ai-astrology")}
           style={styles.guestBtn}
          >
          Continue as Guest
          </button> 

        <p style={styles.note}>
          Free plan includes basic Kundali. Pro unlocks PDF reports, saved
          history, AI insights, advanced matching, Panchang, and Muhurat.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #2a2108 0%, #0a0a0a 45%, #000 100%)",
    color: "white",
    fontFamily: "Arial",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },

  card: {
    width: "100%",
    maxWidth: 480,
    background: "rgba(17,17,17,0.94)",
    border: "1px solid #D4AF37",
    borderRadius: 18,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)"
  },

  logoBox: {
    textAlign: "center",
    marginBottom: 20
  },

  logo: {
    width: 76,
    height: 76,
    margin: "0 auto 10px",
    borderRadius: "50%",
    background: "#D4AF37",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    boxShadow: "0 0 25px rgba(212,175,55,0.45)"
  },

  brand: {
    color: "#D4AF37",
    margin: "5px 0",
    fontSize: 32
  },

  tagline: {
    opacity: 0.75,
    fontSize: 14
  },

  infoBox: {
    background: "#0d0d0d",
    border: "1px solid #333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    lineHeight: 1.5
  },

  switchRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 18
  },

  tab: {
    padding: 11,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "white",
    cursor: "pointer"
  },

  activeTab: {
    padding: 11,
    borderRadius: 10,
    border: "none",
    background: "#D4AF37",
    color: "black",
    fontWeight: "bold",
    cursor: "pointer"
  },

  form: {
    display: "grid",
    gap: 12
  },

  input: {
    padding: 13,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "white",
    fontSize: 15
  },

  primaryBtn: {
    padding: 13,
    borderRadius: 10,
    border: "none",
    background: "#D4AF37",
    color: "black",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 15
  },

  guestBtn: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #D4AF37",
    background: "transparent",
    color: "#D4AF37",
    cursor: "pointer",
    fontWeight: "bold"
  },

  note: {
    marginTop: 16,
    fontSize: 12,
    opacity: 0.65,
    textAlign: "center",
    lineHeight: 1.5
  }
};