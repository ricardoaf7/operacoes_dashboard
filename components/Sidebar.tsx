import React, { useState } from 'react';
import { 
  Leaf, 
  Flower2, 
  Building2, 
  Users, 
  ChevronDown, 
  ChevronRight,
  Circle,
  Calculator,
  Download,
  Edit3
} from 'lucide-react';
import { Database } from '../types';

interface SidebarProps {
  database: any;
  visibleLayers: { [key: string]: boolean };
  onLayerToggle: (layer: string) => void;
  onAreaClick: (areaId: string, serviceId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer group hover:bg-white/5 p-2 rounded transition-all duration-300 hover:transform hover:translate-x-1 relative overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-slate-300 bg-white/10 border-white/30 rounded focus:ring-white/50 focus:ring-2 accent-slate-300 transition-all duration-200 hover:scale-110 relative z-10"
    />
    <span className="text-sm text-white group-hover:text-white/90 transition-colors duration-200 relative z-10">{label}</span>
  </label>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  database, 
  visibleLayers, 
  onLayerToggle, 
  onAreaClick,
  isOpen,
  onToggle
}) => {
  const [expandedSections, setExpandedSections] = useState({
    rocagem: true,
    jardins: true,
    outros: true,
    equipes: true,
    status: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <div className="sidebar fixed lg:relative z-40 lg:z-auto w-[26rem] h-full">
      <style>{`
        .sidebar {
          height: 100vh;
          width: 280px;
          overflow-y: auto;
          background: linear-gradient(135deg, rgba(30, 28, 62, 0.85) 0%, rgba(42, 38, 84, 0.85) 50%, rgba(30, 28, 62, 0.85) 100%);
          backdrop-filter: blur(20px);
          border-right: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 4px 0 25px rgba(0, 0, 0, 0.4);
          flex-shrink: 0;
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }

        /* Webkit browsers (Chrome, Safari, Edge) */
        .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #475569 0%, #64748b 100%);
          border-radius: 4px;
          border: 1px solid #334155;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #64748b 0%, #94a3b8 100%);
        }

        .sidebar::-webkit-scrollbar-corner {
          background: #1e293b;
        }
        
        .sidebar-header {
          background: linear-gradient(135deg, rgba(30, 28, 62, 0.75) 0%, rgba(42, 38, 84, 0.75) 100%);
          backdrop-filter: blur(25px);
          border-bottom: 2px solid rgba(255, 255, 255, 0.15);
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
        }
        
        .sidebar-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .sidebar-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          margin-top: 0.25rem;
          opacity: 0.9;
        }
        
        .toggle-btn {
          background: linear-gradient(135deg, rgba(30, 28, 62, 0.9) 0%, rgba(42, 38, 84, 0.9) 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        
        .toggle-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .toggle-btn:hover::before {
          left: 100%;
        }
        
        .toggle-btn:hover {
          background: linear-gradient(135deg, rgba(30, 28, 62, 1) 0%, rgba(42, 38, 84, 1) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(30, 28, 62, 0.3);
        }
        
        .section-header {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding: 0 1rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .form-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 0.75rem;
          margin: 0.5rem 1rem 1rem;
          padding: 1rem;
          backdrop-filter: blur(15px);
        }
        
        .form-section h3 {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .form-section h3::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.6s;
        }
        
        .form-section:hover h3::before {
          left: 100%;
        }
        
        .form-section h4 {
          color: #e5e7eb;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          padding: 0.25rem 0;
          border-left: 3px solid rgba(255, 255, 255, 0.4);
          padding-left: 0.75rem;
        }
        
        .modern-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }
        
        .modern-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .modern-btn:hover::before {
          left: 100%;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, rgba(30, 28, 62, 0.9) 0%, rgba(42, 38, 84, 0.9) 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(30, 28, 62, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 28, 62, 0.6);
          background: linear-gradient(135deg, rgba(30, 28, 62, 1) 0%, rgba(42, 38, 84, 1) 100%);
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, rgba(42, 38, 84, 0.9) 0%, rgba(54, 48, 104, 0.9) 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(42, 38, 84, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(42, 38, 84, 0.6);
          background: linear-gradient(135deg, rgba(42, 38, 84, 1) 0%, rgba(54, 48, 104, 1) 100%);
        }
      `}</style>
      
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">CMTU-LD</div>
        <div className="sidebar-subtitle">Dashboard Operacional</div>
        <button onClick={onToggle} className="toggle-btn mt-3">
          ← Ocultar Menu
        </button>
      </div>

      {/* Services Section */}
      <div className="form-section">
        <h3>Serviços</h3>
        
        {/* Roçagem de Áreas Públicas */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('rocagem')}
            className="w-full flex items-center justify-between text-white text-sm font-semibold mb-2 p-2 rounded hover:bg-white/10 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
            </div>
            <div className="flex items-center relative z-10">
              <Leaf className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:text-white/90 transition-colors duration-200">Roçagem de Áreas Públicas</span>
            </div>
            {expandedSections.rocagem ? <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />}
          </button>
          {expandedSections.rocagem && (
            <div className="space-y-2 ml-6">
              <Checkbox label="Roçagem (Lote 1)" checked={visibleLayers.rocagemLote1} onChange={() => onLayerToggle('rocagemLote1')} />
              <Checkbox label="Roçagem (Lote 2)" checked={visibleLayers.rocagemLote2} onChange={() => onLayerToggle('rocagemLote2')} />
            </div>
          )}
        </div>

        {/* Jardins */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('jardins')}
            className="w-full flex items-center justify-between text-white text-sm font-semibold mb-2 p-2 rounded hover:bg-white/10 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
            </div>
            <div className="flex items-center relative z-10">
              <Flower2 className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:text-white/90 transition-colors duration-200">Jardins</span>
            </div>
            {expandedSections.jardins ? <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />}
          </button>
          {expandedSections.jardins && (
            <div className="space-y-2 ml-6">
              <Checkbox label="Manutenção de Jardins" checked={visibleLayers.jardins} onChange={() => onLayerToggle('jardins')} />
            </div>
          )}
        </div>

        {/* Outros Serviços */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('outros')}
            className="w-full flex items-center justify-between text-white text-sm font-semibold mb-2 p-2 rounded hover:bg-white/10 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
            </div>
            <div className="flex items-center relative z-10">
              <Building2 className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:text-white/90 transition-colors duration-200">Outros Serviços</span>
            </div>
            {expandedSections.outros ? <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />}
          </button>
          {expandedSections.outros && (
            <div className="space-y-2 ml-6">
              <Checkbox label="Descarte Irregular" checked={visibleLayers.descarteIrregular} onChange={() => onLayerToggle('descarteIrregular')} />
              <Checkbox label="Áreas Adotadas" checked={visibleLayers.areaAdotada} onChange={() => onLayerToggle('areaAdotada')} />
            </div>
          )}
        </div>

        {/* Equipes */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('equipes')}
            className="w-full flex items-center justify-between text-white text-sm font-semibold mb-2 p-2 rounded hover:bg-white/10 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
            </div>
            <div className="flex items-center relative z-10">
              <Users className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:text-white/90 transition-colors duration-200">Equipes</span>
            </div>
            {expandedSections.equipes ? <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />}
          </button>
          {expandedSections.equipes && (
            <div className="space-y-2 ml-6">
              <Checkbox label="Giro Zero" checked={visibleLayers.teamsGiroZero} onChange={() => onLayerToggle('teamsGiroZero')} />
              <Checkbox label="Acabamento" checked={visibleLayers.teamsAcabamento} onChange={() => onLayerToggle('teamsAcabamento')} />
              <Checkbox label="Coleta (Roçagem)" checked={visibleLayers.teamsColeta} onChange={() => onLayerToggle('teamsColeta')} />
              <Checkbox label="Touceiras" checked={visibleLayers.teamsTouceiras} onChange={() => onLayerToggle('teamsTouceiras')} />
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="form-section">
        <button
          onClick={() => toggleSection('status')}
          className="w-full flex items-center justify-between text-white text-sm font-semibold mb-2 p-2 rounded hover:bg-white/10 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg group relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
          </div>
          <div className="flex items-center relative z-10">
            <Circle className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="group-hover:text-white/90 transition-colors duration-200">Status</span>
          </div>
          {expandedSections.status ? <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />}
        </button>
        {expandedSections.status && (
          <div className="space-y-2 ml-6">
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-all duration-300 hover:transform hover:translate-x-1 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
              <div className="w-3 h-3 bg-gray-500 rounded-full group-hover:scale-110 transition-transform duration-200 relative z-10"></div>
              <span className="text-sm text-white group-hover:text-white/90 transition-colors duration-200 relative z-10">Pendente</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-all duration-300 hover:transform hover:translate-x-1 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full group-hover:scale-110 transition-transform duration-200 relative z-10"></div>
              <span className="text-sm text-white group-hover:text-white/90 transition-colors duration-200 relative z-10">Em Execução</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-all duration-300 hover:transform hover:translate-x-1 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-110 transition-transform duration-200 relative z-10"></div>
              <span className="text-sm text-white group-hover:text-white/90 transition-colors duration-200 relative z-10">Concluído</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="form-section">
        <h3>Ações</h3>
        <div className="space-y-3">
          <button className="modern-btn btn-primary">
            <Calculator className="mr-2 w-4 h-4" />
            Calcular Cronograma
          </button>
          <button className="modern-btn btn-secondary">
            <Download className="mr-2 w-4 h-4" />
            Exportar Dados
          </button>
          <button className="modern-btn btn-primary">
            <Edit3 className="mr-2 w-4 h-4" />
            Desenhar Área
          </button>
        </div>
      </div>

      {/* Services Summary */}
      <div className="form-section">
        <h3>Resumo dos Serviços</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(database.services).map(([serviceId, service]) => (
            <div key={serviceId} className="flex justify-between text-white">
              <span>{service.name}:</span>
              <span>{service.areas.length} áreas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
