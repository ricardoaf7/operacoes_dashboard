import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const TestDragMarker: React.FC = () => {
  const handleDragEnd = (e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    console.log('Marker dragged to:', position);
    alert(`Marcador movido para: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[-23.31, -51.16]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker
          position={[-23.31, -51.16]}
          draggable={true}
          eventHandlers={{
            dragstart: () => console.log('Drag started'),
            drag: () => console.log('Dragging...'),
            dragend: handleDragEnd
          }}
        />
      </MapContainer>
    </div>
  );
};

export default TestDragMarker;