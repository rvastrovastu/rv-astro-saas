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
        ...style
      }}
    >
      ← Back Home
    </button>
  );
}
