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
import L from "leaflet";

const whiteDotIcon = L.divIcon({
  className: "custom-white-marker",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function MapView({
  markers,
  draggableMarkers,
  movedMarkers,
  routeCoords,
  mapCenter,
  activeIndex,
  routeSteps,
  tempMarkerRef,
  onMapClick,
  onDragDraggableMarker,
  onDragMovedMarker,
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

        {draggableMarkers.map((position, index) => (
          <Marker
            key={index}
            position={position}
            icon={whiteDotIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => onDragDraggableMarker(e, index),
            }}
          />
        ))}

        {movedMarkers.map((position, index) => (
          <Marker
            key={index}
            position={position}
            icon={whiteDotIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => onDragMovedMarker(e, index),
            }}
          />
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
