import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DrawingTools from './DrawingTools';

// Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Database, Area, ServiceId, TeamType } from '../types';
import { TeamIcons, GardenIcon, IrregularDiscardIcon, AdoptedAreaIcon } from './icons';

// Layer Control Component
const LayerControl: React.FC<{ map: L.Map | null }> = ({ map }) => {
  const [currentLayer, setCurrentLayer] = useState<'osm' | 'satellite' | 'hybrid'>('osm');

  useEffect(() => {
    if (!map) return;

    // Define tile layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri, Maxar, Earthstar Geographics',
      maxZoom: 19
    });

    const streetLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png', {
      attribution: '© Stamen Design, © OpenStreetMap contributors',
      maxZoom: 19
    });

    // Remove the default TileLayer since LayerControl will handle it
    // Set initial layer
    // osmLayer.addTo(map); // This will be handled by LayerControl

    // Create layer control
    const baseLayers = {
      "🗺️ Mapa Padrão": osmLayer,
      "🛰️ Satélite": satelliteLayer,
      "🌍 Híbrido": L.layerGroup([satelliteLayer, streetLabels])
    };

    const layerControl = L.control.layers(baseLayers, null, {
      position: 'topright',
      collapsed: false
    }).addTo(map);

    // Set default layer
    osmLayer.addTo(map);

    return () => {
      map.removeControl(layerControl);
    };
  }, [map]);

  return null;
};

// Fix: Apply a global patch to Leaflet's default icon paths.
// This is the most robust solution for ESM/CDN environments, ensuring that any
// internal call to `new L.Icon.Default()` within react-leaflet uses the correct image paths.
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create a proper default icon configuration
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;


// Defined AddMode locally to avoid circular dependency with App.tsx
type AddMode = ServiceId | null;

interface MapComponentProps {
    db: Database;
    visibleLayers: Record<string, boolean>;
    onAreaSelect: (area: Area, serviceId: ServiceId) => void;
    onUpdatePolygon: (areaId: number, serviceId: ServiceId, polygon: [number, number][]) => void;
    onAreaLocationUpdate: (areaId: number, serviceId: ServiceId, latlng: LatLng) => void;
    addMode: AddMode;
    onMapClick: (latlng: LatLng) => void;
}

const MapEventsHandler: React.FC<{ onMapClick: (latlng: LatLng) => void, addMode: AddMode }> = ({ onMapClick, addMode }) => {
    const map = useMapEvents({
        click(e) {
            if (addMode) {
                onMapClick(e.latlng);
            }
        },
    });

    useEffect(() => {
        if (addMode) {
            map.getContainer().style.cursor = 'crosshair';
        } else {
            map.getContainer().style.cursor = '';
        }
    }, [addMode, map]);

    return null;
};

const getStatusColor = (status?: string, scheduledDate?: Date | null): string => {
    if (status === 'Concluído') return '#6B7280'; // gray-500
    if (status === 'Em Execução') return '#10B981'; // green-500
    
    if (scheduledDate) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const schedDate = new Date(scheduledDate);
        schedDate.setHours(0,0,0,0);
        const diffTime = schedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return '#EF4444'; // red-500 - Overdue
        if (diffDays === 0) return '#F59E0B'; // yellow-500 - Today
    }

    return '#3B82F6'; // blue-500 - Pending
};

