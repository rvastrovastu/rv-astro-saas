import axios from "axios";

/**
 * ===============================
 * 🪐 KUNDALI API WRAPPER
 * ===============================
 */
export const getKundali = (data, advanced = false) => {
  const url = `http://localhost:5001/api/kundali/generate${advanced ? "?advanced=true" : ""}`;

  return axios.post(
    url,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      }
    }
  );
};