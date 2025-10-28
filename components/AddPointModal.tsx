import React, { useState } from 'react';
import { ServiceId } from '../types';

interface AddPointModalProps {
    serviceId: ServiceId;
    onClose: () => void;
    onAddArea: (serviceId: ServiceId, details: { endereco: string, tipo: string }) => void;
}

const serviceTitles: Record<ServiceId, string> = {
    descarteIrregular: "Novo Ponto de Descarte Irregular",
    areaAdotada: "Nova Área Pública Adotada",
    rocagem: "Nova Área de Roçagem",
    jardins: "Nova Área de Jardinagem",
    limpeza: "Nova Área de Limpeza",
    lagos: "Nova Área de Lago",
    coleta: "Novo Ponto de Coleta",
}

const AddPointModal: React.FC<AddPointModalProps> = ({ serviceId, onClose, onAddArea }) => {
    const [endereco, setEndereco] = useState('');

    const handleSave = () => {
        if (endereco.trim()) {
            onAddArea(serviceId, { endereco, tipo: serviceTitles[serviceId] || 'Novo Ponto' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[1100]" onClick={onClose}>
            <div className="bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 border border-gray-600/30" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-blue-400">{serviceTitles[serviceId] || 'Adicionar Novo Ponto'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="endereco" className="block text-sm font-medium text-gray-300 mb-1">
                            Descrição / Endereço de Referência
                        </label>
                        <input
                            type="text"
                            id="endereco"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className="w-full bg-gray-700 rounded-md border-gray-600 p-2 text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Terreno baldio na Rua X"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!endereco.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            Salvar Ponto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPointModal;
