import React from "react";

function DirectionsList({
  routeSteps,
  visibleSteps,
  activeIndex,
  onStepClick,
  onShowMore,
}) {
  if (routeSteps.length === 0) {
    return <p className="text-muted">Насоките ќе се појават тука.</p>;
  }

  return (
    <>
      <ul className="list-group">
        {routeSteps.slice(0, visibleSteps).map((step, index) => (
          <li
            key={index}
            className={`list-group-item list-group-item-action ${
              index === activeIndex ? "active" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => onStepClick(step, index)}
          >
            <div className="fw-bold text-capitalize">{step.instruction}</div>
            {step.name != "-" && (
              <div className="text-muted fst-italic">"{step.name}"</div>
            )}
            <small className="text-muted">
              Растојание: {(step.distance / 1000).toFixed(2)} km
            </small>
            <br />
            <small className="text-muted">
              Време:{" "}
              {step.duration > 3600
                ? (step.duration / 3600).toFixed(0) + "h"
                : step.duration > 60
                ? (step.duration / 60).toFixed(0) + "m"
                : step.duration.toFixed(0) + "s"}
            </small>
          </li>
        ))}
      </ul>
      {visibleSteps < routeSteps.length && (
        <div className="d-grid mt-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onShowMore}
          >
            Прикажи повеќе ({routeSteps.length - visibleSteps} останати)
          </button>
        </div>
      )}
    </>
  );
}

export default DirectionsList;
