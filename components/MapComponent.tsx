import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Tooltip, useMapEvents } from 'react-leaflet';
import L, { LatLng, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Database, Area, ServiceId, TeamType } from '../types';
import { TeamIcons, GardenIcon, IrregularDiscardIcon, AdoptedAreaIcon } from './icons';

// Fix: Apply a global patch to Leaflet's default icon paths.
// This is the most robust solution for ESM/CDN environments, ensuring that any
// internal call to `new L.Icon.Default()` within react-leaflet uses the correct image paths.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});


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

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', backgroundColor: '#1a202c' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
                                    <Tooltip
                                    permanent={false}
                                    direction="top"
                                    offset={[0, -15]}
                                    className="custom-tooltip"
                                >
                                    <div style={{
                                        background: 'rgba(30, 30, 35, 0.95)',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        lineHeight: '1.6'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            {area.endereco}
                                        </div>
                                        <div style={{ color: '#4ecdc4', marginBottom: '4px' }}>
                                            Roçagem de Áreas Públicas
                                        </div>
                                        <div style={{ color: '#ffea00', fontWeight: 'normal', marginBottom: '4px' }}>
                                            Previsão: {area.scheduledDate ? new Date(area.scheduledDate).toLocaleDateString('pt-BR') : 'A definir'}
                                        </div>
                                        <div style={{ color: '#4fc3f7', fontWeight: 'normal' }}>
                                            Última roçagem: {(area as any).lastServiceDate ? new Date((area as any).lastServiceDate).toLocaleDateString('pt-BR') : 'Não registrada'}
                                        </div>
                                    </div>
                                </Tooltip>
                                </Polygon>
                            );
                        }
                        
                        return (
                            <Marker
                                key={`${service.id}-${area.id}`}
                                position={position}
                                icon={icon}
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
                                <Tooltip
                                    permanent={false}
                                    direction="top"
                                    offset={[0, -15]}
                                    className="custom-tooltip"
                                >
                                    <div style={{
                                        background: 'rgba(30, 30, 35, 0.95)',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        lineHeight: '1.6'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            {area.endereco}
                                        </div>
                                        <div style={{ color: '#4ecdc4', marginBottom: '4px' }}>
                                            Roçagem de Áreas Públicas
                                        </div>
                                        <div style={{ color: '#ffea00', fontWeight: 'normal', marginBottom: '4px' }}>
                                            Previsão: {area.scheduledDate ? new Date(area.scheduledDate).toLocaleDateString('pt-BR') : 'A definir'}
                                        </div>
                                        <div style={{ color: '#4fc3f7', fontWeight: 'normal' }}>
                                            Última roçagem: {(area as any).lastServiceDate ? new Date((area as any).lastServiceDate).toLocaleDateString('pt-BR') : 'Não registrada'}
                                        </div>
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
                        icon={icon}
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
    );
};

export default MapComponent;