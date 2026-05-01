import axios from "axios";

/**
 * ===============================
 * 🌐 CENTRAL API CONFIG
 * ===============================
 */
const API = axios.create({
  baseURL: "https://rv-astro-api.rvastrovastu.workers.dev/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * ===============================
 * 🔐 AUTO TOKEN ATTACH
 * ===============================
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ===============================
 * 🔄 AUTO REFRESH TOKEN + GLOBAL ERROR HANDLER
 * ===============================
 */
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.error("API Error:", err.response?.data || err.message);

    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "http://localhost:5001/api/auth/refresh",
          {
            refreshToken: localStorage.getItem("refreshToken")
          }
        );

        localStorage.setItem("token", refreshRes.data.token);
        localStorage.setItem("refreshToken", refreshRes.data.refreshToken);

        if (refreshRes.data.user) {
          localStorage.setItem("user", JSON.stringify(refreshRes.data.user));
        }

        originalRequest.headers.Authorization = `Bearer ${refreshRes.data.token}`;

        return API(originalRequest);
      } catch (refreshErr) {
        console.error(
          "Refresh Token Error:",
          refreshErr.response?.data || refreshErr.message
        );

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshErr);
      }
    }

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    return Promise.reject(err);
  }
);

export default API;