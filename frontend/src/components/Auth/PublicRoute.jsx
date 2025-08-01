import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}
