import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Pricing() {
  const navigate = useNavigate();

  const upgradeToPro = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.post("/stripe/create-checkout-session");

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert("Stripe checkout URL not received");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to start checkout");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔥 Pricing Plans</h1>

      <div style={styles.card}>
        <h2>Free</h2>
        <p>Basic Kundali + Limited Matches</p>
        <h3>$0</h3>

        <button onClick={() => navigate("/kundali")} style={styles.secondaryBtn}>
          Start Free
        </button>
      </div>

      <div style={{ ...styles.card, border: "2px solid #D4AF37" }}>
        <h2>Pro 🔥</h2>
        <p>Unlimited Kundali + Advanced Matching + AI + PDF Reports</p>
        <h3>$9.99/month</h3>

        <button onClick={upgradeToPro} style={styles.btn}>
          Upgrade with Stripe
        </button>
      </div>

      <button onClick={() => navigate("/")} style={styles.backBtn}>
        Back Home
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
    fontFamily: "Arial",
    textAlign: "center"
  },

  title: {
    color: "#D4AF37"
  },

  card: {
    maxWidth: 420,
    margin: "20px auto",
    background: "#111",
    padding: 24,
    borderRadius: 14,
    border: "1px solid #333"
  },

  btn: {
    padding: "12px 18px",
    background: "#D4AF37",
    color: "black",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "12px 18px",
    background: "transparent",
    color: "#D4AF37",
    border: "1px solid #D4AF37",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
  },

  backBtn: {
    marginTop: 20,
    padding: "10px 16px",
    background: "#222",
    color: "white",
    border: "1px solid #333",
    borderRadius: 10,
    cursor: "pointer"
  }
};

// Mobile responsive adjustments
if (typeof window !== "undefined" && window.innerWidth < 768) {
  styles.container = {
    ...styles.container,
    padding: 14
  };

  styles.card = {
    ...styles.card,
    margin: "14px auto",
    padding: 18
  };

  styles.btn = {
    ...styles.btn,
    width: "100%",
    padding: "14px 18px"
  };

  styles.secondaryBtn = {
    ...styles.secondaryBtn,
    width: "100%",
    padding: "14px 18px"
  };

  styles.backBtn = {
    ...styles.backBtn,
    width: "100%"
  };
}