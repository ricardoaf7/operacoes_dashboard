import React, { useState, useCallback } from 'react';
import { Area, ServiceId } from './types';
import useAppData from './hooks/useAppData';
import { LatLng } from 'leaflet';

export type AddMode = ServiceId | null;

const GradualApp: React.FC = () => {
    console.log('GradualApp rendering...');
    
    const [loadStep, setLoadStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

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

    // Show loading state if data is not ready
    if (!db || !appConfig) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Carregando Dashboard...</p>
                </div>
            </div>
        );
    }

    const loadComponent = async (step: number) => {
        try {
            setLoadStep(step);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    const renderStep = () => {
        try {
            switch (loadStep) {
                case 1:
                    return (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-4">✅ Passo 1: Estrutura Básica</h2>
                            <p className="mb-4">useAppData funcionando: {db.services.length} serviços carregados</p>
                            <button 
                                onClick={() => loadComponent(2)}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                            >
                                Próximo: Carregar Sidebar
                            </button>
                        </div>
                    );

                case 2:
                    const Sidebar = require('./components/Sidebar').default;
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
                            <div className="flex-1 p-8">
                                <h2 className="text-2xl font-bold mb-4">✅ Passo 2: Sidebar Carregada</h2>
                                <p className="mb-4">Sidebar funcionando corretamente!</p>
                                <button 
                                    onClick={() => loadComponent(3)}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                                >
                                    Próximo: Carregar MapComponent
                                </button>
                            </div>
                        </div>
                    );

                case 3:
                    const SidebarStep3 = require('./components/Sidebar').default;
                    const MapComponent = require('./components/MapComponent').default;
                    return (
                        <div className="flex h-screen bg-gray-900 text-white font-sans">
                            <SidebarStep3
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
                        </div>
                    );

                default:
                    return <div>Teste concluído!</div>;
            }
        } catch (err) {
            return (
                <div className="p-8 bg-red-900 text-white">
                    <h2 className="text-2xl font-bold mb-4">❌ Erro no Passo {loadStep}</h2>
                    <p className="mb-4">Erro: {err instanceof Error ? err.message : String(err)}</p>
                    <pre className="bg-red-800 p-4 rounded text-sm overflow-auto">
                        {err instanceof Error ? err.stack : String(err)}
                    </pre>
                    <button 
                        onClick={() => setLoadStep(loadStep - 1)}
                        className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        Voltar ao Passo Anterior
                    </button>
                </div>
            );
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-900 text-white">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">❌ Erro no Dashboard</h1>
                    <p className="mb-4">Erro: {error}</p>
                    <button 
                        onClick={() => setError(null)} 
                        className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        🔄 Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return renderStep();
};

export default GradualApp;