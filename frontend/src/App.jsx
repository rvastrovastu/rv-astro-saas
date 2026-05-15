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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <div style={{ fontFamily: "Arial" }}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />

          <Route path="/kundali" element={<Kundali />} />
          <Route path="/match-making" element={<MatchMaking />} />
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
          href="https://wa.me/1234567890?text=Hi%20I%20need%20astro%20consultation"
          target="_blank"
          rel="noreferrer"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "green",
            padding: 15,
            borderRadius: 50,
            color: "white",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          💬 WhatsApp
        </a>
      </div>
    </HashRouter>
  );
}

export default App;