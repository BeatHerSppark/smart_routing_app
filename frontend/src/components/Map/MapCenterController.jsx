import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

function MapCenterController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { animate: true, duration: 1.5 });
    }
  }, [center]);

  return null;
}

export default MapCenterController;