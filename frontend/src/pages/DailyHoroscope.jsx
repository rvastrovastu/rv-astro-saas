import { useState } from "react";
import API from "../utils/api";
import BackHomeButton from "../components/BackHomeButton";

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
  aries: { en: "Aries", sa: "Mesha" },
  taurus: { en: "Taurus", sa: "Vrishabha" },
  gemini: { en: "Gemini", sa: "Mithuna" },
  cancer: { en: "Cancer", sa: "Karka" },
  leo: { en: "Leo", sa: "Simha" },
  virgo: { en: "Virgo", sa: "Kanya" },
  libra: { en: "Libra", sa: "Tula" },
  scorpio: { en: "Scorpio", sa: "Vrishchika" },
  sagittarius: { en: "Sagittarius", sa: "Dhanu" },
  capricorn: { en: "Capricorn", sa: "Makara" },
  aquarius: { en: "Aquarius", sa: "Kumbha" },
  pisces: { en: "Pisces", sa: "Meena" }
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const getDisplayName = (sign) => {
  if (!sign) return "";
  const key = String(sign).toLowerCase();
  const entry = SIGN_DISPLAY[key];
  return entry ? `${entry.en} • ${entry.sa}` : capitalize(key);
};

export default function DailyHoroscope() {
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

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      const res = await API.post("/western/daily-horoscope", { sign });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to fetch horoscope");
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

    // If response is an array, try join texts
    if (Array.isArray(body)) {
      const texts = body.map((b) => extractHoroscopeText(b)).filter(Boolean);
      return texts.length ? texts.join("\n\n") : null;
    }

    // Common keys
    if (typeof body === "string") return body;
    if (body.horoscope && typeof body.horoscope === "string") return body.horoscope;
    if (body.horoscope && typeof body.horoscope === "object") {
      if (body.horoscope.text) return body.horoscope.text;
      if (body.horoscope.description) return body.horoscope.description;
    }
    if (body.text) return body.text;
    if (body.description) return body.description;
    if (body.summary) return body.summary;

    // Nested shapes used by some providers
    if (body.data) {
      const nested = extractHoroscopeText(body.data);
      if (nested) return nested;
    }

    if (body.result) {
      const nested = extractHoroscopeText(body.result);
      if (nested) return nested;
    }

    // Try common field names inside objects
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
        <ul style={{ margin: "8px 0 12px 20px" }}>
          {value.map((v, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{typeof v === "object" ? JSON.stringify(v) : v}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object") {
      return (
        <div style={{ margin: "6px 0" }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 8 }}>
              <b>{capitalize(k)}:</b> {typeof v === "object" ? JSON.stringify(v) : v}
            </div>
          ))}
        </div>
      );
    }
    return <div style={{ margin: "6px 0 12px" }}>{value}</div>;
  };

  const renderHoroscope = (res) => {
    const body = (res && (res.data || res)) || {};

    // Structured 'sections' style
    const sections = body.sections || body.parts || body.items;
    if (Array.isArray(sections) && sections.length) {
      return (
        <div>
          {sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              {sec.title && <h4 style={{ margin: "6px 0" }}>{sec.title}</h4>}
              {sec.text && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{sec.text}</div>}
              {sec.content && renderContent(sec.content)}
            </div>
          ))}
        </div>
      );
    }

    // Horoscope object with categories (love, career, health)
    if (body.horoscope && typeof body.horoscope === "object") {
      return (
        <div>
          {Object.entries(body.horoscope).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <h4 style={{ margin: "6px 0" }}>{capitalize(k)}</h4>
              {renderContent(v)}
            </div>
          ))}
        </div>
      );
    }

    // Fallback to extracted text
    const text = extractHoroscopeText(body);
    if (text) return <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{text}</div>;

    return <pre style={{ whiteSpace: "pre-wrap", maxHeight: 420, overflow: "auto" }}>{JSON.stringify(body, null, 2)}</pre>;
  };

  const detectMySign = async () => {
    if (!dob || !time) return alert("Please provide DOB and time to detect your sun sign.");
    if (!place && (!lat || !lng)) return alert("Please provide a place or latitude/longitude.");

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
          setDetectedMsg(`Detected sun sign: ${getDisplayName(normalized)}`);
        } else {
          setDetectedMsg(`Detected sign: ${sun}`);
        }
      } else {
        setDetectedMsg("Unable to detect sun sign from response.");
      }
    } catch (err) {
      console.error("Sign detection failed:", err);
      alert(err?.response?.data?.message || "Failed to detect sign");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔮 Daily Horoscope</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(e.target.value)}>
            {SIGNS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <input placeholder="Place" value={place} onChange={(e) => setPlace(e.target.value)} style={{ width: 160 }} />
          <input placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} style={{ width: 80 }} />
          <input placeholder="Lng" value={lng} onChange={(e) => setLng(e.target.value)} style={{ width: 80 }} />

          <button onClick={detectMySign} disabled={detecting} style={{ padding: 8 }}>
            {detecting ? "Detecting..." : "Detect My Sign"}
          </button>
        </div>

        <button onClick={fetchHoroscope} disabled={loading} style={{ padding: 10 }}>
          {loading ? "Loading..." : "Get Today"}
        </button>
      </div>

      {detectedMsg && <p style={{ marginTop: 8, color: "#ffd966" }}>{detectedMsg}</p>}

      {result && (
        <div style={{ marginTop: 20, background: "#111", padding: 14, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Horoscope — {getDisplayName(sign)}</h3>
          {renderHoroscope(result)}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <BackHomeButton />
      </div>
    </div>
  );
}
