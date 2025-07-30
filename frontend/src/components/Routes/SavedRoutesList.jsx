import React, { useState } from "react";
import { useSavedRoutes } from "./SavedRoutesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRoute, 
  faTrash, 
  faCar, 
  faBicycle, 
  faPersonWalking,
  faMapMarkerAlt,
  faCalendarAlt 
} from "@fortawesome/free-solid-svg-icons";

function SavedRoutesList({ onLoadRoute }) {
  const { savedRoutes, loading, deleteRoute } = useSavedRoutes();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Дали сте сигурни дека сакате да ја избришете рутата "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteRoute(id);
    } catch (err) {
    } finally {
      setDeletingId(null);
    }
  };

  const getTransportationIcon = (transportation) => {
    switch (transportation) {
      case "driving-car":
        return faCar;
      case "cycling-regular":
        return faBicycle;
      case "foot-walking":
        return faPersonWalking;
      default:
        return faCar;
    }
  };

  const getTransportationLabel = (transportation) => {
    switch (transportation) {
      case "driving-car":
        return "Автомобил";
      case "cycling-regular":
        return "Велосипед";
      case "foot-walking":
        return "Пешачење";
      default:
        return "Автомобил";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mk-MK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading && savedRoutes.length === 0) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2 small">Се вчитуваат зачуваните рути...</p>
      </div>
    );
  }

  if (savedRoutes.length === 0) {
    return (
      <div className="text-center py-4">
        <FontAwesomeIcon icon={faRoute} size="2x" className="text-muted mb-3" />
        <p className="text-muted">Немате зачувани рути.</p>
        <p className="text-muted small">
          Додадете маркери на мапата и кликнете "Зачувај рута".
        </p>
      </div>
    );
  }

  return (
    <div className="saved-routes-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
      {savedRoutes.map((route) => (
        <div key={route.id} className="card mb-2 border-0 shadow-sm">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="card-title mb-1 fw-semibold text-truncate" style={{ maxWidth: "200px" }}>
                {route.name}
              </h6>
              <div className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onLoadRoute(route)}
                  title="Вчитај рута"
                >
                  <FontAwesomeIcon icon={faRoute} size="sm" />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(route.id, route.name)}
                  disabled={deletingId === route.id}
                  title="Избриши рута"
                >
                  {deletingId === route.id ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="d-flex align-items-center gap-3 text-muted small mb-2">
              <div className="d-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{route.markers_count} маркери</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <FontAwesomeIcon icon={getTransportationIcon(route.transportation)} />
                <span>{getTransportationLabel(route.transportation)}</span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-light text-dark">
                {route.route_type === "round_trip" ? "Кружна тура" : "Еднонасочна рута"}
              </span>
              <div className="d-flex align-items-center gap-1 text-muted small">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{formatDate(route.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavedRoutesList;