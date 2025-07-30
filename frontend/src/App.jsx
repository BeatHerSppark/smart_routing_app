import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/Map/MapView";
import { SavedRoutesProvider } from "./components/Routes/SavedRoutesContext";

function App() {
  const url = "http://localhost:8000";

  const [markers, setMarkers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSteps, setRouteSteps] = useState([]);
  const [routeType, setRouteType] = useState("round_trip");
  const [transportation, setTransportation] = useState("driving-car");
  const DIRECTIONS_PER_PAGE = 5;
  const [visibleSteps, setVisibleSteps] = useState(DIRECTIONS_PER_PAGE);
  const [mapCenter, setMapCenter] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const tempMarkerRef = useRef(null);

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setMarkers((prevMarkers) => [...prevMarkers, [lat, lng]]);
  };

  const handleLocationAdd = (latlng) => {
    setMarkers((prevMarkers) => [...prevMarkers, latlng]);
  };

  const handleClear = () => {
    setMarkers([]);
    setRouteCoords([]);
    setRouteSteps([]);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setMapCenter(null);
    setActiveIndex(null);
  };

  const handleDeleteMarker = (markerIndex) => {
    setRouteCoords([]);
    setRouteSteps([]);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setActiveIndex(null);
    setMarkers((prevMarkers) =>
      prevMarkers.filter((_, index) => index !== markerIndex)
    );
  };

  const routeTypeHelper = (routeType) => {
    const coords = routeType.geometry.coordinates.map(([lng, lat]) => [
      lat,
      lng,
    ]);
    setRouteCoords(coords);
    const flatSteps = routeType.legs.flatMap((leg) => leg.steps);
    setRouteSteps(flatSteps);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setActiveIndex(null);
  };

  const handleOptimizeRoute = async () => {
    const payload = {
      markers: markers,
      type: routeType,
      transportation: transportation,
    };
    const response = await fetch(`${url}/api/find-optimal-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log(data);

    if (data.trips) {
      routeTypeHelper(data.trips[0]);
    }
  };

  const handleShowMore = () => {
    setVisibleSteps(
      (prevVisibleSteps) => prevVisibleSteps + DIRECTIONS_PER_PAGE
    );
  };

  const handleStepClick = (step, index) => {
    const [lng, lat] = step.location;
    setMapCenter([lat, lng]);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (tempMarkerRef.current) {
      tempMarkerRef.current.openPopup();
    }
  }, [activeIndex]);

  useEffect(() => {
    console.log(transportation);
  }, [transportation]);

  return (
    <SavedRoutesProvider>
      <div className="d-flex vh-100">
        <Sidebar
          markers={markers}
          setMarkers={setMarkers}
          routeSteps={routeSteps}
          routeType={routeType}
          setRouteType={setRouteType}
          transportation={transportation}
          setTransportation={setTransportation}
          handleOptimizeRoute={handleOptimizeRoute}
          handleClear={handleClear}
          handleDeleteMarker={handleDeleteMarker}
          onLocationAdd={handleLocationAdd}
          visibleSteps={visibleSteps}
          activeIndex={activeIndex}
          handleStepClick={handleStepClick}
          handleShowMore={handleShowMore}
          setRouteCoords={setRouteCoords}
          setRouteSteps={setRouteSteps}
        />
        <MapView
          markers={markers}
          routeCoords={routeCoords}
          mapCenter={mapCenter}
          activeIndex={activeIndex}
          routeSteps={routeSteps}
          tempMarkerRef={tempMarkerRef}
          onMapClick={handleMapClick}
        />
      </div>
    </SavedRoutesProvider>
  );
}

export default App;
