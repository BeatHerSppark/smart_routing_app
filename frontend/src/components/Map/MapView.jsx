import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import MapClickHandler from "./MapClickHandler";
import MapCenterController from "./MapCenterController";

function MapView({
  markers,
  routeCoords,
  mapCenter,
  activeIndex,
  routeSteps,
  tempMarkerRef,
  onMapClick,
}) {
  return (
    <div className="flex-grow-1">
      <MapContainer
        center={[41.99, 21.43]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={onMapClick} />

        {markers.map((position, index) => (
          <Marker key={`marker-${index}`} position={position}>
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

        {mapCenter && (
          <Marker ref={tempMarkerRef} position={mapCenter}>
            <Popup>
              {activeIndex !== null && routeSteps[activeIndex] && (
                <div>
                  <b>{routeSteps[activeIndex].instruction}</b>
                </div>
              )}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
