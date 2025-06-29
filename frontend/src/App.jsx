import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Polyline,
} from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faBicycle,
  faPersonWalking,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function MapCenterController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function App() {
  const url = "http://127.0.0.1:8000";

  const [markers, setMarkers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSteps, setRouteSteps] = useState([]);
  const [routeType, setRouteType] = useState("round_trip");
  const [transportation, setTransportation] = useState("car");
  const DIRECTIONS_PER_PAGE = 5;
  const [visibleSteps, setVisibleSteps] = useState(DIRECTIONS_PER_PAGE);
  const [mapCenter, setMapCenter] = useState(null);

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setMarkers((prevMarkers) => [...prevMarkers, [lat, lng]]);
  };

  const handleClear = () => {
    setMarkers([]);
    setRouteCoords([]);
    setRouteSteps([]);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setMapCenter(null);
  };

  const handleDeleteMarker = (markerIndex) => {
    setRouteCoords([]);
    setRouteSteps([]);
    setVisibleSteps(DIRECTIONS_PER_PAGE);
    setMarkers((prevMarkers) =>
      prevMarkers.filter((_, index) => index !== markerIndex)
    );
  };

  const handleShowMore = () => {
    setVisibleSteps(
      (prevVisibleSteps) => prevVisibleSteps + DIRECTIONS_PER_PAGE
    );
  };

  const handleStepClick = (step) => {
    const [lng, lat] = step.maneuver.location;
    setMapCenter([lat, lng]);
  };

  const handleOptimizeRoute = async () => {
    const payload = {
      markers: markers,
      type: routeType,
      transportation: transportation,
    };

    const response = await fetch(`${url}/api/find-optimal-route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Примено од Django:", data);

    if (data.trips) {
      const coords = data.trips[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
      setRouteCoords(coords);
      const flatSteps = data.trips[0].legs.flatMap((leg) => leg.steps);
      setRouteSteps(flatSteps);
      setVisibleSteps(DIRECTIONS_PER_PAGE);
    }
  };

  return (
    <div className="d-flex vh-100">
      <div
        className="d-flex flex-column p-3 bg-light border-end shadow-sm"
        style={{ width: "380px", overflowY: "auto" }}
      >
        <h2 className="text-center mb-3">Smart Routing App</h2>

        <p className="text-center text-muted small mb-3">
          Кликнете на мапата за да додадете локации (маркери).
        </p>

        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn ${
              routeType === "round_trip" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setRouteType("round_trip")}
          >
            Кружна тура
          </button>
          <button
            type="button"
            className={`btn ${
              routeType === "one_way" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setRouteType("one_way")}
          >
            Еднонасочна рута
          </button>
        </div>

        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn ${
              transportation === "car" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTransportation("car")}
          >
            <FontAwesomeIcon icon={faCar} />
          </button>
          <button
            type="button"
            className={`btn ${
              transportation === "bike" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTransportation("bike")}
          >
            <FontAwesomeIcon icon={faBicycle} />
          </button>
          <button
            type="button"
            className={`btn ${
              transportation === "foot" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTransportation("foot")}
          >
            <FontAwesomeIcon icon={faPersonWalking} />
          </button>
        </div>

        <button
          onClick={handleOptimizeRoute}
          className="btn btn-success w-100 mb-2"
        >
          Оптимизирај рута
        </button>
        <button onClick={handleClear} className="btn btn-danger w-100">
          Исчисти ги сите маркери
        </button>

        <div className="mt-4">
          <h5>Додадени локации:</h5>
          {markers.length === 0 ? (
            <p className="text-muted">Нема додадени локации.</p>
          ) : (
            <ul
              className="list-group overflow-y-auto"
              style={{ maxHeight: "200px" }}
            >
              {markers.map((position, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {`Маркер ${index + 1}: `}
                    <span className="text-muted small">
                      {`(${position[0].toFixed(3)}, ${position[1].toFixed(3)})`}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteMarker(index)}
                    title="Избриши маркер"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3 flex-grow-1">
          <h5>Насоки:</h5>
          {routeSteps.length === 0 ? (
            <p className="text-muted">Насоките ќе се појават тука.</p>
          ) : (
            <>
              <ul className="list-group">
                {routeSteps.slice(0, visibleSteps).map((step, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleStepClick(step)}
                  >
                    <div className="fw-bold text-capitalize">
                      {step.maneuver.type === 'new name' ? 'Continue' : step.maneuver.type}
                    </div>
                    {step.name && (
                      <div className="text-muted fst-italic">
                        "{step.name}"
                      </div>
                    )}
                    <small className="text-muted">
                      Растојание: {(step.distance / 1000).toFixed(2)} km
                    </small>
                  </li>
                ))}
              </ul>
              {visibleSteps < routeSteps.length && (
                <div className="d-grid mt-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleShowMore}
                  >
                    Прикажи повеќе ({routeSteps.length - visibleSteps} останати)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex-grow-1">
        <MapContainer
          center={[41.6, 21.74]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {markers.map((position, index) => (
            <Marker key={index} position={position}>
              <Popup>Маркер {index + 1}</Popup>
            </Marker>
          ))}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: "blue", weight: 5, opacity: 0.7 }}
            />
          )}
          <MapCenterController center={mapCenter} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;