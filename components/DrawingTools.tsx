import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

interface DrawingToolsProps {
  map: L.Map | null;
  onPolygonCreated?: (polygon: L.Polygon) => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ map, onPolygonCreated }) => {
  useEffect(() => {
    if (!map) return;

    // Create a feature group to store drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialize the draw control
    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Erro:</strong> As bordas do polígono não podem se cruzar!'
          },
          shapeOptions: {
            color: '#6366f1',
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.3
          }
        },
        polyline: false,
        rectangle: {
          shapeOptions: {
            color: '#6366f1',
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.3
          }
        },
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    map.addControl(drawControl);

    // Handle draw events
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      
      if (layer instanceof L.Polygon && onPolygonCreated) {
        onPolygonCreated(layer);
      }
    });

    map.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: L.Layer) => {
        console.log('Edited layer:', layer);
      });
    });

    map.on(L.Draw.Event.DELETED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: L.Layer) => {
        console.log('Deleted layer:', layer);
      });
    });

    // Cleanup function
    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
    };
  }, [map, onPolygonCreated]);

  return null;
};

export default DrawingTools;