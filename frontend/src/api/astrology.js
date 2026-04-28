import axios from "axios";

/**
 * ===============================
 * 🪐 KUNDALI API WRAPPER
 * ===============================
 */
export const getKundali = (data) => {
  return axios.post(
    "http://localhost:5001/api/kundali/generate",
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      }
    }
  );
};