import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "./App.css";

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

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;

    setMarkers((prevMarkers) => [...prevMarkers, [lat, lng]]);
  };

  const handleClear = () => {
    setMarkers([]);
    setRouteCoords([]);
    setRouteSteps([]);
  };

  const handleOptimizeRoute = async () => {
    const response = await fetch(`${url}/api/find-optimal-route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markers }),
    });

    const data = await response.json();
    console.log(data);

    if (data.trips) {
      const coords = data.trips[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
      setRouteCoords(coords);

      const flatSteps = data.trips[0].legs.flatMap((leg) => leg.steps);
      setRouteSteps(flatSteps);
    }
  };

  return (
    <div className="app-container">
      <div className="controls-container">
        <h2>Smart Routing App</h2>
        <p>Кликнете на мапата за да додадете локации (маркери).</p>

        <button onClick={handleOptimizeRoute} className="optimize-button">
          Оптимизирај рута
        </button>

        <button onClick={handleClear} className="clear-button">
          Исчисти маркери
        </button>

        <div className="marker-list">
          <h3>Додадени локации:</h3>
          {markers.length === 0 ? (
            <p>Нема додадени локации.</p>
          ) : (
            <ol>
              {markers.map((position, index) => (
                <li key={index}>
                  {`Маркер ${index + 1}: (${position[0].toFixed(
                    4
                  )}, ${position[1].toFixed(4)})`}
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="step-list">
          <h3>Насоки:</h3>
          {routeSteps.length === 0 ? (
            <p>Насоките ќе се појават по наоѓање рута.</p>
          ) : (
            <ol>
              {routeSteps.map((step, index) => (
                <li key={index}>
                  <strong>{step.maneuver.type}</strong>
                  <br />
                  <small>
                    {step.name ? `на улица ${step.name}` : "без име"}
                  </small>
                  <br />
                  <small>{(step.distance / 1000).toFixed(2)} km</small>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[41.6, 21.74]} // Центрирано на Македонија
          zoom={8}
          className="map-container"
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
              pathOptions={{ color: "red", weight: 6, opacity: 0.5 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
