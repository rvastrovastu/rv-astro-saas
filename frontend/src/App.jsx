import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Kundali from "./pages/Kundali";
import MatchMaking from "./pages/MatchMaking";
import AIAstrology from "./pages/AIAstrology";
import Panchang from "./pages/Panchang";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BackHomeButton from "./components/BackHomeButton";
import BirthChart from "./pages/BirthChart";
import DailyHoroscope from "./pages/DailyHoroscope";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <HashRouter>
      <div style={{ fontFamily: "Arial" }}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />

          <Route path="/kundali" element={<Kundali />} />
          <Route path="/birth-chart" element={<BirthChart />} />
          <Route path="/match-making" element={<MatchMaking />} />
          <Route path="/daily-horoscope" element={<DailyHoroscope />} />
          <Route path="/panchang" element={<Panchang />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* LOGIN REQUIRED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

         {/* <Route
            path="/match-making"
            element={
              <ProtectedRoute>
                <MatchMaking />
              </ProtectedRoute>
            }
          /> */}

          {/* PRO ONLY */}
         
           <Route
            path="/ai-astrology"
            element={
              <ProtectedRoute proOnly={true}>
                <AIAstrology />
              </ProtectedRoute>
            }
          /> 

         {/*} <Route path="/ai-astrology" element={<AIAstrology />} /> */}

          {/* FALLBACK MUST BE LAST */}
          <Route path="*" element={<Home />} />
        </Routes>

        {/* FLOATING WHATSAPP BUTTON */}
        <a
          href="https://wa.me/15137650184?text=Hi%20I%20need%20astro%20consultation"
          target="_blank"
          rel="noreferrer"
          style={{
            position: "fixed",
            bottom: isSmallScreen ? 80 : 20,
            right: isSmallScreen ? 12 : 20,
            background: "green",
            padding: isSmallScreen ? 12 : 15,
            borderRadius: 50,
            color: "white",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isSmallScreen ? 14 : 18,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            width: isSmallScreen ? 44 : 50,
            height: isSmallScreen ? 44 : 50
          }}
          title="Chat with us on WhatsApp"
        >
          {isSmallScreen ? "💬" : "💬 WhatsApp"}
        </a>
      </div>
      {/* GLOBAL BACK HOME BUTTON (bottom center) */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: isSmallScreen ? 12 : 18,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <BackHomeButton
          style={{
            padding: isSmallScreen ? "8px 12px" : "10px 18px",
            fontSize: isSmallScreen ? 12 : 14,
            borderRadius: 22
          }}
        />
      </div>
    </HashRouter>
  );
}

export default App;