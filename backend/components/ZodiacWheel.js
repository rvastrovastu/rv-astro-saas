import React from "react";

export default function ZodiacWheel({ kundali }) {
  // 🧿 SAFE GUARD (CRITICAL FIX)
  if (!kundali?.houses || !kundali?.planets) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        Loading Kundali Wheel...
      </div>
    );
  }

  const size = 420;
  const center = size / 2;
  const radius = 140;

  const houses = Object.keys(kundali.houses || {});
  const planets = kundali.planets || {};

  const zodiac = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

  const planetSymbols = {
    Sun: "☉",
    Moon: "☽",
    Mars: "♂",
    Mercury: "☿",
    Jupiter: "♃",
    Venus: "♀",
    Saturn: "♄"
  };

  const degToRad = (deg) => (deg - 90) * (Math.PI / 180);

  const getXY = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  return (
    <div style={{ background: "#111", padding: 20, borderRadius: 12 }}>
      <h3 style={{ color: "#D4AF37", textAlign: "center" }}>
        🪐 ISRO Kundali Wheel
      </h3>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

        {/* OUTER CIRCLE */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
        />

        {/* INNER CIRCLE */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.6}
          stroke="#333"
          strokeWidth="1"
          fill="none"
        />

        {/* HOUSE LINES */}
        {houses.map((_, i) => {
          const angle = degToRad(i * 30);
          const pos = getXY(angle, radius);

          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={pos.x}
              y2={pos.y}
              stroke="#333"
            />
          );
        })}

        {/* ZODIAC RING */}
        {zodiac.map((sign, i) => {
          const angle = degToRad(i * 30 + 15);
          const pos = getXY(angle, radius + 18);

          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              fontSize="14"
              fill="#fff"
              textAnchor="middle"
            >
              {sign}
            </text>
          );
        })}

        {/* HOUSE NUMBERS */}
        {houses.map((_, i) => {
          const angle = degToRad(i * 30 + 15);
          const pos = getXY(angle, radius - 18);

          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              fill="#888"
              fontSize="10"
              textAnchor="middle"
            >
              {i + 1}
            </text>
          );
        })}

        {/* PLANETS */}
        {Object.entries(planets).map(([planet, value], i) => {
          const degree =
            typeof value === "object" && value.degree !== undefined
              ? value.degree
              : (i * 30) % 360;

          const angle = degToRad(degree);
          const pos = getXY(angle, radius * 0.45);

          return (
            <g key={planet}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={10}
                fill="#1e1e1e"
                stroke="#D4AF37"
              />
              <text
                x={pos.x}
                y={pos.y + 3}
                fill="#D4AF37"
                fontSize="10"
                textAnchor="middle"
              >
                {planetSymbols[planet] || planet[0]}
              </text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}