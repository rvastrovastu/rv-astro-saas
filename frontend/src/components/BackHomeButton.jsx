import { useNavigate } from "react-router-dom";

export default function BackHomeButton({ style }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      style={{
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid #333",
        background: "#222",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
        marginBottom: 20,
        fontSize: 14,
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
        ...style
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#D4AF37";
        e.target.style.color = "black";
        e.target.style.borderColor = "#D4AF37";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#222";
        e.target.style.color = "white";
        e.target.style.borderColor = "#333";
      }}
    >
      ← Back Home
    </button>
  );
}
