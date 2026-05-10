import { useState } from "react";
//import { getDailyPanchang } from "../api/panchang";
import API from "../utils/api";

export const getDailyPanchang = (data) => {
  return API.post("/panchang/daily", data);
};

export default function Panchang() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    place: "Dallas",
    lat: 32.7767,
    lon: -96.797,
    tzone: -5
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPanchang = async () => {
    try {
      setLoading(true);

      const res = await getDailyPanchang(form);

      console.log("PANCHANG API RESPONSE:", res.data);

      setData(res.data);
    } catch (err) {
      console.error("Panchang fetch failed:", err);
      alert(err?.response?.data?.message || "Failed to load Panchang");
    } finally {
      setLoading(false);
    }
  };

  const p = data?.panchang || {};
  const raw = data?.rawPanchang || {};

  const getValue = (...values) => {
    for (const value of values) {
      if (value === undefined || value === null || value === "") continue;

      if (typeof value === "object") {
        return (
          value.name ||
          value.value ||
          value.full_name ||
          value.start ||
          value.end ||
          JSON.stringify(value)
        );
      }

      return value;
    }

    return "N/A";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Panchang & Muhurat</h1>

      <p style={styles.subtitle}>
        Daily Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Abhijit Muhurat,
        Brahma Muhurat, and auspicious timings.
      </p>

      <div style={styles.form}>
        <input
          type="date"
          style={styles.input}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Place"
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Latitude"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
        />

        <input
          style={styles.input}
          placeholder="Longitude"
          value={form.lon}
          onChange={(e) => setForm({ ...form, lon: Number(e.target.value) })}
        />

        <input
          style={styles.input}
          placeholder="Timezone"
          value={form.tzone}
          onChange={(e) => setForm({ ...form, tzone: Number(e.target.value) })}
        />

        <button onClick={fetchPanchang} style={styles.btn}>
          {loading ? "Loading Panchang..." : "Get Panchang"}
        </button>
      </div>

      {data && (
        <div style={styles.result}>
          <div style={styles.headerCard}>
            <h2>🕉️ Panchang for {data.place || form.place}</h2>
            <p>{data.date || form.date}</p>
            <p style={styles.source}>
              Source: {data.source === "real_api" ? "Real Panchang API" : "Fallback Demo Data"}
            </p>

            {data.debug && <p style={styles.debug}>Debug: {data.debug}</p>}
          </div>

          <div style={styles.grid}>
            <Info title="Tithi" value={getValue(p.tithi, p.tithi?.name, raw?.output?.tithi, raw?.tithi)} />
            <Info title="Nakshatra" value={getValue(p.nakshatra, p.nakshatra?.name, raw?.output?.nakshatra, raw?.nakshatra)} />
            <Info title="Yoga" value={getValue(p.yoga, p.yoga?.name, raw?.output?.yoga, raw?.yoga)} />
            <Info title="Karana" value={getValue(p.karana, p.karana?.name, raw?.output?.karana, raw?.karana)} />
            <Info title="Sunrise" value={getValue(p.sunrise, p.sun_rise, raw?.output?.sunrise, raw?.sunrise)} />
            <Info title="Sunset" value={getValue(p.sunset, p.sun_set, raw?.output?.sunset, raw?.sunset)} />
            <Info title="Moonrise" value={getValue(p.moonrise, p.moon_rise, raw?.output?.moonrise, raw?.moonrise)} />
            <Info title="Moonset" value={getValue(p.moonset, p.moon_set, raw?.output?.moonset, raw?.moonset)} />
          </div>

          <h2 style={styles.sectionTitle}> शुभ / अशुभ समय</h2>

          <div style={styles.grid}>
            <Info title="Rahu Kaal" value={getValue(p.rahuKaal, p.rahu_kaal, p.rahukaal, raw?.output?.rahuKaal, raw?.output?.rahu_kaal)} danger />
            <Info title="Gulika Kaal" value={getValue(p.gulikaKaal, p.gulika_kaal, p.gulika, raw?.output?.gulikaKaal)} />
            <Info title="Yama Gandam" value={getValue(p.yamaGandam, p.yama_gandam, p.yamagandam, raw?.output?.yamaGandam)} danger />
            <Info title="Abhijit Muhurat" value={getValue(p.abhijitMuhurat, p.abhijit_muhurat, raw?.output?.abhijitMuhurat)} good />
            <Info title="Brahma Muhurat" value={getValue(p.brahmaMuhurat, p.brahma_muhurat, raw?.output?.brahmaMuhurat)} good />
            <Info title="Amrit Kaal" value={getValue(p.amritKaal, p.amrit_kaal, raw?.output?.amritKaal)} good />
            <Info title="Dur Muhurat" value={getValue(p.durMuhurat, p.dur_muhurat, raw?.output?.durMuhurat)} danger />
          </div>

          <div style={styles.muhuratBox}>
            <h2>✨ Muhurat Guidance</h2>
            <p>
              शुभ कार्यों के लिए Abhijit Muhurat, Brahma Muhurat और Amrit Kaal
              को प्राथमिकता दें। Rahu Kaal, Yama Gandam और Dur Muhurat में
              नए कार्य शुरू करने से बचें।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ title, value, good, danger }) {
  return (
    <div
      style={{
        ...styles.infoCard,
        border: good
          ? "1px solid #2ecc71"
          : danger
          ? "1px solid #e74c3c"
          : "1px solid #333"
      }}
    >
      <span style={styles.label}>{title}</span>
      <b>{String(value || "N/A")}</b>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "white",
    padding: 20,
    fontFamily: "Arial"
  },

  title: {
    color: "#D4AF37",
    textAlign: "center",
    fontSize: 36
  },

  subtitle: {
    maxWidth: 800,
    margin: "0 auto 25px",
    textAlign: "center",
    opacity: 0.75,
    lineHeight: 1.6
  },

  form: {
    maxWidth: 760,
    margin: "20px auto",
    background: "#111",
    padding: 20,
    borderRadius: 14,
    border: "1px solid #333",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "white"
  },

  btn: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#D4AF37",
    color: "black",
    fontWeight: "bold",
    cursor: "pointer"
  },

  result: {
    maxWidth: 1000,
    margin: "25px auto"
  },

  headerCard: {
    background: "#111",
    border: "1px solid #D4AF37",
    borderRadius: 14,
    padding: 20,
    textAlign: "center",
    marginBottom: 20
  },

  source: {
    fontSize: 12,
    opacity: 0.65
  },

  debug: {
    fontSize: 12,
    opacity: 0.7,
    color: "#ffcc66"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14
  },

  infoCard: {
    background: "#111",
    padding: 16,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },

  label: {
    fontSize: 12,
    opacity: 0.65
  },

  sectionTitle: {
    color: "#D4AF37",
    marginTop: 30
  },

  muhuratBox: {
    marginTop: 25,
    background: "#111",
    border: "1px solid #333",
    borderRadius: 14,
    padding: 20,
    lineHeight: 1.6
  }
};