import React from "react";

export default function Booking() {
  const containerStyle = {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white",
    paddingBottom: "40px"
  };

  const titleStyle = {
    textAlign: "center",
    paddingTop: "20px",
    color: "#D4AF37"
  };

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    padding: "0 10px"
  };

  const iframeStyle = {
    border: "none",
    maxWidth: "900px",
    borderRadius: "12px",
    width: "100%",
    height: "700px"
  };

  // Mobile responsive adjustments
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    titleStyle.fontSize = "24px";
    titleStyle.paddingTop = "16px";
    wrapperStyle.marginTop = "16px";
    wrapperStyle.padding = "0 8px";
    iframeStyle.height = "500px";
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        📅 Book Your Astrology Consultation
      </h1>

      <div style={wrapperStyle}>
        <iframe
          title="RV Astro Vastu Consultation Booking"
          src="https://calendly.com/rvastrovastu/vastu-consultancy?hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=d4af37"
          style={iframeStyle}
          allowFullScreen
        />
      </div>
    </div>
  );
}
