import { useState } from "react";
import { getDailyPanchang } from "../api/panchang";

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

  const formatRange = (value) => {
    if (value?.start && value?.end) {
      return `${value.start} - ${value.end}`;
    }

    return value || "N/A";
  };

  const formatKarana = () => {
    if (Array.isArray(raw?.karanas) && raw.karanas.length > 0) {
      return raw.karanas.map((k) => k.name).join(", ");
    }

    if (Array.isArray(p?.karanas) && p.karanas.length > 0) {
      return p.karanas.map((k) => k.name).join(", ");
    }

    return p.karana?.name || p.karana || raw?.request_time_panchang?.karana?.name || "N/A";
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
              Source:{" "}
              {data.source === "real_api"
                ? "Real Panchang API"
                : "Fallback Demo Data"}
            </p>

            {data.debug && <p style={styles.debug}>Debug: {data.debug}</p>}
          </div>

          <div style={styles.grid}>
            <Info title="Tithi" value={p.tithi || raw?.tithi?.name || "N/A"} />
            <Info title="Nakshatra" value={p.nakshatra || raw?.nakshatra?.name || "N/A"} />
            <Info title="Yoga" value={p.yoga || raw?.yoga?.name || "N/A"} />
            <Info title="Karana" value={formatKarana()} />
            <Info title="Sunrise" value={p.sunrise || raw?.sunrise || "N/A"} />
            <Info title="Sunset" value={p.sunset || raw?.sunset || "N/A"} />
            <Info title="Moonrise" value={p.moonrise || raw?.moonrise || "N/A"} />
            <Info title="Moonset" value={p.moonset || raw?.moonset || "N/A"} />
          </div>

          <h2 style={styles.sectionTitle}>शुभ / अशुभ समय</h2>

          <div style={styles.grid}>
            <Info title="Rahu Kaal" value={formatRange(p.rahuKaal || raw?.rahu_kalam)} danger />
            <Info title="Gulika Kaal" value={formatRange(p.gulikaKaal || raw?.gulika_kalam)} />
            <Info title="Yama Gandam" value={formatRange(p.yamaGandam || raw?.yama_gandam)} danger />
            <Info title="Abhijit Muhurat" value={formatRange(p.abhijitMuhurat || raw?.abhijit_muhurat)} good />
            <Info title="Brahma Muhurat" value={formatRange(p.brahmaMuhurat || raw?.brahma_muhurat)} good />
            <Info title="Amrit Kaal" value={formatRange(p.amritKaal || raw?.amrit_kaal)} good />
            <Info title="Dur Muhurat" value={formatRange(p.durMuhurat || raw?.dur_muhurat)} danger />
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