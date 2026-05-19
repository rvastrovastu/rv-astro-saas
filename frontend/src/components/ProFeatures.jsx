import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProFeatures({ kundali, onPdfDownload }) {
  const user = getUser();
  const navigate = useNavigate();
  const isPro = user?.plan === "pro";

  const [showKundaliWheel, setShowKundaliWheel] = useState(false);
  const [showDashaTimeline, setShowDashaTimeline] = useState(false);
  const [showHouseInsights, setShowHouseInsights] = useState(false);

  if (!kundali) {
    return null;
  }

  if (!isPro) {
    return (
      <div style={styles.lockBox}>
        <h3 style={{ margin: "0 0 12px", color: "#D4AF37" }}>🔒 Pro Features Locked</h3>
        <p style={{ margin: "0 0 16px", opacity: 0.8 }}>
          Unlock Kundali Wheel, Dasha Timeline, AI House Insights, PDF Download, and Saved History
        </p>
        <button onClick={() => navigate("/pricing")} style={styles.upgradeBtn}>
          ⭐ Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div style={styles.proContainer}>
      <h2 style={styles.proTitle}>✨ Pro Features</h2>

      {/* KUNDALI WHEEL */}
      <div style={styles.featureBox}>
        <button
          onClick={() => setShowKundaliWheel(!showKundaliWheel)}
          style={styles.featureBtn}
        >
          {showKundaliWheel ? "▼" : "▶"} 🪐 Kundali Wheel
        </button>
        {showKundaliWheel && (
          <div style={styles.featureContent}>
            <div style={styles.wheelContainer}>
              <KundaliWheelSVG kundali={kundali} />
            </div>
            <p style={styles.featureDesc}>
              Visual representation of your birth chart with all planetary positions and houses.
            </p>
          </div>
        )}
      </div>

      {/* DASHA TIMELINE */}
      <div style={styles.featureBox}>
        <button
          onClick={() => setShowDashaTimeline(!showDashaTimeline)}
          style={styles.featureBtn}
        >
          {showDashaTimeline ? "▼" : "▶"} 📊 Dasha Timeline
        </button>
        {showDashaTimeline && (
          <div style={styles.featureContent}>
            <DashaTimeline kundali={kundali} />
          </div>
        )}
      </div>

      {/* AI HOUSE INSIGHTS */}
      <div style={styles.featureBox}>
        <button
          onClick={() => setShowHouseInsights(!showHouseInsights)}
          style={styles.featureBtn}
        >
          {showHouseInsights ? "▼" : "▶"} 🏠 House Insights (AI)
        </button>
        {showHouseInsights && (
          <div style={styles.featureContent}>
            <HouseInsights kundali={kundali} />
          </div>
        )}
      </div>

      {/* PDF DOWNLOAD */}
      <div style={styles.featureBox}>
        <button onClick={onPdfDownload} style={styles.featureBtn}>
          📥 Download as PDF
        </button>
      </div>

      {/* SAVED HISTORY */}
      <div style={styles.featureBox}>
        <h3 style={styles.featureTitle}>💾 Saved Kundali History</h3>
        <p style={styles.featureDesc}>Your kundalis are automatically saved to your dashboard.</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.viewHistoryBtn}
        >
          View Saved Kundalis
        </button>
      </div>
    </div>
  );
}

