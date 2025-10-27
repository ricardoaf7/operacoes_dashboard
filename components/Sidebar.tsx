import React from 'react';
import { AppConfig, Service, ServiceId } from '../types';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    appConfig: AppConfig;
    onRateChange: (lote: 1 | 2, rate: number) => void;
    visibleLayers: Record<string, boolean>;
    onLayerToggle: (layerName: string) => void;
    services: Service[];
    setAddMode: (mode: ServiceId | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    toggleSidebar,
    appConfig,
    onRateChange,
    visibleLayers,
    onLayerToggle,
    services,
    setAddMode,
}) => {
    
    const rocagemService = services.find(s => s.id === 'rocagem');
    const scheduledLote1 = rocagemService?.areas
        .filter(a => a.lote === 1 && a.status === 'Pendente' && a.scheduledDate)
        .sort((a, b) => a.scheduledDate!.getTime() - b.scheduledDate!.getTime()) || [];

    const scheduledLote2 = rocagemService?.areas
        .filter(a => a.lote === 2 && a.status === 'Pendente' && a.scheduledDate)
        .sort((a, b) => a.scheduledDate!.getTime() - b.scheduledDate!.getTime()) || [];

    return (
        <aside className={`absolute lg:relative z-20 h-full bg-gray-800 text-gray-200 w-80 md:w-96 flex-shrink-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-400">CMTU-LD Dashboard</h1>
                    <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-md hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow pr-2">
                    {/* Layer Controls */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Controle de Camadas</h2>
                        <div className="space-y-2 text-sm">
                            <Checkbox label="Roçagem (Lote 1)" checked={visibleLayers.rocagemLote1} onChange={() => onLayerToggle('rocagemLote1')} />
                            <Checkbox label="Roçagem (Lote 2)" checked={visibleLayers.rocagemLote2} onChange={() => onLayerToggle('rocagemLote2')} />
                            <Checkbox label="Manutenção de Jardins" checked={visibleLayers.jardins} onChange={() => onLayerToggle('jardins')} />
                            <Checkbox label="Descarte Irregular" checked={visibleLayers.descarteIrregular} onChange={() => onLayerToggle('descarteIrregular')} />
                            <Checkbox label="Áreas Adotadas" checked={visibleLayers.areaAdotada} onChange={() => onLayerToggle('areaAdotada')} />
                            <h3 className="font-semibold text-gray-400 pt-2">Equipes:</h3>
                            <Checkbox label="Giro Zero" checked={visibleLayers.teamsGiroZero} onChange={() => onLayerToggle('teamsGiroZero')} />
                            <Checkbox label="Acabamento" checked={visibleLayers.teamsAcabamento} onChange={() => onLayerToggle('teamsAcabamento')} />
                            <Checkbox label="Coleta (Roçagem)" checked={visibleLayers.teamsColeta} onChange={() => onLayerToggle('teamsColeta')} />
                            <Checkbox label="Touceiras" checked={visibleLayers.teamsTouceiras} onChange={() => onLayerToggle('teamsTouceiras')} />
                        </div>
                    </div>

                    {/* Quick Add Panel */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Cadastro Rápido no Mapa</h2>
                        <div className="space-y-2">
                             <button type="button" onClick={() => setAddMode('descarteIrregular')} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded-md font-semibold transition text-sm">Adicionar Ponto de Descarte</button>
                             <button type="button" onClick={() => setAddMode('areaAdotada')} className="w-full bg-teal-600 hover:bg-teal-700 p-2 rounded-md font-semibold transition text-sm">Adicionar Área Adotada</button>
                        </div>
                    </div>
                    
                    {/* Scheduling Panel */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Planner (Roçagem)</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Produtividade Lote 1 (m²/dia)</label>
                                <input type="number" value={appConfig.mowingProductionRate.lote1} onChange={e => onRateChange(1, parseInt(e.target.value))} className="w-full bg-gray-700 rounded-md border-gray-600 p-2 text-white focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Produtividade Lote 2 (m²/dia)</label>
                                <input type="number" value={appConfig.mowingProductionRate.lote2} onChange={e => onRateChange(2, parseInt(e.target.value))} className="w-full bg-gray-700 rounded-md border-gray-600 p-2 text-white focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-400 mb-2">Próximos Serviços Agendados:</h3>
                            <div className="max-h-48 overflow-y-auto text-xs space-y-2 p-2 bg-gray-900 rounded-md">
                                <h4 className="font-bold text-blue-400">Lote 1</h4>
                                {scheduledLote1.slice(0, 5).map(area => (
                                    <p key={`l1-${area.id}`} className="truncate"><b>{area.scheduledDate?.toLocaleDateString('pt-BR')}:</b> {area.endereco}</p>
                                ))}
                                <h4 className="font-bold text-blue-400 pt-2">Lote 2</h4>
                                {scheduledLote2.slice(0, 5).map(area => (
                                    <p key={`l2-${area.id}`} className="truncate"><b>{area.scheduledDate?.toLocaleDateString('pt-BR')}:</b> {area.endereco}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const Checkbox: React.FC<{label: string, checked: boolean, onChange: () => void}> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-1 rounded-md">
        <input type="checkbox" checked={checked} onChange={onChange} className="form-checkbox h-4 w-4 bg-gray-700 border-gray-500 rounded text-blue-500 focus:ring-blue-500" />
        <span>{label}</span>
    </label>
);

export default Sidebar;
