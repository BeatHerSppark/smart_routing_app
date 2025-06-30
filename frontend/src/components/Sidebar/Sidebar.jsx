import React from 'react';
import Controls from '../Controls/Controls';
import MarkersList from './MarkersList';
import DirectionsList from './DirectionsList';

function Sidebar(props) {
  return (
    <div
      className="d-flex flex-column p-3 bg-light border-end shadow-sm"
      style={{ width: "380px", overflowY: "auto" }}
    >
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
        <MarkersList markers={props.markers} onDeleteMarker={props.handleDeleteMarker} />
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