function KundaliWheelSVG({ kundali }) {
  const size = 300;
  const center = size / 2;
  const radius = 100;

  const planets = kundali?.planets || {};
  const zodiac = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  const degToRad = (deg) => (deg - 90) * (Math.PI / 180);
  const getXY = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
      <circle cx={center} cy={center} r={radius} stroke="#D4AF37" strokeWidth="2" fill="none" />
      <circle cx={center} cy={center} r={radius * 0.6} stroke="#444" strokeWidth="1" fill="none" />

      {zodiac.map((sign, i) => {
        const angle = degToRad(i * 30 + 15);
        const pos = getXY(angle, radius + 20);
        return (
          <text key={i} x={pos.x} y={pos.y} fill="#FFD700" fontSize="14" textAnchor="middle" fontWeight="bold">
            {sign}
          </text>
        );
      })}

      {Object.entries(planets).map(([planet, value], i) => {
        const degree = typeof value === "object" && value?.degree !== undefined ? Number(value.degree) : i * 30;
        const angle = degToRad(degree);
        const pos = getXY(angle, radius * 0.5);

        return (
          <g key={planet}>
            <circle cx={pos.x} cy={pos.y} r="8" fill="#1e1e1e" stroke="#D4AF37" strokeWidth="2" />
            <text x={pos.x} y={pos.y + 3} fill="#D4AF37" fontSize="8" textAnchor="middle" fontWeight="bold">
              {planet?.[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DashaTimeline({ kundali }) {
  const dasha = kundali?.dasha || [];

  if (!dasha.length) {
    return <p style={styles.emptyMsg}>No Dasha data available. This will be auto-calculated for Pro members.</p>;
  }

  return (
    <div style={styles.dashaList}>
      {dasha.map((d, i) => (
        <div key={i} style={styles.dashaItem}>
          <strong>{d.planet || `Period ${i + 1}`}</strong>
          <span>{d.years ? `${d.years} years` : "Duration TBD"}</span>
        </div>
      ))}
    </div>
  );
}

function HouseInsights({ kundali }) {
  const houses = kundali?.houses || {};
  const planets = kundali?.planets || {};

  // Simple AI-generated insights based on house positions
  const insights = [];

  Object.entries(houses).forEach(([houseNum, houseData]) => {
    const sign = houseData?.sign || houseData?.zodiac || "Unknown";
    const ruler = houseData?.ruler || "—";

    if (houseNum === "1" || houseNum === "1st") {
      insights.push({
        house: "1st House (Self)",
        sign,
        ruler,
        meaning: "Represents your personality, appearance, and life direction"
      });
    } else if (houseNum === "2" || houseNum === "2nd") {
      insights.push({
        house: "2nd House (Wealth)",
        sign,
        ruler,
        meaning: "Governs finances, speech, and family values"
      });
    } else if (houseNum === "7" || houseNum === "7th") {
      insights.push({
        house: "7th House (Marriage)",
        sign,
        ruler,
        meaning: "Indicates partnerships, marriage, and relationships"
      });
    }
  });

  if (!insights.length) {
    return <p style={styles.emptyMsg}>House data not available yet. Try generating a detailed Kundali.</p>;
  }

  return (
    <div style={styles.insightsList}>
      {insights.map((insight, i) => (
        <div key={i} style={styles.insightItem}>
          <h4 style={{ margin: "0 0 8px", color: "#D4AF37" }}>{insight.house}</h4>
          <p style={{ margin: "0 0 6px", fontSize: 13 }}>
            <strong>Sign:</strong> {insight.sign}
          </p>
          <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.8 }}>{insight.meaning}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  proContainer: {
    maxWidth: 1000,
    margin: "30px auto",
    background: "linear-gradient(135deg, rgba(212,175,55,0.1), #111)",
    border: "1px solid #D4AF37",
    borderRadius: 16,
    padding: 24
  },

  proTitle: {
    textAlign: "center",
    color: "#D4AF37",
    margin: "0 0 24px",
    fontSize: 28
  },

  featureBox: {
    marginBottom: 18,
    background: "#0a0a0a",
    border: "1px solid #333",
    borderRadius: 12,
    overflow: "hidden"
  },

  featureBtn: {
    width: "100%",
    padding: 16,
    background: "#111",
    color: "#D4AF37",
    border: "none",
    borderBottom: "1px solid #333",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    textAlign: "left",
    transition: "all 0.3s ease"
  },

  featureContent: {
    padding: 16
  },

  featureTitle: {
    margin: "0 0 12px",
    color: "#D4AF37",
    fontSize: 18
  },

  featureDesc: {
    margin: 0,
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 1.6
  },

  wheelContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0"
  },

  svg: {
    display: "block",
    background: "#050505",
    borderRadius: "50%"
  },

  dashaList: {
    display: "grid",
    gap: 10
  },

  dashaItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    background: "#1a1a1a",
    borderRadius: 8,
    borderLeft: "3px solid #D4AF37"
  },

  insightsList: {
    display: "grid",
    gap: 12
  },

  insightItem: {
    padding: 14,
    background: "#1a1a1a",
    borderRadius: 8,
    borderLeft: "3px solid #D4AF37"
  },

  emptyMsg: {
    color: "#999",
    fontSize: 14,
    margin: 0
  },

  lockBox: {
    maxWidth: 600,
    margin: "30px auto",
    padding: 24,
    background: "linear-gradient(135deg, rgba(212,175,55,0.15), #111)",
    border: "2px solid #D4AF37",
    borderRadius: 14,
    textAlign: "center"
  },

  upgradeBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #D4AF37, #ffd66b)",
    color: "black",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16
  },

  viewHistoryBtn: {
    padding: "10px 16px",
    background: "transparent",
    color: "#D4AF37",
    border: "1px solid #D4AF37",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 8
  }
};

// Mobile responsive adjustments
if (typeof window !== "undefined" && window.innerWidth < 768) {
  styles.proContainer = {
    ...styles.proContainer,
    maxWidth: "100%",
    margin: "20px auto",
    padding: 12
  };

  styles.proTitle = {
    ...styles.proTitle,
    fontSize: 20
  };

  styles.wheelContainer = {
    ...styles.wheelContainer,
    display: "flex",
    justifyContent: "center",
    marginTop: 12,
    maxHeight: 300,
    overflow: "auto"
  };

  styles.featureBtn = {
    ...styles.featureBtn,
    fontSize: 14,
    padding: 12
  };
}
