import { createContext, useContext, useState, useEffect } from "react";

const SavedRoutesContext = createContext();

export function SavedRoutesProvider({ children }) {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:8000";



  const fetchSavedRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch saved routes");
      }

      const data = await response.json();
      setSavedRoutes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRoute = async (routeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save route");
      }

      const newRoute = await response.json();
      setSavedRoutes(prev => [newRoute, ...prev]);
      return newRoute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = async (id, routeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/${id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update route");
      }

      const updatedRoute = await response.json();
      setSavedRoutes(prev => 
        prev.map(route => route.id === id ? updatedRoute : route)
      );
      return updatedRoute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete route");
      }

      setSavedRoutes(prev => prev.filter(route => route.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRoutes();
  }, []);

  return (
    <SavedRoutesContext.Provider value={{
      savedRoutes,
      loading,
      error,
      fetchSavedRoutes,
      saveRoute,
      updateRoute,
      deleteRoute,
      clearError: () => setError(null)
    }}>
      {children}
    </SavedRoutesContext.Provider>
  );
}

export const useSavedRoutes = () => useContext(SavedRoutesContext);