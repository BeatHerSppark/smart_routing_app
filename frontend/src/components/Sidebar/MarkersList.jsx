import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function MarkersList({ markers, onDeleteMarker }) {
  if (markers.length === 0) {
    return <p className="text-muted">Нема додадени локации.</p>;
  }

  return (
    <ul className="list-group overflow-y-auto" style={{ maxHeight: "200px" }}>
      {markers.map((position, index) => (
        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            {`Маркер ${index + 1}: `}
            <span className="text-muted small">
              {`(${position[0].toFixed(3)}, ${position[1].toFixed(3)})`}
            </span>
          </div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDeleteMarker(index)}
            title="Избриши маркер"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default MarkersList;