import React, { useState } from 'react';
import { MapPin, Save, X, Plus } from 'lucide-react';
import { insertArea } from '../lib/supabase';

interface AreaRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onAreaCreated?: () => void;
}

interface AreaFormData {
  nome: string;
  bairro: string;
  servico: string;
  coordenadas: string;
  observacoes: string;
}

const AreaRegistration: React.FC<AreaRegistrationProps> = ({ 
  isOpen, 
  onClose, 
  onAreaCreated 
}) => {
  const [formData, setFormData] = useState<AreaFormData>({
    nome: '',
    bairro: '',
    servico: '',
    coordenadas: '',
    observacoes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const serviceOptions = [
    { value: 'rocagem_areas_publicas', label: 'Roçagem de Áreas Públicas' },
    { value: 'jardins', label: 'Jardins' },
    { value: 'boa_praca', label: 'Boa Praça' },
    { value: 'varricao', label: 'Varrição' },
    { value: 'manutencao_lagos', label: 'Manutenção Lagos' },
    { value: 'poda', label: 'Poda' },
    { value: 'chafariz', label: 'Chafariz' },
    { value: 'coleta_organico_rejeitos', label: 'Coleta de Orgânico e Rejeitos' },
    { value: 'coleta_reciclaveis', label: 'Coleta de Recicláveis' },
    { value: 'limpezas_especiais', label: 'Limpezas Especiais' },
    { value: 'limpeza_bocas_lobo', label: 'Limpeza de Bocas de Lobo' },
    { value: 'pevs', label: 'PEV\'s' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.bairro || !formData.servico) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Preparar dados para inserção
      const areaData = {
        nome: formData.nome,
        bairro: formData.bairro,
        servico: formData.servico,
        coordenadas: formData.coordenadas || null,
        observacoes: formData.observacoes || null,
        status: 'ativo',
        created_at: new Date().toISOString()
      };

      await insertArea(areaData);
      
      setMessage('Área cadastrada com sucesso!');
      
      // Limpar formulário
      setFormData({
        nome: '',
        bairro: '',
        servico: '',
        coordenadas: '',
        observacoes: ''
      });

      // Notificar componente pai
      if (onAreaCreated) {
        onAreaCreated();
      }

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('Erro ao cadastrar área:', error);
      setMessage('Erro ao cadastrar área. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Plus className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Cadastrar Nova Área</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Área *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Praça Central"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro *
            </label>
            <input
              type="text"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Centro"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviço *
            </label>
            <select
              name="servico"
              value={formData.servico}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um serviço</option>
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordenadas
            </label>
            <input
              type="text"
              name="coordenadas"
              value={formData.coordenadas}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: -23.5505, -46.6333"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Informações adicionais sobre a área..."
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('sucesso') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AreaRegistration;