import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import './App.css';

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}


function App() {
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;

    setMarkers(prevMarkers => [...prevMarkers, [lat, lng]]);
  };

  const handleClearMarkers = () => {
    setMarkers([]);
  }

  return (
    <div className="app-container">
      <div className="controls-container">
        <h2>Smart Routing App</h2>
        <p>Кликнете на мапата за да додадете локации (маркери).</p>

        <button className="optimize-button">
          Оптимизирај рута
        </button>

        <button onClick={handleClearMarkers} className="clear-button">
          Исчисти маркери
        </button>

        <div className='marker-list'>
          <h3>Додадени локации:</h3>
          {markers.length === 0 ? (
            <p>Нема додадени локации.</p>
          ) : (
            <ol>
              {markers.map((position, index) => (
                <li key={index}>
                  {`Маркер ${index + 1}: (${position[0].toFixed(4)}, ${position[1].toFixed(4)})`}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[41.60, 21.74]} // Центрирано на Македонија
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
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
