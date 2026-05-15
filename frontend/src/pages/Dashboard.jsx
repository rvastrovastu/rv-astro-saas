import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { getUser, logout } from "../utils/auth";
import BackHomeButton from "../components/BackHomeButton";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [kundalis, setKundalis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.search.includes("payment=success")) {
      alert("Payment successful! Your Pro access may take a few seconds to activate.");
    }

    refreshSubscription();
    fetchKundalis();
  }, []);

  const refreshSubscription = async () => {
    try {
      const res = await API.get("/stripe/me/subscription");

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Subscription refresh failed:", err);
    }
  };

  const fetchKundalis = async () => {
    try {
      setLoading(true);

      const res = await API.get("/kundali/my");

      setKundalis(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch kundalis:", err);
      alert(err?.response?.data?.message || "Failed to load saved kundalis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 My Dashboard</h1>
      <BackHomeButton />

      <div style={styles.card}>
        <h2>Welcome, {user?.name || "RV Astro User"}</h2>
        <p>Email: {user?.email || "Not available"}</p>
        <p>
          Plan: <b>{user?.plan || "free"}</b>
        </p>
      </div>

      <div style={styles.grid}>
        <button onClick={() => navigate("/kundali")} style={styles.btn}>
          🪐 Generate Kundali
        </button>

        <button onClick={() => navigate("/match-making")} style={styles.btn}>
          💞 Match Making
        </button>

        <button onClick={() => navigate("/ai-astrology")} style={styles.btn}>
          🤖 AI Astrology
        </button>

        <button onClick={() => navigate("/panchang")} style={styles.btn}>
          📅 Panchang
        </button>
      </div>

      <div style={styles.card}>
        <h2>🪐 My Saved Kundalis</h2>

        {loading && <p>Loading kundalis...</p>}

        {!loading && kundalis.length === 0 && (
          <div style={styles.emptyBox}>
            <p>No kundalis found.</p>
            <button onClick={() => navigate("/kundali")} style={styles.smallBtn}>
              Generate Your First Kundali
            </button>
          </div>
        )}

        {!loading &&
          kundalis.map((k) => (
            <div key={k._id || k.id || k.name} style={styles.kundaliItem}>
              <div>
                <h3>{k.name || k.native?.name || "Unnamed Kundali"}</h3>
                <p>DOB: {k.dob || k.native?.dob || "N/A"}</p>
                <p>Place: {k.place || k.native?.place || "N/A"}</p>
              </div>

              <button
                onClick={() => navigate("/kundali")}
                style={styles.smallBtn}
              >
                View / Generate
              </button>
            </div>
          ))}
      </div>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
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
    textAlign: "center"
  },

  card: {
    maxWidth: 760,
    margin: "20px auto",
    background: "#111",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #333"
  },

  grid: {
    maxWidth: 760,
    margin: "20px auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 15
  },

  btn: {
    padding: 18,
    background: "#111",
    color: "white",
    border: "1px solid #D4AF37",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold"
  },

  emptyBox: {
    background: "#0d0d0d",
    border: "1px solid #333",
    borderRadius: 10,
    padding: 15,
    textAlign: "center"
  },

  kundaliItem: {
    background: "#0d0d0d",
    border: "1px solid #333",
    borderRadius: 10,
    padding: 15,
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 15,
    alignItems: "center",
    flexWrap: "wrap"
  },

  smallBtn: {
    padding: "10px 14px",
    background: "#D4AF37",
    color: "black",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer"
  },

  logout: {
    display: "block",
    margin: "30px auto",
    padding: "12px 20px",
    background: "#D4AF37",
    color: "black",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
  }
};