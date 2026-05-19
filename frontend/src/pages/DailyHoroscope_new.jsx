import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces"
];

const SIGN_DISPLAY = {
  aries: { en: "Aries", sa: "Mesha", emoji: "♈" },
  taurus: { en: "Taurus", sa: "Vrishabha", emoji: "♉" },
  gemini: { en: "Gemini", sa: "Mithuna", emoji: "♊" },
  cancer: { en: "Cancer", sa: "Karka", emoji: "♋" },
  leo: { en: "Leo", sa: "Simha", emoji: "♌" },
  virgo: { en: "Virgo", sa: "Kanya", emoji: "♍" },
  libra: { en: "Libra", sa: "Tula", emoji: "♎" },
  scorpio: { en: "Scorpio", sa: "Vrishchika", emoji: "♏" },
  sagittarius: { en: "Sagittarius", sa: "Dhanu", emoji: "♐" },
  capricorn: { en: "Capricorn", sa: "Makara", emoji: "♑" },
  aquarius: { en: "Aquarius", sa: "Kumbha", emoji: "♒" },
  pisces: { en: "Pisces", sa: "Meena", emoji: "♓" }
};

const getDisplayName = (sign) => {
  if (!sign) return "";
  const key = String(sign).toLowerCase();
  const entry = SIGN_DISPLAY[key];
  return entry ? `${entry.emoji} ${entry.en} • ${entry.sa}` : key;
};

