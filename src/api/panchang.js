import API from "../utils/api";

export const getDailyPanchang = (data) => {
  return API.post("/panchang/daily", data);
};