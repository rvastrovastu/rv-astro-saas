import { useState } from "react";
import API from "../utils/api";
import BackHomeButton from "../components/BackHomeButton";

export default function BirthChart() {
  const [form, setForm] = useState({
    name: "",
    dob: new Date().toISOString().split("T")[0],
    time: "12:00",
    place: "",
    lat: "",
    lng: "",
    tz_str: "AUTO"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    if (!form.dob || !form.time) return alert("Please provide date and time");

    try {
      setLoading(true);
      const res = await API.post("/western/birth-chart", form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to fetch birth chart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🪐 Western Birth Chart</h1>

      <div style={{ maxWidth: 720, display: "grid", gap: 10 }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
        <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <input placeholder="Place (optional)" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
          <input placeholder="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
        </div>

        <button onClick={generate} disabled={loading} style={{ padding: 10, width: 160 }}>
          {loading ? "Loading..." : "Generate Birth Chart"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20, background: "#111", padding: 14, borderRadius: 8 }}>
          <h3>Result ({result.path || "freeastro"})</h3>
          <pre style={{ whiteSpace: "pre-wrap", maxHeight: 420, overflow: "auto" }}>{JSON.stringify(result.data || result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <BackHomeButton />
      </div>
    </div>
  );
}
