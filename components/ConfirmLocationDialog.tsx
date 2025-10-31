import React, { useState, useEffect } from 'react';
import { LatLng } from 'leaflet';
import { getSimpleAddress } from '../src/services/geocoding';

interface ConfirmLocationDialogProps {
  isOpen: boolean;
  areaName: string;
  oldCoordinates: LatLng;
  newCoordinates: LatLng;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmLocationDialog: React.FC<ConfirmLocationDialogProps> = ({
  isOpen,
  areaName,
  oldCoordinates,
  newCoordinates,
  onConfirm,
  onCancel
}) => {
  const [newAddress, setNewAddress] = useState<string>('Carregando...');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && newCoordinates) {
      setIsLoading(true);
      getSimpleAddress(newCoordinates.lat, newCoordinates.lng)
        .then(address => {
          setNewAddress(address || 'Endereço não encontrado');
        })
        .catch(() => {
          setNewAddress('Erro ao obter endereço');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, newCoordinates]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">
          Confirmar Nova Localização
        </h3>
        
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-gray-300 text-sm">Área:</p>
            <p className="text-white font-medium">{areaName}</p>
          </div>
          
          <div>
            <p className="text-gray-300 text-sm">Coordenadas anteriores:</p>
            <p className="text-gray-400 text-sm">
              {oldCoordinates.lat.toFixed(6)}, {oldCoordinates.lng.toFixed(6)}
            </p>
          </div>
          
          <div>
            <p className="text-gray-300 text-sm">Novas coordenadas:</p>
            <p className="text-white text-sm">
              {newCoordinates.lat.toFixed(6)}, {newCoordinates.lng.toFixed(6)}
            </p>
          </div>
          
          <div>
            <p className="text-gray-300 text-sm">Novo endereço:</p>
            <p className="text-white text-sm">
              {isLoading ? (
                <span className="text-yellow-400">Carregando...</span>
              ) : (
                newAddress
              )}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Carregando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLocationDialog;