import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getKundali } from "../api/astrology";

/* ================= ZODIAC WHEEL ================= */
function ZodiacWheel({ kundali }) {
  const size = 360;
  const center = size / 2;
  const radius = 140;

  const planets = kundali?.planets || {};
  const housesRaw = kundali?.houses;

  const houses = Array.isArray(housesRaw)
    ? housesRaw
    : housesRaw && typeof housesRaw === "object"
    ? Object.keys(housesRaw)
    : Array.from({ length: 12 }, (_, i) => `H${i + 1}`);

  const zodiac = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  const degToRad = (deg) => (deg - 90) * (Math.PI / 180);

  const getXY = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  return (
    <div style={styles.card}>
      <h3 style={styles.goldCenter}>🪐 Kundali Wheel</h3>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svgWheel}>
        <circle cx={center} cy={center} r={radius} stroke="#D4AF37" strokeWidth="2" fill="none" />
        <circle cx={center} cy={center} r={radius * 0.6} stroke="#444" strokeWidth="1" fill="none" />

        {zodiac.map((sign, i) => {
          const angle = degToRad(i * 30 + 15);
          const pos = getXY(angle, radius + 25);

          return (
            <text key={i} x={pos.x} y={pos.y} fill="#FFD700" fontSize="16" textAnchor="middle" fontWeight="bold">
              {sign}
            </text>
          );
        })}

        {houses.slice(0, 12).map((_, i) => {
          const angle = degToRad(i * 30);
          const pos = getXY(angle, radius);

          return (
            <line key={i} x1={center} y1={center} x2={pos.x} y2={pos.y} stroke="#333" strokeWidth="1" />
          );
        })}

        {Object.entries(planets).map(([planet, value], i) => {
          const degree =
            typeof value === "object" && value?.degree !== undefined
              ? Number(value.degree)
              : i * 30;

          const angle = degToRad(degree);
          const pos = getXY(angle, radius * 0.5);

          return (
            <g key={planet}>
              <circle cx={pos.x} cy={pos.y} r="10" fill="#1e1e1e" stroke="#D4AF37" />
              <text x={pos.x} y={pos.y + 4} fill="#D4AF37" fontSize="10" textAnchor="middle" fontWeight="bold">
                {planet?.[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ================= DASHA ================= */
function DashaTimeline({ kundali }) {
  const dasha = kundali?.dasha || [];

  return (
    <div style={styles.card}>
      <h3>📈 Dasha Timeline</h3>

      {dasha.length ? (
        dasha.map((d, i) => (
          <p key={i}>
            <b>{d.planet}</b> → {d.years} years
          </p>
        ))
      ) : (
        <p>No Dasha data available yet.</p>
      )}
    </div>
  );
}

/* ================= TRANSIT ================= */
function TransitPanel() {
  return (
    <div style={styles.card}>
      <h3>🎯 Transits</h3>
      <p>Saturn influencing career and responsibility.</p>
      <p>Jupiter supporting growth and wisdom.</p>
    </div>
  );
}

/* ================= HOUSE INSIGHTS ================= */
function HouseAIInsights({ kundali }) {
  const houses = kundali?.houses || {};

  return (
    <div style={styles.card}>
      <h3>🧠 House Insights</h3>

      {Object.keys(houses).length ? (
        Object.entries(houses).map(([h, v]) => (
          <p key={h}>
            <b>{h.replace("_", " ")}:</b> {String(v)}
          </p>
        ))
      ) : (
        <p>House insights will appear after detailed chart generation.</p>
      )}
    </div>
  );
}

/* ================= BASIC RESULT UI ================= */
function BasicKundaliResult({ kundali }) {
  return (
    <div style={styles.basicResult}>
      <h3 style={styles.goldCenter}>📊 Basic Kundali Result</h3>

      <div style={styles.summaryGrid}>
        <div style={styles.resultTile}>
          <span style={styles.label}>Name</span>
          <b>{kundali.native?.name || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Birth Date</span>
          <b>{kundali.native?.dob || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Birth Time</span>
          <b>{kundali.native?.time || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Birth Place</span>
          <b>{kundali.native?.place || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Latitude</span>
          <b>{kundali.native?.lat ?? "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Longitude</span>
          <b>{kundali.native?.lng ?? "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Timezone</span>
          <b>{kundali.native?.tz_str || kundali.location?.timezone || kundali.meta?.timezone_used || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Ayanamsha</span>
          <b>{kundali.native?.ayanamsha || kundali.meta?.ayanamsha || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>House System</span>
          <b>{kundali.native?.house_system || kundali.meta?.house_system || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Node Type</span>
          <b>{kundali.native?.node_type || kundali.meta?.node_type || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Ascendant</span>
          <b>{kundali.ascendant || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Sun Sign</span>
          <b>{kundali.sunSign || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Moon Sign</span>
          <b>{kundali.moonSign || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Ascendant Degree</span>
          <b>{(kundali.ascendant_degree ?? kundali.ascendantRaw?.degree) || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Source</span>
          <b>{kundali.source || kundali.meta?.engine || "N/A"}</b>
        </div>

        <div style={styles.resultTile}>
          <span style={styles.label}>Calculation Time</span>
          <b>{kundali.meta?.calculation_time || kundali.metadata?.calculation_time || "N/A"}</b>
        </div>
      </div>

      <div style={styles.sadeSatiBox}>
        <h3 style={styles.sectionTitle}>🌒 Sade Sati</h3>
        <p>
          <b>Status:</b> {kundali.sade_sati?.active ? "Active" : "Not active"}
        </p>
        <p>{kundali.sade_sati?.description || "No Sade Sati details available."}</p>
      </div>

      <h3 style={styles.sectionTitle}>🪐 Planet Positions</h3>

      <div style={styles.planetGrid}>
        {Object.entries(kundali.planets || {}).map(([planet, data]) => (
          <div key={planet} style={styles.planetCard}>
            <h4>{planet}</h4>
            <p>
              Sign: <b>{data?.sign || "N/A"}</b>
            </p>
            <p>
              Degree: <b>{data?.degree ?? "N/A"}°</b>
            </p>
            <p>
              House: <b>{data?.house ?? "N/A"}</b>
            </p>
            <p>
              Retrograde: <b>{data?.retrograde ? "Yes" : "No"}</b>
            </p>
            <p>
              Nakshatra: <b>{data?.nakshatra || "N/A"}</b>
            </p>
            <p>
              Pada: <b>{data?.pada || "N/A"}</b>
            </p>
            <p>
              Nakshatra Lord: <b>{data?.nakshatra_lord || "N/A"}</b>
            </p>
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>🏠 Houses</h3>

      <div style={styles.houseGrid}>
        {Object.entries(kundali.houses || {}).map(([house, houseData]) => (
          <div key={house} style={styles.houseCard}>
            <b>{house.replace("_", " ")}</b>
            <span>{houseData?.sign || String(houseData) || "N/A"}</span>
            {houseData?.degree != null && <span>Degree: {houseData.degree}°</span>}
            {houseData?.lord && <span>Lord: {houseData.lord}</span>}
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>📈 Vimshottari Dasha</h3>

      <div style={styles.dashaGrid}>
        {(kundali.dasha || []).map((d, index) => (
          <div key={index} style={styles.dashaCard}>
            <b>{d.planet}</b>
            <span>{d.years ? `${d.years} years` : "N/A"}</span>
            {d.from && <span>From: {d.from}</span>}
            {d.to && <span>To: {d.to}</span>}
          </div>
        ))}
      </div>

      {kundali.yoga && kundali.yoga.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>🧿 Yogas</h3>
          <div style={styles.yogaGrid}>
            {kundali.yoga.map((item, idx) => (
              <div key={idx} style={styles.yogaCard}>
                <b>{item.name || item.title || `Yoga ${idx + 1}`}</b>
                <span>{item.description || item.details || item.text || "-"}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AdvancedKundaliFeatures({ kundali }) {
  const advanced = kundali?.advanced || {};

  const renderItems = (items) => {
    if (!items) return <p style={styles.proTip}>No data available.</p>;
    if (Array.isArray(items)) {
      return items.map((item, idx) => (
        <div key={idx} style={styles.advancedCard}>
          <b>{item.title || item.name || item.planet || `Item ${idx + 1}`}</b>
          <span>{item.description || item.details || item.text || JSON.stringify(item)}</span>
        </div>
      ));
    }
    if (typeof items === "object") {
      return Object.entries(items).map(([key, value]) => (
        <div key={key} style={styles.advancedCard}>
          <b>{key}</b>
          <span>{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
        </div>
      ));
    }
    return <p>{String(items)}</p>;
  };

  return (
    <div style={styles.advancedSection}>
      <h2 style={styles.sectionTitle}>🌟 Pro Advanced Astrology</h2>
      <div style={styles.advancedGrid}>
        <div style={styles.advancedBox}>
          <h3>🔮 Full Calculate</h3>
          {advanced.fullCalculate ? renderItems(advanced.fullCalculate) : <p>No full calculation details.</p>}
        </div>

        <div style={styles.advancedBox}>
          <h3>📈 Dasha Insights</h3>
          {renderItems(advanced.dashaInsights?.dasha || advanced.dashaInsights || advanced.dasha)}
        </div>

        <div style={styles.advancedBox}>
          <h3>🌌 Gochar Timeline</h3>
          {renderItems(advanced.gocharTimeline?.timeline || advanced.gocharTimeline)}
        </div>

        <div style={styles.advancedBox}>
          <h3>✨ Gochar Insights</h3>
          {renderItems(advanced.gocharInsights?.insights || advanced.gocharInsights)}
        </div>

        <div style={styles.advancedBox}>
          <h3>🧿 Yoga Detection</h3>
          {renderItems(advanced.yogas || kundali.yoga)}
        </div>

        <div style={styles.advancedBox}>
          <h3>💪 Planetary Strength</h3>
          {renderItems(advanced.strength?.strength || advanced.strength)}
        </div>

        <div style={styles.advancedBox}>
          <h3>📐 Divisional Charts</h3>
          {renderItems(advanced.divisionalCharts?.vargas || advanced.divisionalCharts)}
        </div>

        <div style={styles.advancedBox}>
          <h3>🕉️ Muhurat Search</h3>
          {renderItems(advanced.panchang || advanced.muhurat || advanced.muhuratSearch)}
        </div>

        <div style={styles.advancedBox}>
          <h3>🪄 Personalized Muhurat</h3>
          {renderItems(advanced.personalizedMuhurat || advanced.personalized_muhurat || advanced.panchang)}
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function Kundali() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    time: "",
    place: "",
    lat: "",
    lng: "",
    tz_str: "AUTO",
    ayanamsha: "lahiri",
    house_system: "whole_sign",
    node_type: "mean"
  });

  const [kundali, setKundali] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const isLoggedIn = !!user;
  const isPro = user?.plan === "pro";

  const generateKundali = async () => {
    if (!form.name || !form.dob || !form.time) {
      alert("Please fill Name, DOB, and Time.");
      return;
    }

    if ((!form.place || !form.place.trim()) && (!form.lat || !form.lng)) {
      alert("Please provide either a Place or both Latitude and Longitude.");
      return;
    }

    if ((form.lat && !form.lng) || (!form.lat && form.lng)) {
      alert("Please enter both Latitude and Longitude, or leave both blank and provide a Place.");
      return;
    }

    try {
      setLoading(true);

      let res;

      res = await getKundali(form, isPro);
      setKundali(res.data?.kundali || res.data);
    } catch (err) {
      console.error("Kundali Generate Error:", err);
      alert("Error generating kundali");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🪐 Accurate Kundali Generator</h1>

      <p style={styles.subtitle}>
        Generate a free basic Kundali. Login or upgrade to Pro for saving, PDF report, Kundali wheel, Dasha, and AI insights.
      </p>

      {!isLoggedIn && (
        <div style={styles.guestBanner}>
          <h3>✨ Guest Mode Active</h3>
          <p>
            You can generate a basic Kundali without login. Create an account to save reports and unlock Pro features.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={styles.secondaryButton}
          >
            Login / Create Account
          </button>

        </div>
      )}

      <div style={styles.form}>
        <input
          placeholder="Name"
          style={styles.input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="date"
          style={styles.input}
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

        <input
          type="time"
          style={styles.input}
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <input
          placeholder="Place"
          style={styles.input}
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
        />

        <div style={styles.rowInputs}>
          <input
            placeholder="Latitude"
            style={{ ...styles.input, flex: 1 }}
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
          />
          <input
            placeholder="Longitude"
            style={{ ...styles.input, flex: 1, marginLeft: 10 }}
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
          />
        </div>

        <input
          placeholder="Timezone (e.g. Asia/Kolkata or AUTO)"
          style={styles.input}
          value={form.tz_str}
          onChange={(e) => setForm({ ...form, tz_str: e.target.value })}
        />

        <div style={styles.rowInputs}>
          <select
            value={form.ayanamsha}
            style={{ ...styles.input, flex: 1 }}
            onChange={(e) => setForm({ ...form, ayanamsha: e.target.value })}
          >
            <option value="lahiri">Lahiri</option>
            <option value="krishna">Krishna</option>
            <option value="raman">Raman</option>
            <option value="fagan_bradley">Fagan-Bradley</option>
            <option value="delhi">Delhi</option>
          </select>

          <select
            value={form.house_system}
            style={{ ...styles.input, flex: 1, marginLeft: 10 }}
            onChange={(e) => setForm({ ...form, house_system: e.target.value })}
          >
            <option value="whole_sign">Whole Sign</option>
            <option value="placidus">Placidus</option>
            <option value="kochi">Kochi</option>
            <option value="sripathi">Sripathi</option>
            <option value="porphyry">Porphyry</option>
          </select>
        </div>

        <select
          value={form.node_type}
          style={styles.input}
          onChange={(e) => setForm({ ...form, node_type: e.target.value })}
        >
          <option value="mean">Mean Node</option>
          <option value="true">True Node</option>
        </select>

        <button onClick={generateKundali} style={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Generate Free Kundali"}
        </button>
      </div>

      {loading && <p style={styles.center}>⏳ Calculating planetary positions...</p>}

      {kundali && <BasicKundaliResult kundali={kundali} />}

      {kundali && isPro && <AdvancedKundaliFeatures kundali={kundali} />}

      {kundali && isPro && (
        <div style={styles.kundaliWrapper}>
          <div style={styles.leftPanel}>
            <div style={styles.chart}>
              {Object.keys(kundali.houses || {}).length ? (
                Object.keys(kundali.houses || {}).map((h, i) => (
                  <div key={i} style={styles.cell}>
                    <b>{h.replace("_", " ")}</b>
                    <br />
                    {String(kundali.houses[h])}
                  </div>
                ))
              ) : (
                <div style={styles.emptyChart}>House chart data will appear here.</div>
              )}
            </div>

            <TransformWrapper>
              <TransformComponent>
                <ZodiacWheel kundali={kundali} />
              </TransformComponent>
            </TransformWrapper>

            <DashaTimeline kundali={kundali} />
          </div>

          <div style={styles.rightPanel}>
            <TransitPanel />
            <HouseAIInsights kundali={kundali} />
          </div>
        </div>
      )}

      {kundali && !isPro && (
        <div style={styles.lockBox}>
          <h3>🔒 Unlock Premium Kundali</h3>
          <p>
            Get Kundali wheel, Dasha timeline, AI house insights, PDF download, and saved Kundali history.
          </p>

          <button onClick={() => (window.location.href = "/pricing")} style={styles.upgradeBtn}>
            Upgrade to Pro 🔥
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    background: "#0a0a0a",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial"
  },

  title: {
    textAlign: "center",
    color: "#D4AF37",
    fontSize: 34
  },

  subtitle: {
    textAlign: "center",
    opacity: 0.75,
    maxWidth: 760,
    margin: "0 auto 25px"
  },

  guestBanner: {
    maxWidth: 700,
    margin: "20px auto",
    padding: 18,
    background: "#111",
    border: "1px solid #D4AF37",
    borderRadius: 12,
    textAlign: "center"
  },

  secondaryButton: {
    padding: "10px 14px",
    background: "#222",
    color: "white",
    border: "1px solid #D4AF37",
    borderRadius: 8,
    cursor: "pointer"
  },

  form: {
    display: "grid",
    gap: 12,
    maxWidth: 420,
    margin: "20px auto",
    background: "#111",
    padding: 20,
    borderRadius: 14,
    border: "1px solid #333"
  },

  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "white"
  },

  rowInputs: {
    display: "flex",
    gap: 10,
    alignItems: "center"
  },

  button: {
    padding: "12px 15px",
    background: "#D4AF37",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    color: "black"
  },

  center: {
    textAlign: "center"
  },

  basicResult: {
    maxWidth: 1000,
    margin: "20px auto",
    background: "#111",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #333"
  },

  sadeSatiBox: {
    marginTop: 20,
    padding: 14,
    background: "#141414",
    border: "1px solid #333",
    borderRadius: 10
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 20
  },

  resultTile: {
    background: "#1a1a1a",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #333"
  },

  label: {
    display: "block",
    fontSize: 12,
    opacity: 0.65,
    marginBottom: 6
  },

  sectionTitle: {
    color: "#D4AF37",
    marginTop: 28
  },

  planetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12
  },

  planetCard: {
    background: "#151515",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #333"
  },

  houseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10
  },

  houseCard: {
    background: "#151515",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    textAlign: "center"
  },

  dashaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10
  },

  dashaCard: {
    background: "#151515",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    textAlign: "center"
  },

  kundaliWrapper: {
    display: "flex",
    gap: 30,
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 30
  },

  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },

  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    maxWidth: 360
  },

  chart: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 100px)",
    gap: 5,
    justifyContent: "center"
  },

  emptyChart: {
    gridColumn: "1 / -1",
    background: "#1e1e1e",
    padding: 15,
    borderRadius: 8,
    textAlign: "center",
    border: "1px solid #333"
  },

  cell: {
    background: "#1e1e1e",
    padding: 10,
    textAlign: "center",
    borderRadius: 8,
    border: "1px solid #333"
  },

  card: {
    background: "#111",
    padding: 15,
    borderRadius: 12,
    border: "1px solid #333"
  },

  goldCenter: {
    color: "#D4AF37",
    textAlign: "center"
  },

  svgWheel: {
    display: "block",
    margin: "0 auto",
    background: "#050505",
    borderRadius: "50%"
  },

  lockBox: {
    maxWidth: 680,
    margin: "30px auto",
    padding: 20,
    border: "1px solid #D4AF37",
    borderRadius: 12,
    background: "#111",
    textAlign: "center"
  },
  debugControls: {
    maxWidth: 1000,
    margin: "12px auto",
    textAlign: "center"
  },
  debugPanel: {
    maxWidth: 1000,
    margin: "12px auto",
    background: "#050505",
    border: "1px solid #333",
    borderRadius: 12,
    padding: 16,
    fontSize: 12,
    lineHeight: 1.4,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  yogaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16
  },
  yogaCard: {
    background: "#151515",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #333"
  },

  advancedSection: {
    maxWidth: 1000,
    margin: "20px auto",
    background: "#111",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #333"
  },
  advancedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    marginTop: 18
  },
  advancedBox: {
    background: "#141414",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #333",
    minHeight: 120
  },
  advancedCard: {
    background: "#1b1b1b",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #2c2c2c",
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  proTip: {
    color: "#bbb",
    fontSize: 14
  },

  upgradeBtn: {
    marginTop: 10,
    padding: "12px 15px",
    background: "#D4AF37",
    color: "black",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold"
  }
};