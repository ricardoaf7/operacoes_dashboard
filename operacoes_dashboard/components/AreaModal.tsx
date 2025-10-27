
import React, { useState } from 'react';
import { Area, Team, ServiceId } from '../types';

interface AreaModalProps {
    area: Area;
    serviceId: ServiceId;
    teams: Team[];
    onClose: () => void;
    onUpdateStatus: (areaId: number, serviceId: ServiceId, status: 'Em Execução' | 'Concluído') => void;
    onAssignTeam: (areaId: number, serviceId: ServiceId, teamId: number) => void;
}

const AreaModal: React.FC<AreaModalProps> = ({ area, serviceId, teams, onClose, onUpdateStatus, onAssignTeam }) => {
    const [selectedTeam, setSelectedTeam] = useState<string>("");

    const handleAssignClick = () => {
        if (selectedTeam) {
            onAssignTeam(area.id, serviceId, parseInt(selectedTeam, 10));
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1100]" onClick={onClose}>
            <div className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-blue-400">{area.endereco}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">&times;</button>
                </div>

                <div className="space-y-3 text-sm mb-6">
                    <p><strong className="text-gray-400 w-28 inline-block">Bairro:</strong> {area.bairro || 'N/A'}</p>
                    <p><strong className="text-gray-400 w-28 inline-block">Tipo:</strong> {area.tipo}</p>
                    {area.metragem_m2 && <p><strong className="text-gray-400 w-28 inline-block">Área (m²):</strong> {area.metragem_m2.toFixed(2)}</p>}
                    {area.status && <p><strong className="text-gray-400 w-28 inline-block">Status:</strong> {area.status}</p>}
                    {serviceId === 'rocagem' && area.scheduledDate && (
                        <p className="text-yellow-400"><strong className="text-gray-400 w-28 inline-block">Próxima Roçagem:</strong> {new Date(area.scheduledDate).toLocaleDateString('pt-BR')}</p>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-gray-300">Histórico de Serviço</h3>
                    <div className="bg-gray-900 rounded-md p-3 max-h-32 overflow-y-auto text-xs">
                        {area.history && area.history.length > 0 ? (
                            [...area.history].reverse().map((entry, index) => (
                                <p key={index} className="border-b border-gray-700 last:border-b-0 py-1">
                                    {new Date(entry.date).toLocaleString('pt-BR')} - <strong>{entry.status}</strong>
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum histórico registrado.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => onUpdateStatus(area.id, serviceId, 'Em Execução')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500"
                            disabled={area.status === 'Em Execução' || area.status === 'Concluído'}
                        >
                            Iniciar Serviço
                        </button>
                        <button
                            onClick={() => onUpdateStatus(area.id, serviceId, 'Concluído')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500"
                             disabled={area.status !== 'Em Execução'}
                        >
                            Concluir Serviço
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Atribuir Equipe --</option>
                            {teams.filter(t => t.service === serviceId && t.status === 'Idle').map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.type} (ID: {team.id})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssignClick}
                            disabled={!selectedTeam}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Atribuir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreaModal;
