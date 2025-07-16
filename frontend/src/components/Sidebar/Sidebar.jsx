import React from "react";
import Controls from "../Controls/Controls";
import MarkersList from "./MarkersList";
import DirectionsList from "./DirectionsList";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router";

function Sidebar(props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column p-3 bg-light border-end shadow-sm"
      style={{ width: "380px", overflowY: "auto" }}
    >
      <div className="user-header d-flex align-items-center justify-content-between mb-3 p-3 bg-white rounded shadow-sm border">
        <div className="user-info d-flex align-items-center">
          <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{ width: "40px", height: "40px", fontSize: "16px", fontWeight: "bold" }}>
            {user ? user.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
              {user || "Unknown User"}
            </div>
            <div className="text-muted small">Online</div>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="btn btn-outline-danger btn-sm d-flex align-items-center"
          style={{ fontSize: "12px", padding: "4px 8px" }}
          title="Logout"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>

      <h2 className="text-center mb-3">Smart Routing App</h2>
      <p className="text-center text-muted small mb-3">
        Кликнете на мапата за да додадете локации (маркери).
      </p>

      <Controls
        routeType={props.routeType}
        setRouteType={props.setRouteType}
        transportation={props.transportation}
        setTransportation={props.setTransportation}
        handleOptimizeRoute={props.handleOptimizeRoute}
        handleClear={props.handleClear}
      />

      <div className="mt-4">
        <h5>Додадени локации:</h5>
        <MarkersList
          markers={props.markers}
          onDeleteMarker={props.handleDeleteMarker}
        />
      </div>

      <div className="mt-3 flex-grow-1">
        <h5>Насоки:</h5>
        <DirectionsList
          routeSteps={props.routeSteps}
          visibleSteps={props.visibleSteps}
          activeIndex={props.activeIndex}
          onStepClick={props.handleStepClick}
          onShowMore={props.handleShowMore}
        />
      </div>
    </div>
  );
}

export default Sidebar;