export default function DailyHoroscope() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("manual");
  const [sign, setSign] = useState("aries");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [dob, setDob] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [detectedMsg, setDetectedMsg] = useState("");
  const [error, setError] = useState("");

  const fetchHoroscope = async () => {
    setError("");
    try {
      setLoading(true);
      const res = await API.post("/western/daily-horoscope", { sign });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Failed to fetch horoscope";
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getSunSignFromResponse = (res) => {
    if (!res) return null;
    const body = res.kundali || res.data?.kundali || res.data || res;
    const candidate = body?.sunSign || body?.sun_sign || body?.Sun || body?.sun || null;

    if (candidate) return candidate;

    if (body?.planets?.Sun) {
      return body.planets.Sun.sign || body.planets.Sun.zodiac || null;
    }

    return null;
  };

  const extractHoroscopeText = (res) => {
    if (!res) return null;
    const body = res.data || res.kundali || res || {};

    if (Array.isArray(body)) {
      const texts = body.map((b) => extractHoroscopeText(b)).filter(Boolean);
      return texts.length ? texts.join("\n\n") : null;
    }

    if (typeof body === "string") return body;
    if (body.horoscope && typeof body.horoscope === "string") return body.horoscope;
    if (body.horoscope && typeof body.horoscope === "object") {
      if (body.horoscope.text) return body.horoscope.text;
      if (body.horoscope.description) return body.horoscope.description;
    }
    if (body.text) return body.text;
    if (body.description) return body.description;
    if (body.summary) return body.summary;

    if (body.data) {
      const nested = extractHoroscopeText(body.data);
      if (nested) return nested;
    }

    if (body.result) {
      const nested = extractHoroscopeText(body.result);
      if (nested) return nested;
    }

    const candidates = ["daily", "today", "today_horoscope", "prediction"];
    for (const k of candidates) {
      if (body[k]) {
        const nested = extractHoroscopeText(body[k]);
        if (nested) return nested;
      }
    }

    return null;
  };

  const renderContent = (value) => {
    if (value == null) return null;
    if (Array.isArray(value)) {
      return (
        <ul style={styles.contentList}>
          {value.map((v, i) => (
            <li key={i} style={styles.contentItem}>
              {typeof v === "object" ? JSON.stringify(v) : v}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object") {
      return (
        <div style={styles.contentObject}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} style={styles.contentRow}>
              <b style={styles.contentLabel}>{formatKey(k)}:</b>
              <span>{typeof v === "object" ? JSON.stringify(v) : v}</span>
            </div>
          ))}
        </div>
      );
    }
    return <div style={styles.contentText}>{value}</div>;
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

  const renderHoroscope = (res) => {
    const body = (res && (res.data || res)) || {};

    const sections = body.sections || body.parts || body.items;
    if (Array.isArray(sections) && sections.length) {
      return (
        <div>
          {sections.map((sec, i) => (
            <div key={i} style={styles.section}>
              {sec.title && <h4 style={styles.sectionTitle}>{sec.title}</h4>}
              {sec.text && <div style={styles.sectionText}>{sec.text}</div>}
              {sec.content && renderContent(sec.content)}
            </div>
          ))}
        </div>
      );
    }

    if (body.horoscope && typeof body.horoscope === "object") {
      return (
        <div>
          {Object.entries(body.horoscope).map(([k, v]) => (
            <div key={k} style={styles.section}>
              <h4 style={styles.sectionTitle}>{formatKey(k)}</h4>
              {renderContent(v)}
            </div>
          ))}
        </div>
      );
    }

    const text = extractHoroscopeText(body);
    if (text) return <div style={styles.horoscopeText}>{text}</div>;

    return <pre style={styles.jsonPreview}>{JSON.stringify(body, null, 2)}</pre>;
  };

  const detectMySign = async () => {
    setError("");
    if (!dob || !time) {
      setError("Please provide DOB and time to detect your sun sign.");
      return;
    }
    if (!place && (!lat || !lng)) {
      setError("Please provide a place or latitude/longitude.");
      return;
    }

    try {
      setDetecting(true);
      setDetectedMsg("");

      const payload = { dob, time, place, lat: lat || undefined, lng: lng || undefined };
      const res = await API.post("/kundali/generate", payload);

      const sun = getSunSignFromResponse(res.data || res);

      if (sun) {
        const normalized = String(sun).toLowerCase().match(/[a-z]+/i)?.[0] || String(sun).toLowerCase();
        if (SIGNS.includes(normalized)) {
          setSign(normalized);
          setDetectedMsg(`✨ Detected sun sign: ${getDisplayName(normalized)}`);
        } else {
          setDetectedMsg(`Detected sign: ${sun}`);
        }
      } else {
        setError("Unable to detect sun sign from response.");
      }
    } catch (err) {
      console.error("Sign detection failed:", err);
      const errMsg = err?.response?.data?.message || "Failed to detect sign";
      setError(errMsg);
      alert(errMsg);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔮 Daily Horoscope</h1>

      <p style={styles.subtitle}>
        Discover your daily astrological predictions based on your zodiac sign.
      </p>

      {/* TABS */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setSelectedTab("manual")}
          style={{
            ...styles.tab,
            ...(selectedTab === "manual" ? styles.tabActive : styles.tabInactive)
          }}
        >
          📅 Select Sign
        </button>
        <button
          onClick={() => setSelectedTab("detect")}
          style={{
            ...styles.tab,
            ...(selectedTab === "detect" ? styles.tabActive : styles.tabInactive)
          }}
        >
          🎯 Detect My Sign
        </button>
      </div>

      {/* MANUAL TAB */}
      {selectedTab === "manual" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Choose Your Zodiac Sign</h2>

          <div style={styles.signGrid}>
            {SIGNS.map((s) => (
              <button
                key={s}
                onClick={() => setSign(s)}
                style={{
                  ...styles.signButton,
                  ...(sign === s ? styles.signButtonActive : {})
                }}
              >
                <div style={styles.signEmoji}>{SIGN_DISPLAY[s].emoji}</div>
                <div style={styles.signName}>{SIGN_DISPLAY[s].en}</div>
              </button>
            ))}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button onClick={fetchHoroscope} disabled={loading} style={styles.button}>
            {loading ? "⏳ Loading..." : "✨ Get Daily Horoscope"}
          </button>
        </div>
      )}

      {/* DETECT TAB */}
      {selectedTab === "detect" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Detect Your Sun Sign</h2>
          <p style={styles.cardSubtext}>
            Enter your birth details to automatically detect your sun sign.
          </p>

          <div style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formCol}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  style={styles.input}
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div style={styles.formCol}>
                <label style={styles.label}>Time of Birth</label>
                <input
                  style={styles.input}
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formCol}>
                <label style={styles.label}>Place (Optional)</label>
                <input
                  style={styles.input}
                  placeholder="City, Country"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formCol}>
                <label style={styles.label}>Latitude (Optional)</label>
                <input
                  style={styles.input}
                  placeholder="e.g., 40.7128"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div style={styles.formCol}>
                <label style={styles.label}>Longitude (Optional)</label>
                <input
                  style={styles.input}
                  placeholder="e.g., -74.0060"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {detectedMsg && <div style={styles.success}>{detectedMsg}</div>}

            <button onClick={detectMySign} disabled={detecting} style={styles.button}>
              {detecting ? "🔍 Detecting..." : "🔍 Detect My Sign"}
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div style={styles.resultCard}>
          <h2 style={styles.cardTitle}>{getDisplayName(sign)}</h2>
          <p style={styles.resultDate}>Today's Horoscope • {new Date().toLocaleDateString()}</p>
          {renderHoroscope(result)}
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

  tabContainer: {
    maxWidth: 800,
    margin: "0 auto 32px",
    display: "flex",
    gap: 12,
    background: "#111",
    padding: 8,
    borderRadius: 12,
    border: "1px solid #333"
  },

  tab: {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
    transition: "all 0.3s ease"
  },

  tabActive: {
    background: "#D4AF37",
    color: "black"
  },

  tabInactive: {
    background: "transparent",
    color: "#999"
  },

  card: {
    maxWidth: 800,
    margin: "0 auto 32px",
    background: "#111",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 16,
    padding: "28px"
  },

  cardTitle: {
    fontSize: 24,
    margin: "0 0 8px",
    color: "#D4AF37"
  },

  cardSubtext: {
    fontSize: 14,
    opacity: 0.7,
    margin: "0 0 20px"
  },

  signGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: 12,
    marginBottom: 24
  },

  signButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 16,
    background: "#0a0a0a",
    border: "2px solid #333",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "white"
  },

  signButtonActive: {
    background: "#D4AF37",
    borderColor: "#D4AF37",
    color: "black"
  },

  signEmoji: {
    fontSize: 32
  },

  signName: {
    fontSize: 12,
    fontWeight: 600
  },

  form: {
    display: "grid",
    gap: 18,
    marginBottom: 24
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
    transition: "all 0.3s ease"
  },

  error: {
    padding: 12,
    background: "rgba(255,100,100,0.1)",
    border: "1px solid #ff6464",
    borderRadius: 8,
    color: "#ff9999",
    fontSize: 14,
    marginBottom: 12
  },

  success: {
    padding: 12,
    background: "rgba(100,255,100,0.1)",
    border: "1px solid #64ff64",
    borderRadius: 8,
    color: "#99ff99",
    fontSize: 14,
    marginBottom: 12
  },

  resultCard: {
    maxWidth: 800,
    margin: "0 auto",
    background: "linear-gradient(135deg, #111, #0a0a0a)",
    border: "1px solid #D4AF37",
    borderRadius: 16,
    padding: "28px"
  },

  resultDate: {
    fontSize: 13,
    opacity: 0.6,
    margin: "0 0 20px"
  },

  section: {
    marginBottom: 20
  },

  sectionTitle: {
    fontSize: 18,
    color: "#D4AF37",
    margin: "0 0 12px",
    fontWeight: 600
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 1.8,
    opacity: 0.9,
    whiteSpace: "pre-wrap"
  },

  horoscopeText: {
    fontSize: 14,
    lineHeight: 1.8,
    opacity: 0.9,
    whiteSpace: "pre-wrap"
  },

  jsonPreview: {
    background: "#0a0a0a",
    padding: 16,
    borderRadius: 10,
    border: "1px solid #333",
    fontSize: 12,
    maxHeight: 400,
    overflow: "auto",
    color: "#999"
  },

  contentList: {
    margin: "8px 0 12px 20px",
    paddingLeft: 0
  },

  contentItem: {
    marginBottom: 6,
    fontSize: 14
  },

  contentObject: {
    margin: "6px 0"
  },

  contentRow: {
    marginBottom: 8,
    fontSize: 14
  },

  contentLabel: {
    color: "#D4AF37"
  },

  contentText: {
    margin: "6px 0 12px"
  }
};
