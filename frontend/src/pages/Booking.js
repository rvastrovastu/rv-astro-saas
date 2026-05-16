import React from "react";

export default function Booking() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "40px"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          paddingTop: "20px",
          color: "#D4AF37"
        }}
      >
        📅 Book Your Astrology Consultation
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          padding: "0 10px"
        }}
      >
        <iframe
          title="RV Astro Vastu Consultation Booking"
          src="https://calendly.com/rvastrovastu/vastu-consultancy"
          width="100%"
          height="700"
          style={{
            border: "none",
            maxWidth: "900px",
            borderRadius: "12px"
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
