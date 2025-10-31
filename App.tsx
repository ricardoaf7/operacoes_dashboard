import React, { useState, useCallback } from 'react';
import { Area, ServiceId } from './types';
import useAppData from './hooks/useAppData';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import AreaModal from './components/AreaModal';
import AddPointModal from './components/AddPointModal';
import { LatLng } from 'leaflet';

export type AddMode = ServiceId | null;

const App: React.FC = () => {
    const {
        db,
        appConfig,
        updateMowingProductionRate,
        updateAreaStatus,
        assignTeamToArea,
        updateAreaPolygon,
        updateAreaLocation,
        addArea,
    } = useAppData();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
        rocagemLote1: true,
        rocagemLote2: true,
        jardins: true,
        descarteIrregular: true,
        areaAdotada: true,
        teamsGiroZero: true,
        teamsAcabamento: true,
        teamsColeta: true,
        teamsTouceiras: true,
    });
    const [selectedArea, setSelectedArea] = useState<{ area: Area; serviceId: ServiceId } | null>(null);
    const [addMode, setAddMode] = useState<AddMode>(null);
    const [newPointCoords, setNewPointCoords] = useState<LatLng | null>(null);

    const handleLayerToggle = useCallback((layerName: string) => {
        setVisibleLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
    }, []);

    const handleAreaSelect = useCallback((area: Area, serviceId: ServiceId) => {
        setSelectedArea({ area, serviceId });
    }, []);
    
    const handleCloseModal = useCallback(() => {
        setSelectedArea(null);
    }, []);

    const handleUpdateAreaStatus = useCallback((areaId: number, serviceId: ServiceId, status: 'Em Execução' | 'Concluído') => {
        updateAreaStatus(areaId, serviceId, status);
        handleCloseModal();
    }, [updateAreaStatus, handleCloseModal]);
    
    const handleAssignTeam = useCallback((areaId: number, serviceId: ServiceId, teamId: number) => {
        assignTeamToArea(areaId, serviceId, teamId);
    }, [assignTeamToArea]);

    const handleUpdatePolygon = useCallback((areaId: number, serviceId: ServiceId, polygon: [number, number][]) => {
        updateAreaPolygon(areaId, serviceId, polygon);
    }, [updateAreaPolygon]);

    const handleUpdateAreaLocation = useCallback((areaId: number, serviceId: ServiceId, latlng: LatLng) => {
        updateAreaLocation(areaId, serviceId, latlng);
    }, [updateAreaLocation]);

    const handleMapClick = useCallback((latlng: LatLng) => {
        if (addMode) {
            setNewPointCoords(latlng);
        }
    }, [addMode]);

    const handleAddArea = useCallback((serviceId: ServiceId, details: { endereco: string, tipo: string }) => {
        if (newPointCoords) {
            addArea(serviceId, details, newPointCoords);
        }
        setNewPointCoords(null);
        setAddMode(null);
    }, [addArea, newPointCoords]);

    console.log('🏠 App.tsx renderizando - db:', db, 'MapComponent será renderizado');
    
    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                appConfig={appConfig}
                onRateChange={updateMowingProductionRate}
                visibleLayers={visibleLayers}
                onLayerToggle={handleLayerToggle}
                services={db.services}
                setAddMode={setAddMode}
            />
            <main className="flex-1 h-screen relative">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-4 left-4 z-[1000] bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                {console.log('🗺️ Prestes a renderizar MapComponent com props:', { db: !!db, visibleLayers, addMode })}
                <MapComponent
                    db={db}
                    visibleLayers={visibleLayers}
                    onAreaSelect={handleAreaSelect}
                    onUpdatePolygon={handleUpdatePolygon}
                    onAreaLocationUpdate={handleUpdateAreaLocation}
                    addMode={addMode}
                    onMapClick={handleMapClick}
                />
            </main>
            {selectedArea && (
                <AreaModal
                    area={selectedArea.area}
                    serviceId={selectedArea.serviceId}
                    teams={db.teams}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleUpdateAreaStatus}
                    onAssignTeam={handleAssignTeam}
                />
            )}
            {newPointCoords && addMode && (
                <AddPointModal
                    serviceId={addMode}
                    onClose={() => { setNewPointCoords(null); setAddMode(null); }}
                    onAddArea={handleAddArea}
                />
            )}
        </div>
    );
};

export default App;
