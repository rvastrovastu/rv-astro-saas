import { Navigate } from "react-router-dom";

/**
 * ===============================
 * 🔐 AUTH HELPERS
 * ===============================
 */
const getUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = getUser();

  // Allow either token OR user object
  return !!token || !!user;
};

const isProUser = () => {
  const user = getUser();
  return user?.plan === "pro";
};

/**
 * ===============================
 * 🛡️ PROTECTED ROUTE
 * ===============================
 */
export default function ProtectedRoute({ children, proOnly = false }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (proOnly && !isProUser()) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}