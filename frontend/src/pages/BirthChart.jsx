import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function BirthChart() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    dob: new Date().toISOString().split("T")[0],
    time: "12:00",
    place: "",
    lat: "",
    lng: "",
    tz_str: "AUTO"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    if (!form.dob || !form.time) {
      setError("Please provide date and time");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/western/birth-chart", form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Failed to generate birth chart";
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderChartData = () => {
    if (!result) return null;
    
    const data = result.data || result;
    
    // If it's an SVG, render as HTML
    if (typeof data === "string" && data.includes("<svg")) {
      return <div dangerouslySetInnerHTML={{ __html: data }} style={{ textAlign: "center", marginTop: 20 }} />;
    }

    // Render structured data
    return (
      <div style={styles.chartData}>
        {typeof data === "object" ? (
          Object.entries(data).map(([key, value]) => (
            <div key={key} style={styles.dataRow}>
              <strong style={styles.dataKey}>{formatKey(key)}:</strong>
              <span style={styles.dataValue}>{formatValue(value)}</span>
            </div>
          ))
        ) : (
          <p>{String(data)}</p>
        )}
      </div>
    );
  };

  const formatKey = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🪐 Western Birth Chart</h1>

      <p style={styles.subtitle}>
        Get your western astrology birth chart with planetary positions and house placements.
      </p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Enter Your Details</h2>

        <div style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.label}>Name (Optional)</label>
              <input
                style={styles.input}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.label}>Date of Birth</label>
              <input
                style={styles.input}
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.label}>Time of Birth</label>
              <input
                style={styles.input}
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.label}>Place of Birth (Optional)</label>
              <input
                style={styles.input}
                placeholder="City, Country"
                value={form.place}
                onChange={(e) => setForm({ ...form, place: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.label}>Latitude (Optional)</label>
              <input
                style={styles.input}
                placeholder="e.g., 40.7128"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.label}>Longitude (Optional)</label>
              <input
                style={styles.input}
                placeholder="e.g., -74.0060"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
              />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button onClick={generate} disabled={loading} style={styles.button}>
            {loading ? "⏳ Generating Chart..." : "✨ Generate Birth Chart"}
          </button>
        </div>
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h2 style={styles.cardTitle}>
            {form.name ? `${form.name}'s Birth Chart` : "Your Birth Chart"}
          </h2>
          <p style={styles.resultSource}>Source: FreeAstro API</p>
          {renderChartData()}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 70% 20%, rgba(212,175,55,0.18), transparent 30%), #050505",
    color: "white",
    fontFamily: "Arial",
    padding: "24px",
    paddingBottom: "100px"
  },

  title: {
    fontSize: "42px",
    margin: "20px 0 8px",
    textAlign: "center",
    color: "white"
  },

  subtitle: {
    fontSize: "16px",
    opacity: 0.8,
    textAlign: "center",
    maxWidth: 700,
    margin: "0 auto 32px",
    lineHeight: 1.6
  },

  card: {
    maxWidth: 800,
    margin: "0 auto 32px",
    background: "#111",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 16,
    padding: "28px",
  },

  cardTitle: {
    fontSize: 24,
    margin: "0 0 20px",
    color: "#D4AF37"
  },

  form: {
    display: "grid",
    gap: 18
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16
  },

  formCol: {
    display: "grid",
    gap: 8
  },

  label: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },

  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #333",
    background: "#0a0a0a",
    color: "white",
    fontSize: 14,
    fontFamily: "Arial",
    outline: "none"
  },

  button: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #D4AF37, #ffd66b)",
    color: "black",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    transition: "all 0.3s ease"
  },

  error: {
    padding: 12,
    background: "rgba(255,100,100,0.1)",
    border: "1px solid #ff6464",
    borderRadius: 8,
    color: "#ff9999",
    fontSize: 14
  },

  resultCard: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#111",
    border: "1px solid #D4AF37",
    borderRadius: 16,
    padding: "28px"
  },

  resultSource: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 16
  },

  chartData: {
    display: "grid",
    gap: 12,
    marginTop: 20
  },

  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    background: "#0a0a0a",
    borderRadius: 8,
    border: "1px solid #222",
    flexWrap: "wrap",
    gap: 12
  },

  dataKey: {
    color: "#D4AF37",
    minWidth: "150px"
  },

  dataValue: {
    color: "#ccc",
    wordBreak: "break-word"
  }
};

// Mobile responsiveness
if (typeof window !== "undefined" && window.innerWidth < 768) {
  styles.formRow = {
    ...styles.formRow,
    gridTemplateColumns: "1fr"
  };

  styles.title = {
    ...styles.title,
    fontSize: "32px"
  };

  styles.container = {
    ...styles.container,
    padding: "16px",
    paddingBottom: "120px"
  };

  styles.card = {
    ...styles.card,
    padding: "20px"
  };

  styles.resultCard = {
    ...styles.resultCard,
    padding: "20px"
  };
}
