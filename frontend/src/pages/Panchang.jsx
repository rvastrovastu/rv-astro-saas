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
  const [showDebug, setShowDebug] = useState(false);

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

  const raw =
    data?.rawPanchang ||
    data?.data?.rawPanchang ||
    data?.raw ||
    data?.data?.raw ||
    data?.output?.raw ||
    {};
  const p =
    data?.panchang ||
    data?.data?.panchang ||
    data?.data ||
    data?.output ||
    data ||
    {};

  const formatTiming = (value) => {
    if (value == null || value === "") return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "object") {
      if (value.start && value.end) return `${value.start} - ${value.end}`;
      if (value.from && value.to) return `${value.from} - ${value.to}`;
      if (value.name) return value.name;
      if (value.value) return String(value.value);
      return JSON.stringify(value);
    }
    return String(value);
  };

  const panchangValue = (...values) => {
    for (const value of values) {
      const formatted = formatTiming(value);
      if (formatted !== "N/A") return formatted;
    }
    return "N/A";
  };

  const requestTime =
    raw.request_time_panchang ||
    raw.requestTimePanchang ||
    raw.request_time ||
    raw.requestTime ||
    p.request_time_panchang ||
    p.requestTime ||
    p.request_time ||
    p.requestTime ||
    {};

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
            <button
              onClick={() => setShowDebug((prev) => !prev)}
              style={styles.debugBtn}
            >
              {showDebug ? "Hide API Debug" : "Show API Debug"}
            </button>
          </div>

          {showDebug && (
            <pre style={styles.debugPanel}>
              {JSON.stringify({ data, raw, p, requestTime }, null, 2)}
            </pre>
          )}

          <h2 style={styles.sectionTitle}>Request Time Panchang</h2>

          <div style={styles.grid}>
            <Info title="Current Tithi" value={panchangValue(requestTime?.tithi?.name, requestTime?.tithi, requestTime?.tithi?.value)} />
            <Info title="Current Paksha" value={panchangValue(requestTime?.tithi?.paksha, requestTime?.paksha, requestTime?.paksha?.name)} />
            <Info title="Current Nakshatra" value={panchangValue(requestTime?.nakshatra?.name, requestTime?.nakshatra, requestTime?.nakshatra?.value)} />
            <Info title="Current Nakshatra Pada" value={panchangValue(requestTime?.nakshatra?.pada, requestTime?.nakshatra?.pada?.name)} />
            <Info title="Current Nakshatra Lord" value={panchangValue(requestTime?.nakshatra?.lord, requestTime?.nakshatra?.lord?.name)} />
            <Info title="Current Yoga" value={panchangValue(requestTime?.yoga?.name, requestTime?.yoga, requestTime?.yoga?.value)} />
            <Info title="Current Karana" value={panchangValue(requestTime?.karana?.name, requestTime?.karana, requestTime?.karana?.value)} />
            <Info title="Sun Sign" value={panchangValue(requestTime?.sun_sign?.name, requestTime?.sun_sign, requestTime?.sunSign)} />
            <Info title="Moon Sign" value={panchangValue(requestTime?.moon_sign?.name, requestTime?.moon_sign, requestTime?.moonSign)} />
          </div>

          <h2 style={styles.sectionTitle}>शुभ / अशुभ समय</h2>

          <div style={styles.grid}>
            <Info
              title="Rahu Kaal"
              value={panchangValue(p.rahuKaal, p.rahu_kaal, raw.rahu_kalam, raw.rahu_kaal, raw.rahukaal)}
              danger
            />
            <Info
              title="Gulika Kaal"
              value={panchangValue(p.gulikaKaal, p.gulika_kaal, raw.gulika_kalam, raw.gulika_kaal)}
            />
            <Info
              title="Yama Gandam"
              value={panchangValue(p.yamaGandam, p.yama_gandam, raw.yama_gandam, raw.yamagandam)}
              danger
            />
            <Info
              title="Abhijit Muhurat"
              value={panchangValue(p.abhijitMuhurat, p.abhijit_muhurat, raw.abhijit_muhurat, raw.abhijit)}
              good
            />
            <Info
              title="Brahma Muhurat"
              value={panchangValue(p.brahmaMuhurat, p.brahma_muhurat, raw.brahma_muhurat, raw.brahma)}
              good
            />
            <Info
              title="Amrit Kaal"
              value={panchangValue(p.amritKaal, p.amrit_kaal, raw.amrit_kaal, raw.amrit)}
              good
            />
            <Info
              title="Dur Muhurat"
              value={panchangValue(p.durMuhurat, p.dur_muhurat, raw.dur_muhurat, raw.durmuhurat, raw.durMuhurat)}
              danger
            />
          </div>

          <div style={styles.grid}>
            <Info title="Date" value={panchangValue(raw.date, data?.date, p.date)} />
            <Info title="Location" value={panchangValue(raw.location ? `${raw.location.lat}, ${raw.location.lng}` : null, p.location?.lat && p.location?.lon ? `${p.location.lat}, ${p.location.lon}` : null, `${form.lat}, ${form.lon}`)} />
            <Info title="Sunrise" value={panchangValue(raw.sunrise, p.sunrise, p.sun_rise, p.sun?.rise)} />
            <Info title="Sunset" value={panchangValue(raw.sunset, p.sunset, p.sun_set, p.sun?.set)} />

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
  debugBtn: {
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #666",
    background: "#222",
    color: "white",
    cursor: "pointer"
  },
  debugPanel: {
    marginTop: 20,
    background: "#121212",
    border: "1px solid #333",
    borderRadius: 14,
    padding: 16,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 12,
    lineHeight: 1.4,
    maxHeight: 360
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