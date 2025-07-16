import React, { useState } from "react";
import Controls from "../Controls/Controls";
import MarkersList from "./MarkersList";
import DirectionsList from "./DirectionsList";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router";

function Sidebar(props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const searchLocation = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=7de233630b45491d8155cbcc370e4166&limit=3&no_annotations=1`
      );
      const data = await response.json();
      
      if (data.results) {
        setSearchResults(data.results);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const timeoutId = setTimeout(() => searchLocation(value.trim()), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleLocationSelect = (result) => {
    const { lat, lng } = result.geometry;
    props.onLocationAdd([lat, lng]);
    setSearchQuery(result.formatted);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleLocationSelect(searchResults[0]);
    }
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

      <div className="location-search mb-3">
        <form onSubmit={handleSearchSubmit} className="position-relative">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {isSearching && (
              <span className="input-group-text bg-white border-start-0">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </span>
            )}
          </div>
          
          {showDropdown && searchResults.length > 0 && (
            <div className="dropdown-menu show w-100 mt-1 shadow-lg border-0" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  className="dropdown-item d-flex align-items-start p-3 border-0"
                  onClick={() => handleLocationSelect(result)}
                  style={{ whiteSpace: "normal", lineHeight: "1.4" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2 mt-1 flex-shrink-0 text-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <div className="fw-medium text-dark" style={{ fontSize: "13px" }}>
                      {result.components.road || result.components.neighbourhood || result.components.city || "Unknown"}
                    </div>
                    <div className="text-muted small">
                      {result.formatted}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
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
