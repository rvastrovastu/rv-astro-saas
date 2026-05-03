import React from "react";

export default function Booking() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "white" }}>

      <h1 style={{ textAlign: "center", paddingTop: "20px", color: "#D4AF37" }}>
        📅 Book Your Astrology Consultation
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>

        <iframe
           title="RV Astro Vastu Consultation Booking"
          src="https://calendly.com/rvastrovastu/consultation"
          width="100%"
          height="700"
          style={{ border: "none" }}
          }     
        ></iframe>

      </div>

    </div>
  );
}