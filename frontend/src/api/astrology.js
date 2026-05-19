import API from "../utils/api";

/**
 * ===============================
 * 🪐 KUNDALI API WRAPPER
 * ===============================
 */
export const getKundali = (data, advanced = false) => {
  const url = `/kundali/generate${advanced ? "?advanced=true" : ""}`;

  return API.post(url, data);
};

export const saveKundali = (payload) => {
  return API.post("/kundali/save", payload);
};