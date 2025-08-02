import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/Map/MapView";
import { SavedRoutesProvider } from "./components/Routes/SavedRoutesContext";

function App() {
  const url = "http://localhost:8000";

  const [markers, setMarkers] = useState([]);
  const [draggableMarkers, setDraggableMarkers] = useState([]);
  const [movedMarkers, setMovedMarkers] = useState([]);
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
    setMovedMarkers([]);
    setDraggableMarkers([]);
    setRouteCoords([]);
    setRouteSteps([]);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setMapCenter(null);
    setActiveIndex(null);
  };

  const handleDeleteMarker = (markerIndex) => {
    setDraggableMarkers([]);
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

    const dragMarkerInterval = 20;
    const dragMarkers = coords
      .slice(5)
      .filter((_, idx) => idx % dragMarkerInterval == 0);
    setDraggableMarkers(dragMarkers);

    const flatSteps = routeType.legs.flatMap((leg) => leg.steps);
    setRouteSteps(flatSteps);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setActiveIndex(null);
  };

  const handleOptimizeRoute = async () => {
    const payload = {
      markers: [...markers, ...movedMarkers],
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

  const handleDragDraggableMarker = (e, index) => {
    const latLng = e.target.getLatLng();
    setMovedMarkers((prevMarkers) => [
      ...prevMarkers,
      [latLng.lat, latLng.lng],
    ]);
    console.log(latLng);
    console.log(draggableMarkers[index]);
    console.log(movedMarkers);
  };

  const handleDragMovedMarker = (e, index) => {
    const latLng = e.target.getLatLng();
    setMovedMarkers((prevMarkers) =>
      prevMarkers.filter((_, idx) => idx != index)
    );
    setMovedMarkers((prevMarkers) => [
      ...prevMarkers,
      [latLng.lat, latLng.lng],
    ]);
  };

  useEffect(() => {
    if (tempMarkerRef.current) {
      tempMarkerRef.current.openPopup();
    }
  }, [activeIndex]);

  useEffect(() => {
    console.log(transportation);
  }, [transportation]);

  useEffect(() => {
    if (movedMarkers.length > 0) handleOptimizeRoute();
  }, [movedMarkers]);

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
          draggableMarkers={draggableMarkers}
          movedMarkers={movedMarkers}
          routeCoords={routeCoords}
          mapCenter={mapCenter}
          activeIndex={activeIndex}
          routeSteps={routeSteps}
          tempMarkerRef={tempMarkerRef}
          onMapClick={handleMapClick}
          onDragDraggableMarker={handleDragDraggableMarker}
          onDragMovedMarker={handleDragMovedMarker}
        />
      </div>
    </SavedRoutesProvider>
  );
}

export default App;
