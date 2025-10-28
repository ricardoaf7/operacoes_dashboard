import React, { useState, useCallback } from 'react';
import { LatLng } from 'leaflet';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import AreaModal from './components/AreaModal';
import AddPointModal from './components/AddPointModal';
import ErrorBoundary from './components/ErrorBoundary';
import useAppData from './hooks/useAppData';
import { insertCsvData } from './lib/supabase';
import { Area, ServiceId } from './types';

export type AddMode = ServiceId | null;

const App: React.FC = () => {
    const {
        db,
        appConfig,
        isLoading,
        refreshData,
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
        imported: true, // Add imported areas layer
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

    const handleCsvImport = useCallback(async (data: any[]) => {
        console.log('CSV data imported:', data);
        try {
            const insertedData = await insertCsvData(data);
            console.log('Data successfully inserted into Supabase:', insertedData);
            // Refresh data to show imported areas on map
            await refreshData();
        } catch (error) {
            console.error('Failed to insert CSV data into Supabase:', error);
            // Handle error - could show an error message to user
        }
    }, [refreshData]);

    // Show loading state if data is not ready
    if (!db || !appConfig || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Carregando Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="flex h-screen text-gray-900 font-sans">
                {/* Sidebar Toggle Button (when collapsed) */}
                {!isSidebarOpen && (
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 z-[9999] bg-gradient-to-r from-slate-700 to-slate-800 backdrop-blur-sm text-white px-3 py-2 rounded-full shadow-lg hover:from-slate-600 hover:to-slate-700 hover:shadow-xl transition-all duration-300 border border-slate-500/30 relative overflow-hidden group w-12 h-12 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 28, 62, 0.95) 0%, rgba(42, 38, 84, 0.95) 100%)'
                    }}
                    title="Mostrar Painel"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out rounded-full"></div>
                    <span className="relative z-10 text-lg">→</span>
                  </button>
                )}
                {isSidebarOpen && (
                  <Sidebar
                      database={db}
                      isOpen={isSidebarOpen}
                      onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                      onAreaClick={(areaId, serviceId) => {
                          console.log(`Area clicked: ${areaId} from service: ${serviceId}`);
                      }}
                      visibleLayers={visibleLayers}
                      onLayerToggle={handleLayerToggle}
                      onCsvImport={handleCsvImport}
                  />
                )}
                <main className="flex-1 h-screen relative">
                    <ErrorBoundary>
                        <MapComponent
                            db={db}
                            visibleLayers={visibleLayers}
                            onAreaSelect={handleAreaSelect}
                            onUpdatePolygon={handleUpdatePolygon}
                            onAreaLocationUpdate={handleUpdateAreaLocation}
                            addMode={addMode}
                            onMapClick={handleMapClick}
                        />
                    </ErrorBoundary>
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
                        onClose={() => {
                            setNewPointCoords(null);
                            setAddMode(null);
                        }}
                        onAdd={handleAddArea}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default App;
