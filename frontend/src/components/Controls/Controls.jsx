import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faBicycle, faPersonWalking } from "@fortawesome/free-solid-svg-icons";

function Controls({ routeType, setRouteType, transportation, setTransportation, handleOptimizeRoute, handleClear }) {
  return (
    <>
      <div className="btn-group w-100 mb-3" role="group">
        <button type="button" className={`btn ${routeType === "round_trip" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setRouteType("round_trip")}>
          Кружна тура
        </button>
        <button type="button" className={`btn ${routeType === "one_way" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setRouteType("one_way")}>
          Еднонасочна рута
        </button>
      </div>

      <div className="btn-group w-100 mb-3" role="group">
        <button type="button" className={`btn ${transportation === "car" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTransportation("car")}>
          <FontAwesomeIcon icon={faCar} />
        </button>
        <button type="button" className={`btn ${transportation === "bike" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTransportation("bike")}>
          <FontAwesomeIcon icon={faBicycle} />
        </button>
        <button type="button" className={`btn ${transportation === "foot" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTransportation("foot")}>
          <FontAwesomeIcon icon={faPersonWalking} />
        </button>
      </div>

      <button onClick={handleOptimizeRoute} className="btn btn-success w-100 mb-2">
        Оптимизирај рута
      </button>
      <button onClick={handleClear} className="btn btn-danger w-100">
        Исчисти ги сите маркери
      </button>
    </>
  );
}

export default Controls;