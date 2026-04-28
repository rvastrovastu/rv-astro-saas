import { useEffect, useState } from "react";
import axios from "axios";

export default function HouseAIInsights({ kundali }) {

  const [insight, setInsight] = useState("");

  useEffect(() => {
    fetchInsight();
  }, []);

  const fetchInsight = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: "Explain my kundali house strengths and weaknesses",
        userDetails: kundali.native
      });

      setInsight(res.data.reply);
    } catch {
      setInsight("AI insight unavailable");
    }
  };

  return (
    <div style={styles.box}>
      <h3>📊 AI Insights</h3>
      <p>{insight}</p>
    </div>
  );
}

const styles = {
  box: {
    background: "#111",
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  }
};