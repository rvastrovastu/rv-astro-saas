import axios from "axios";

export const saveKundali = async (payload) => {
  return await axios.post("/api/kundali/save", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
};