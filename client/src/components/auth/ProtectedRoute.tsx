import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role: "admin" | "teacher" | "parent";
}

export default function ProtectedRoute({
  role,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("auth_token");

  // No token = not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  let payload: { role?: string } = {};
  let invalidToken = false;

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      invalidToken = true;
    } else {
      payload = JSON.parse(atob(parts[1]));
    }
  } catch (error) {
    console.error("Invalid authentication token:", error);
    invalidToken = true;
  }

  // Invalid token
  if (invalidToken) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem(role);

    return <Navigate to="/" replace />;
  }

  // Wrong role
  if (payload.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Authentication successful
  return <Outlet />;
}