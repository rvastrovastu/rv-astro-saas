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

  const raw = data?.rawPanchang || {};
  const p = data?.panchang || {};

  const range = (obj) =>
    obj?.start && obj?.end ? `${obj.start} - ${obj.end}` : "N/A";

  const karanasText = Array.isArray(raw.karanas)
    ? raw.karanas
        .map((k) => `${k.name} until ${k.ends_at}`)
        .join(", ")
    : "N/A";

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
            <Info title="Date" value={raw.date || data?.date || "N/A"} />
            <Info title="Location" value={raw.location ? `${raw.location.lat}, ${raw.location.lng}` : "N/A"} />
            <Info title="Sunrise" value={raw.sunrise || p.sunrise || "N/A"} />
            <Info title="Sunset" value={raw.sunset || p.sunset || "N/A"} />

            <Info title="Weekday" value={raw.weekday?.name || "N/A"} />
            <Info title="Lunar Month" value={raw.lunar_month?.name || "N/A"} />
            <Info title="Vikram Samvat" value={raw.lunar_month?.vikram_samvat || "N/A"} />
            <Info title="Amanta" value={raw.lunar_month?.amanta ? "Yes" : "No"} />

            <Info title="Tithi" value={raw.tithi?.name || p.tithi || "N/A"} />
            <Info title="Tithi Paksha" value={raw.tithi?.paksha || "N/A"} />
            <Info title="Tithi Ends At" value={raw.tithi?.ends_at || "N/A"} />

            <Info title="Nakshatra" value={raw.nakshatra?.name || p.nakshatra || "N/A"} />
            <Info title="Nakshatra Pada" value={raw.nakshatra?.pada || "N/A"} />
            <Info title="Nakshatra Lord" value={raw.nakshatra?.lord || "N/A"} />
            <Info title="Nakshatra Ends At" value={raw.nakshatra?.ends_at || "N/A"} />

            <Info title="Yoga" value={raw.yoga?.name || p.yoga || "N/A"} />
            <Info title="Yoga Ends At" value={raw.yoga?.ends_at || "N/A"} />

            <Info title="Karanas" value={karanasText} />
            <Info title="Rahu Kalam" value={range(raw.rahu_kalam || p.rahuKaal)} danger />
          </div>

          <h2 style={styles.sectionTitle}>Request Time Panchang</h2>

          <div style={styles.grid}>
            <Info title="Current Tithi" value={raw.request_time_panchang?.tithi?.name || "N/A"} />
            <Info title="Current Paksha" value={raw.request_time_panchang?.tithi?.paksha || "N/A"} />
            <Info title="Current Nakshatra" value={raw.request_time_panchang?.nakshatra?.name || "N/A"} />
            <Info title="Current Nakshatra Pada" value={raw.request_time_panchang?.nakshatra?.pada || "N/A"} />
            <Info title="Current Nakshatra Lord" value={raw.request_time_panchang?.nakshatra?.lord || "N/A"} />
            <Info title="Current Yoga" value={raw.request_time_panchang?.yoga?.name || "N/A"} />
            <Info title="Current Karana" value={raw.request_time_panchang?.karana?.name || "N/A"} />
            <Info title="Sun Sign" value={raw.request_time_panchang?.sun_sign?.name || "N/A"} />
            <Info title="Moon Sign" value={raw.request_time_panchang?.moon_sign?.name || "N/A"} />
          </div>

          <h2 style={styles.sectionTitle}>Calculation Metadata</h2>

          <div style={styles.grid}>
            <Info title="Endpoint Version" value={raw.metadata?.endpoint_version || "N/A"} />
            <Info title="Ruleset" value={raw.metadata?.ruleset_version || "N/A"} />
            <Info title="Ayanamsha" value={raw.metadata?.ayanamsha || "N/A"} />
            <Info title="Timezone Used" value={raw.metadata?.timezone_used || "N/A"} />
            <Info title="Calculation Basis" value={raw.metadata?.calculation_basis || "N/A"} />
            <Info title="Request Local Time" value={raw.metadata?.request_local_time || "N/A"} />
          </div>

          <h2 style={styles.sectionTitle}>शुभ / अशुभ समय</h2>

          <div style={styles.grid}>
            <Info title="Rahu Kaal" value={range(p.rahuKaal || raw?.rahu_kalam)} danger />
            <Info title="Gulika Kaal" value={range(p.gulikaKaal || raw?.gulika_kalam)} />
            <Info title="Yama Gandam" value={range(p.yamaGandam || raw?.yama_gandam)} danger />
            <Info title="Abhijit Muhurat" value={range(p.abhijitMuhurat || raw?.abhijit_muhurat)} good />
            <Info title="Brahma Muhurat" value={range(p.brahmaMuhurat || raw?.brahma_muhurat)} good />
            <Info title="Amrit Kaal" value={range(p.amritKaal || raw?.amrit_kaal)} good />
            <Info title="Dur Muhurat" value={range(p.durMuhurat || raw?.dur_muhurat)} danger />
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