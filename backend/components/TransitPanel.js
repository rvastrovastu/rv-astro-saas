export default function TransitPanel({ kundali }) {

  return (
    <div style={styles.box}>
      <h3>🎯 Current Transits</h3>

      <p>🪐 Saturn influencing career stability</p>
      <p>💫 Jupiter bringing growth opportunities</p>
      <p>⚡ Mars increasing energy & aggression</p>

    </div>
  );
}

const styles = {
  box: {
    background: "#111",
    padding: 15,
    borderRadius: 10
  }
};