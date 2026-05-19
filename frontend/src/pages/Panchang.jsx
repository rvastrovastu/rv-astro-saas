import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDailyPanchang } from "../api/panchang";

export default function Panchang() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    place: "Dallas",
    lat: 32.7767,
    lon: -96.797,
    tzone: -5,
    question: "panchang",
    language: "en"
  });

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPanchang = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        question: form.question,
        time: form.time,
        language: form.language
      };

      const res = await getDailyPanchang(payload);
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

  const currentPeriod =
    raw.current_period ||
    p.current_period ||
    raw.currentPeriod ||
    p.currentPeriod ||
    null;

  const chaughadiaSections =
    raw.sections ||
    p.sections ||
    raw.periods ||
    p.periods ||
    null;

  const hasChaughadia = !!(currentPeriod || chaughadiaSections);

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

  const renderInfo = (title, values, props = {}) => {
    const formatted = panchangValue(...values);
    if (formatted === "N/A") return null;
    return <Info key={title} title={title} value={formatted} {...props} />;
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
          type="time"
          placeholder="Time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <select
          style={styles.input}
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        >
          <option value="panchang">Daily Panchang</option>
          <option value="chaughadia">Chaughadia</option>
        </select>

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

          <h2 style={styles.sectionTitle}>Request Time Panchang</h2>

          <div style={styles.grid}>
            {renderInfo("Current Tithi", [requestTime?.tithi?.name, requestTime?.tithi, requestTime?.tithi?.value])}
            {renderInfo("Current Paksha", [requestTime?.tithi?.paksha, requestTime?.paksha, requestTime?.paksha?.name])}
            {renderInfo("Current Nakshatra", [requestTime?.nakshatra?.name, requestTime?.nakshatra, requestTime?.nakshatra?.value])}
            {renderInfo("Current Nakshatra Pada", [requestTime?.nakshatra?.pada, requestTime?.nakshatra?.pada?.name])}
            {renderInfo("Current Nakshatra Lord", [requestTime?.nakshatra?.lord, requestTime?.nakshatra?.lord?.name])}
            {renderInfo("Current Yoga", [requestTime?.yoga?.name, requestTime?.yoga, requestTime?.yoga?.value])}
            {renderInfo("Current Karana", [requestTime?.karana?.name, requestTime?.karana, requestTime?.karana?.value])}
            {renderInfo("Sun Sign", [requestTime?.sun_sign?.name, requestTime?.sun_sign, requestTime?.sunSign])}
            {renderInfo("Moon Sign", [requestTime?.moon_sign?.name, requestTime?.moon_sign, requestTime?.moonSign])}
          </div>

          <h2 style={styles.sectionTitle}>शुभ / अशुभ समय</h2>

          <div style={styles.grid}>
            {renderInfo("Rahu Kaal", [p.rahuKaal, p.rahu_kaal, raw.rahu_kalam, raw.rahu_kaal, raw.rahukaal], { danger: true })}
            {renderInfo("Gulika Kaal", [p.gulikaKaal, p.gulika_kaal, raw.gulika_kalam, raw.gulika_kaal])}
            {renderInfo("Yama Gandam", [p.yamaGandam, p.yama_gandam, raw.yama_gandam, raw.yamagandam], { danger: true })}
            {renderInfo("Abhijit Muhurat", [p.abhijitMuhurat, p.abhijit_muhurat, raw.abhijit_muhurat, raw.abhijit], { good: true })}
            {renderInfo("Brahma Muhurat", [p.brahmaMuhurat, p.brahma_muhurat, raw.brahma_muhurat, raw.brahma], { good: true })}
            {renderInfo("Amrit Kaal", [p.amritKaal, p.amrit_kaal, raw.amrit_kaal, raw.amrit], { good: true })}
            {renderInfo("Dur Muhurat", [p.durMuhurat, p.dur_muhurat, raw.dur_muhurat, raw.durmuhurat, raw.durMuhurat], { danger: true })}
          </div>

          <div style={styles.grid}>
            {renderInfo("Date", [raw.date, data?.date, p.date])}
            {renderInfo("Location", [raw.location ? `${raw.location.lat}, ${raw.location.lng}` : null, p.location?.lat && p.location?.lon ? `${p.location.lat}, ${p.location.lon}` : null, `${form.lat}, ${form.lon}`])}
            {renderInfo("Sunrise", [raw.sunrise, p.sunrise, p.sun_rise, p.sun?.rise])}
            {renderInfo("Sunset", [raw.sunset, p.sunset, p.sun_set, p.sun?.set])}
            {renderInfo("Weekday", [raw.weekday?.name])}
            {renderInfo("Lunar Month", [raw.lunar_month?.name])}
            {renderInfo("Vikram Samvat", [raw.lunar_month?.vikram_samvat])}
            {renderInfo("Amanta", [raw.lunar_month?.amanta ? "Yes" : null])}
            {renderInfo("Tithi", [raw.tithi?.name, p.tithi])}
            {renderInfo("Tithi Paksha", [raw.tithi?.paksha])}
            {renderInfo("Tithi Ends At", [raw.tithi?.ends_at])}
            {renderInfo("Nakshatra", [raw.nakshatra?.name, p.nakshatra])}
            {renderInfo("Nakshatra Pada", [raw.nakshatra?.pada])}
            {renderInfo("Nakshatra Lord", [raw.nakshatra?.lord])}
            {renderInfo("Nakshatra Ends At", [raw.nakshatra?.ends_at])}
            {renderInfo("Yoga", [raw.yoga?.name, p.yoga])}
            {renderInfo("Yoga Ends At", [raw.yoga?.ends_at])}
            {renderInfo("Karanas", [karanasText])}
          </div>

          {hasChaughadia && (
            <div style={styles.chaughadiaSection}>
              <h2 style={styles.sectionTitle}>Chaughadia</h2>

              {currentPeriod && (
                <div style={styles.chaughadiaCard}>
                  <h3>Current Period</h3>
                  <p><b>{currentPeriod.name}</b> ({currentPeriod.section})</p>
                  <p>{currentPeriod.start_time} - {currentPeriod.end_time}</p>
                  <p>Quality: {currentPeriod.quality || "Unknown"}</p>
                </div>
              )}

              {chaughadiaSections &&
                Object.entries(chaughadiaSections).map(([sectionName, items]) => (
                  Array.isArray(items) && items.length > 0 ? (
                    <div key={sectionName} style={styles.chaughadiaGroup}>
                      <h3>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h3>
                      <div style={styles.chaughadiaGrid}>
                        {items.map((item) => (
                          <div key={item.id || item.name} style={styles.chaughadiaCard}>
                            <b>{item.name}</b>
                            <span>{item.start_time} - {item.end_time}</span>
                            <span>{item.quality}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                ))}
            </div>
          )}

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
  chaughadiaSection: {
    marginTop: 25,
    background: "#111",
    border: "1px solid #333",
    borderRadius: 14,
    padding: 20
  },
  chaughadiaGroup: {
    marginTop: 20
  },
  chaughadiaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 12
  },
  chaughadiaCard: {
    background: "#121212",
    border: "1px solid #333",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6
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

// Mobile responsive adjustments
if (typeof window !== "undefined" && window.innerWidth < 768) {
  styles.container = {
    ...styles.container,
    padding: "16px"
  };

  styles.title = {
    ...styles.title,
    fontSize: "28px"
  };

  styles.form = {
    ...styles.form,
    gridTemplateColumns: "1fr"
  };

  styles.grid = {
    ...styles.grid,
    gridTemplateColumns: "1fr"
  };
}