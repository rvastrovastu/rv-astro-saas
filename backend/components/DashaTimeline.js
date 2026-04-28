export default function DashaTimeline({ kundali }) {

  const dashas = [
    { planet: "Sun", years: 6 },
    { planet: "Moon", years: 10 },
    { planet: "Mars", years: 7 },
    { planet: "Rahu", years: 18 },
    { planet: "Jupiter", years: 16 },
    { planet: "Saturn", years: 19 }
  ];

  return (
    <div style={styles.container}>
      <h3>📈 Dasha Timeline</h3>

      <div style={styles.timeline}>
        {dashas.map((d, i) => (
          <div
            key={i}
            style={{
              ...styles.block,
              width: d.years * 10
            }}
          >
            {d.planet}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { marginTop: 20 },
  timeline: { display: "flex", gap: 5 },
  block: {
    background: "#D4AF37",
    color: "#000",
    padding: 5,
    borderRadius: 5,
    fontSize: 12
  }
};