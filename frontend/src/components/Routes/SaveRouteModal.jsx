import React, { useState } from "react";
import { useSavedRoutes } from "./SavedRoutesContext";

function SaveRouteModal({ isOpen, onClose, markers, routeType, transportation }) {
  const [routeName, setRouteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveRoute, error, clearError } = useSavedRoutes();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeName.trim() || markers.length < 2) return;

    setIsSubmitting(true);
    try {
      await saveRoute({
        name: routeName.trim(),
        markers: markers,
        route_type: routeType,
        transportation: transportation,
      });
      setRouteName("");
      onClose();
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRouteName("");
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Зачувај рута</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="routeName" className="form-label">
                  Име на рута *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="routeName"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Внесете име за рутата..."
                  maxLength={255}
                  required
                />
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Ова ќе зачува {markers.length} маркери, {" "}
                  {routeType === "round_trip" ? "кружна тура" : "еднонасочна рута"} за{" "}
                  {transportation === "driving-car" ? "автомобил" : 
                   transportation === "cycling-regular" ? "велосипед" : "пешачење"}.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Откажи
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !routeName.trim() || markers.length < 2}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Зачувува...
                  </>
                ) : (
                  "Зачувај рута"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SaveRouteModal;