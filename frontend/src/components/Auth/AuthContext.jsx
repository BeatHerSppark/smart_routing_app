import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { me, fetchCSRF } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    await fetchCSRF();
    const res = await me();
    if (res.ok) {
      const data = await res.json();
      setUser(data.username);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading Smart Routing App...</h5>
            <p className="text-muted small">
              Please wait while we authenticate you
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
