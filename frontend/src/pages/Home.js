import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.PNG";

export default function Home() {
  const navigate = useNavigate();

  const tools = [
    {
      icon: "🪐",
      title: "Kundali",
      desc: "Generate accurate birth chart with planetary positions.",
      path: "/kundali"
    },
    {
      icon: "💞",
      title: "Match Making",
      desc: "Boy & Girl kundali matching with Guna Milan.",
      path: "/match-making"
    },
    {
      icon: "🤖",
      title: "AI Astrology",
      desc: "Ask AI about career, marriage, finance & remedies.",
      path: "/ai-astrology",
      badge: "PRO"
    },
    {
      icon: "📅",
      title: "Panchang",
      desc: "Daily Panchang, Tithi, Nakshatra & Muhurat.",
      path: "/panchang"
    },
    {
      icon: "📞",
      title: "Consultation",
      desc: "Talk to expert astrologers for guidance.",
      path: "/booking"
    }
  ];

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.brandBox}>
          <img src={logo} alt="RV Astro Vastu" style={styles.navLogo} />
          <h2 style={styles.brand}>RV ASTRO VASTU</h2>
        </div>

        <div style={styles.navLinks}>
          <Link style={styles.navLink} to="/">Home</Link>
          <Link style={styles.navLink} to="/kundali">Kundali</Link>
          <Link style={styles.navLink} to="/match-making">Match Making</Link>
          <Link style={styles.navLink} to="/ai-astrology">AI Astrology</Link>
          <Link style={styles.navLink} to="/panchang">Panchang</Link>
          <Link style={styles.navLink} to="/pricing">Pricing</Link>
        </div>

        <button onClick={() => navigate("/dashboard")} style={styles.dashboardBtn}>
          👤 Dashboard
        </button>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.kicker}>VEDIC WISDOM • AI INSIGHTS • ACCURATE PREDICTIONS</p>

          <h1 style={styles.heroTitle}>
            Discover Your Destiny <br />
            <span>with RV Astro Vastu</span>
          </h1>

          <p style={styles.heroDesc}>
            Accurate Kundali, Match Making, AI Astrology, Panchang, Muhurat
            and Vastu guidance — all in one premium platform.
          </p>

          <div style={styles.heroButtons}>
            <button onClick={() => navigate("/kundali")} style={styles.primaryBtn}>
              🪐 Generate Kundali
            </button>

            <button onClick={() => navigate("/match-making")} style={styles.outlineBtn}>
              💞 Match Making
            </button>

            <button onClick={() => navigate("/pricing")} style={styles.proBtn}>
              🔥 Upgrade Pro
            </button>
          </div>

          <div style={styles.trustRow}>
            <span>🛡️ 100% Secure</span>
            <span>✨ AI Powered</span>
            <span>🔒 Private</span>
            <span>🕉️ Vedic</span>
          </div>
        </div>

        <div style={styles.heroImageBox}>
          <img src={logo} alt="RV Astro Vastu Logo" style={styles.heroLogo} />
        </div>
      </section>

      {/* TOOLS */}
      <section style={styles.toolsSection}>
        <h3 style={styles.sectionKicker}>EXPLORE OUR ASTROLOGY TOOLS</h3>

        <div style={styles.toolsGrid}>
          {tools.map((tool) => (
            <div
              key={tool.title}
              style={styles.toolCard}
              onClick={() => navigate(tool.path)}
            >
              {tool.badge && <span style={styles.badge}>{tool.badge}</span>}
              <div style={styles.toolIcon}>{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <span style={styles.arrow}>→</span>
            </div>
          ))}

          <a
            href="https://wa.me/1234567890?text=Hi%20I%20need%20astro%20consultation"
            target="_blank"
            rel="noreferrer"
            style={styles.toolCard}
          >
            <div style={styles.toolIcon}>💬</div>
            <h3>WhatsApp</h3>
            <p>Chat with us for quick astrology assistance.</p>
            <span style={styles.arrow}>→</span>
          </a>
        </div>
      </section>

      {/* PRO CTA */}
      <section style={styles.proSection}>
        <div>
          <h2>👑 RV ASTRO VASTU PRO</h2>
          <p>
            Unlock unlimited Kundali, advanced matchmaking, AI astrology,
            PDF reports, saved history and more.
          </p>
        </div>

        <div style={styles.price}>
          <span>$9.99</span>
          <small>/month</small>
        </div>

        <button onClick={() => navigate("/pricing")} style={styles.primaryBtn}>
          View Pricing Plans
        </button>
      </section>

      {/* STATS */}
      <section style={styles.stats}>
        <div><h2>10K+</h2><p>Happy Users</p></div>
        <div><h2>50K+</h2><p>Kundalis Generated</p></div>
        <div><h2>99.9%</h2><p>Accuracy</p></div>
        <div><h2>4.9/5</h2><p>User Rating</p></div>
      </section>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} RV Astro Vastu. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 70% 20%, rgba(212,175,55,0.18), transparent 30%), #050505",
    color: "white",
    fontFamily: "Arial",
    overflowX: "hidden"
  },

  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 48px",
    borderBottom: "1px solid rgba(212,175,55,0.35)",
    background: "rgba(0,0,0,0.75)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(12px)"
  },

  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },

  navLogo: {
    width: 54,
    height: 54,
    borderRadius: "50%"
  },

  brand: {
    color: "#D4AF37",
    margin: 0,
    letterSpacing: 1
  },

  navLinks: {
    display: "flex",
    gap: 26,
    flexWrap: "wrap"
  },

  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500"
  },

  dashboardBtn: {
    padding: "11px 18px",
    background: "transparent",
    color: "#D4AF37",
    border: "1px solid #D4AF37",
    borderRadius: 9,
    cursor: "pointer",
    fontWeight: "bold"
  },

  hero: {
    maxWidth: 1350,
    margin: "0 auto",
    padding: "70px 48px 40px",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 50,
    alignItems: "center"
  },

  kicker: {
    color: "#D4AF37",
    letterSpacing: 1,
    fontSize: 14
  },

  heroTitle: {
    fontSize: 56,
    lineHeight: 1.12,
    margin: "16px 0",
    color: "white"
  },

  heroTitleSpan: {},

  heroDesc: {
    fontSize: 19,
    lineHeight: 1.7,
    opacity: 0.88,
    maxWidth: 620
  },

  heroButtons: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    marginTop: 30
  },

  primaryBtn: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #D4AF37, #ffd66b)",
    color: "black",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 15
  },

  outlineBtn: {
    padding: "14px 24px",
    background: "transparent",
    color: "white", 
    border: "1px solid #D4AF37",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },

  proBtn: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #3a174d, #7b2cbf)",
    color: "white",
    border: "1px solid #D4AF37",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },

  trustRow: {
    marginTop: 34,
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
    background: "rgba(17,17,17,0.75)",
    padding: 18,
    borderRadius: 14,
    border: "1px solid rgba(212,175,55,0.25)"
  },

  heroImageBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  heroLogo: {
    width: "100%",
    maxWidth: 470,
    borderRadius: "50%",
    filter: "drop-shadow(0 0 45px rgba(212,175,55,0.6))"
  },

  toolsSection: {
    maxWidth: 1350,
    margin: "20px auto",
    padding: "24px 36px",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: 18,
    background: "rgba(10,10,10,0.85)"
  },

  sectionKicker: {
    color: "#D4AF37",
    letterSpacing: 1.5,
    marginLeft: 6
  },

  toolsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 18
  },

  toolCard: {
    position: "relative",
    minHeight: 165,
    padding: 20,
    background: "linear-gradient(180deg, #111, #080808)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 14,
    color: "white",
    textDecoration: "none",
    cursor: "pointer"
  },

  toolIcon: {
    fontSize: 34
  },

  badge: {
    position: "absolute",
    right: 14,
    top: 14,
    background: "#D4AF37",
    color: "black",
    fontSize: 11,
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: 20
  },

  arrow: {
    position: "absolute",
    right: 18,
    bottom: 14,
    color: "#D4AF37",
    fontSize: 24
  },

  proSection: {
    maxWidth: 1050,
    margin: "28px auto",
    padding: 26,
    borderRadius: 18,
    border: "1px solid rgba(212,175,55,0.45)",
    background: "linear-gradient(135deg, rgba(212,175,55,0.12), #090909)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap"
  },

  price: {
    color: "#D4AF37"
  },

  stats: {
    maxWidth: 900,
    margin: "30px auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 16,
    textAlign: "center",
    color: "#D4AF37"
  },

  footer: {
    borderTop: "1px solid rgba(212,175,55,0.35)",
    textAlign: "center",
    padding: 24,
    opacity: 0.7
  }
};