const MapComponent: React.FC<MapComponentProps> = ({
    db,
    visibleLayers,
    onAreaSelect,
    onAreaLocationUpdate,
    addMode,
    onMapClick,
}) => {
    const center: LatLngTuple = [-23.31, -51.16]; // Center of Londrina, PR
    const mapRef = useRef<L.Map | null>(null);

    // Component to get map reference
    const MapRefHandler: React.FC = () => {
        const map = useMapEvents({});
        
        useEffect(() => {
            mapRef.current = map;
        }, [map]);
        
        return null;
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                {/* Remove the default TileLayer since LayerControl will handle all layers */}
                <MapRefHandler />
                <LayerControl map={mapRef.current} />
                <DrawingTools 
                  map={mapRef.current} 
                  onPolygonCreated={(polygon) => {
                    console.log('Polígono criado:', polygon);
                  }}
                />

                <MapEventsHandler onMapClick={onMapClick} addMode={addMode} />

            {/* Services */}
            {db.services.map(service => (
                <React.Fragment key={service.id}>
                    {service.areas.map(area => {
                        let isVisible = false;
                        let icon: L.DivIcon | L.Icon | undefined = undefined;
                        const position: LatLngTuple = [area.lat, area.lng];

                        switch(service.id) {
                            case 'rocagem':
                                if (area.lote === 1 && visibleLayers.rocagemLote1) isVisible = true;
                                if (area.lote === 2 && visibleLayers.rocagemLote2) isVisible = true;
                                break;
                            case 'jardins':
                                if (visibleLayers.jardins) { isVisible = true; icon = GardenIcon; }
                                break;
                            case 'descarteIrregular':
                                if (visibleLayers.descarteIrregular) { isVisible = true; icon = IrregularDiscardIcon; }
                                break;
                            case 'areaAdotada':
                                if (visibleLayers.areaAdotada) { isVisible = true; icon = AdoptedAreaIcon; }
                                break;
                            case 'imported':
                                if (visibleLayers.imported) { isVisible = true; }
                                break;
                        }
                        
                        if (!isVisible) return null;
                        
                        const markerRef = useRef<L.Marker>(null);

                        if (service.id === 'rocagem' && area.polygon) {
                            return (
                                <Polygon
                                    key={`${service.id}-${area.id}`}
                                    positions={area.polygon}
                                    pathOptions={{ color: getStatusColor(area.status, area.scheduledDate) }}
                                    eventHandlers={{
                                        dblclick: () => onAreaSelect(area, service.id),
                                        click: (e) => { L.DomEvent.stop(e); (e.target as any).openTooltip(); }
                                    }}
                                >
                                    <Tooltip sticky>
                                        <div>
                                            <p className="font-bold">{area.endereco}</p>
                                            <p>Status: {area.status}</p>
                                            {area.scheduledDate && <p>Agendado: {new Date(area.scheduledDate).toLocaleDateString('pt-BR')}</p>}
                                            <p className="italic text-gray-400 mt-1">Duplo clique para mais detalhes</p>
                                        </div>
                                    </Tooltip>
                                </Polygon>
                            );
                        }
                        
                        return (
                            <Marker
                                key={`${service.id}-${area.id}`}
                                position={position}
                                icon={icon || defaultIcon}
                                draggable={true}
                                ref={markerRef}
                                eventHandlers={{
                                    dblclick: () => onAreaSelect(area, service.id),
                                    click: (e) => { (e.target as any).openTooltip(); },
                                    dragend: () => {
                                        const marker = markerRef.current;
                                        if (marker != null) {
                                            onAreaLocationUpdate(area.id, service.id, marker.getLatLng());
                                        }
                                    }
                                }}
                            >
                                <Tooltip sticky>
                                     <div>
                                        <p className="font-bold">{area.endereco}</p>
                                        <p>Tipo: {area.tipo}</p>
                                        {area.status && <p>Status: {area.status}</p>}
                                        <p className="italic text-gray-400 mt-1">Duplo clique para mais detalhes</p>
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    })}
                </React.Fragment>
            ))}

            {/* Teams */}
            {db.teams.map(team => {
                 const isVisible =
                    (team.type === 'Giro Zero' && visibleLayers.teamsGiroZero) ||
                    (team.type === 'Acabamento' && visibleLayers.teamsAcabamento) ||
                    (team.type === 'Coleta' && visibleLayers.teamsColeta) ||
                    (team.type === 'Touceiras' && visibleLayers.teamsTouceiras);

                if (!isVisible) return null;
                
                const icon = TeamIcons[team.type as TeamType];
                if (!icon) return null;

                return (
                    <Marker
                        key={`team-${team.id}`}
                        position={[team.location.lat, team.location.lng]}
                        icon={icon || defaultIcon}
                    >
                        <Tooltip>
                            <b>Equipe {team.id} - {team.type}</b><br />
                            Status: {team.status}<br />
                            {team.currentAreaId && `Trabalhando em: Area ID ${team.currentAreaId}`}
                        </Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
        </div>
    );
};

export default MapComponent;