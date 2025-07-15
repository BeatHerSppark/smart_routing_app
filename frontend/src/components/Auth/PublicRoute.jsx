import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
