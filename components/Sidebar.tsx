import React, { useState, useRef } from 'react';
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
  Edit3,
  Upload
} from 'lucide-react';
import { Database } from '../types';

interface SidebarProps {
  database: any;
  visibleLayers: { [key: string]: boolean };
  onLayerToggle: (layer: string) => void;
  onAreaClick: (areaId: string, serviceId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onCsvImport?: (areas: any[]) => void;
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
  onToggle,
  onCsvImport
}) => {
  const [expandedSections, setExpandedSections] = useState({
    rocagem: false,
    jardins: false,
    outros: false,
    equipes: false,
    status: false,
    importar: false
  });

  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const processCSVFile = (file: File) => {
    const reader = new FileReader();
    
    setImportStatus('Processando arquivo...');
    
    reader.onload = function(e) {
      try {
        const csv = e.target?.result as string;
        
        if (!csv || csv.trim() === '') {
          throw new Error('Arquivo CSV está vazio');
        }
        
        // Detecta o separador (vírgula, ponto e vírgula, ou tab)
        let separator = ',';
        if (csv.includes(';') && csv.split(';').length > csv.split(',').length) {
          separator = ';';
        } else if (csv.includes('\t')) {
          separator = '\t';
        }
        
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        const importedAreas = [];
        
        // Pula o cabeçalho (primeira linha)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const columns = line.split(separator).map(col => col.trim().replace(/"/g, ''));
            
            // Flexibilidade no número de colunas - mínimo 3 (ID, endereço, coordenadas)
            if (columns.length >= 3) {
              // Tenta encontrar coordenadas nas colunas
              let lat = null, lng = null;
              
              // Procura por coordenadas válidas nas colunas
              for (let j = 0; j < columns.length; j++) {
                const val = parseFloat(columns[j]);
                if (!isNaN(val)) {
                  // Latitude típica do Brasil: -35 a 5
                  if (val >= -35 && val <= 5 && lat === null) {
                    lat = val;
                  }
                  // Longitude típica do Brasil: -75 a -30
                  else if (val >= -75 && val <= -30 && lng === null) {
                    lng = val;
                  }
                }
              }
              
              // Se não encontrou coordenadas válidas, usa coordenadas padrão de Londrina
              if (lat === null || lng === null) {
                lat = -23.31 + (Math.random() - 0.5) * 0.1; // Pequena variação
                lng = -51.16 + (Math.random() - 0.5) * 0.1;
              }
              
              const area = {
                id: columns[0] || `imported_${i}`,
                ordem: i,
                tipo: columns[1] || 'area publica',
                endereco: columns[2] || 'Endereço não informado',
                bairro: columns[3] || 'Bairro não informado',
                metragem_m2: parseFloat(columns[4]) || 1000,
                lat: lat,
                lng: lng,
                lote: 1,
                status: 'Pendente',
                history: [],
                polygon: null,
                scheduledDate: null,
                imported: true
              };
              
              importedAreas.push(area);
            }
          }
        }
        
        if (importedAreas.length === 0) {
          throw new Error('Nenhuma área válida encontrada no arquivo');
        }
        
        // Chama a função de callback para processar as áreas importadas
        if (onCsvImport) {
          onCsvImport(importedAreas);
        }
        
        setImportStatus(`✅ ${importedAreas.length} áreas importadas com sucesso!`);
        
        // Limpa o status após 3 segundos
        setTimeout(() => setImportStatus(''), 3000);
        
        // Limpa o status após 3 segundos
        setTimeout(() => setImportStatus(''), 3000);
        
      } catch (error) {
        console.error('Erro ao processar CSV:', error);
        setImportStatus(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        
        // Limpa o status de erro após 5 segundos
        setTimeout(() => setImportStatus(''), 5000);
      }
    };
    
    reader.onerror = function(error) {
      console.error('Erro ao ler arquivo:', error);
      setImportStatus('❌ Erro ao ler o arquivo');
      setTimeout(() => setImportStatus(''), 5000);
    };
    
    reader.readAsText(file, 'UTF-8');
  };

  const handleFileSelect = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processCSVFile(file);
      } else {
        setImportStatus('❌ Por favor, selecione um arquivo CSV válido');
        setTimeout(() => setImportStatus(''), 3000);
      }
    } else {
      setImportStatus('⚠️ Por favor, selecione um arquivo CSV');
      setTimeout(() => setImportStatus(''), 3000);
    }
  };
  return (
    <div className="sidebar fixed lg:relative z-40 lg:z-auto h-full">
      <style>{`
        .sidebar {
          height: 100vh;
          width: 280px;
          overflow-y: auto;
          background: linear-gradient(135deg, rgba(30, 28, 62, 0.85) 0%, rgba(42, 38, 84, 0.85) 50%, rgba(30, 28, 62, 0.85) 100%);
          backdrop-filter: blur(20px);
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

      {/* Import CSV Section */}
      <div className="form-section">
        <button
          onClick={() => toggleSection('importar')}
          className="w-full flex items-center justify-between text-white text-sm font-semibold mb-2 p-2 rounded hover:bg-white/10 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg group relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
          </div>
          <div className="flex items-center relative z-10">
            <Upload className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="group-hover:text-white/90 transition-colors duration-200">Importar Dados</span>
          </div>
          {expandedSections.importar ? <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />}
        </button>
        {expandedSections.importar && (
          <div className="space-y-3 ml-6">
            <div className="space-y-2">
              <label className="block text-sm text-white/80">Arquivo CSV:</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="w-full text-sm text-white bg-white/10 border border-white/30 rounded-lg p-2 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-white hover:file:bg-white/30 transition-all duration-200"
              />
              <button
                onClick={handleFileSelect}
                className="modern-btn btn-primary w-full"
              >
                <Upload className="mr-2 w-4 h-4" />
                Importar CSV
              </button>
              {importStatus && (
                <div className={`text-sm p-2 rounded ${
                  importStatus.includes('✅') ? 'text-green-400 bg-green-400/10' :
                  importStatus.includes('❌') ? 'text-red-400 bg-red-400/10' :
                  'text-yellow-400 bg-yellow-400/10'
                }`}>
                  {importStatus}
                </div>
              )}
            </div>
          </div>
        )}
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
