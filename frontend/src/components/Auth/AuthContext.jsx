import { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/users/csrf_cookie", {
      credentials: "include",
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/users/me", {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          setUser(data.username);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Smart Routing App...</h5>
          <p className="text-muted small">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
