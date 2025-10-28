import { LatLngTuple } from 'leaflet';

// Main service categories
export type ServiceCategory = 'limpeza_urbana' | 'residuos';

// Updated service IDs to match the new categorization
export type ServiceId = 
  // Limpeza Urbana
  | 'rocagem_areas_publicas' 
  | 'jardins' 
  | 'boa_praca' 
  | 'varricao' 
  | 'manutencao_lagos' 
  | 'poda' 
  | 'chafariz'
  // Resíduos
  | 'coleta_organico_rejeitos' 
  | 'coleta_reciclaveis' 
  | 'limpezas_especiais' 
  | 'limpeza_bocas_lobo' 
  | 'pevs'
  // Legacy/imported
  | 'imported';

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  services: ServiceId[];
}

export interface HistoryEntry {
    date: Date;
    status: string;
}

export interface Area {
    id: number | string;
    ordem?: number;
    tipo: string;
    endereco: string;
    bairro?: string;
    metragem_m2?: number;
    lat: number;
    lng: number;
    lote?: number | null;
    status?: 'Pendente' | 'Em Execução' | 'Concluído';
    history?: HistoryEntry[];
    polygon?: LatLngTuple[] | null;
    scheduledDate?: Date | null;
    servico?: string;
}

export interface Service {
    id: ServiceId;
    name: string;
    category: ServiceCategory;
    areas: Area[];
}

export type TeamType = 'Giro Zero' | 'Acabamento' | 'Coleta' | 'Touceiras' | 'Manutenção' | 'Irrigação';

export interface Team {
    id: number;
    service: ServiceId;
    type: TeamType;
    lote: number | null;
    status: 'Idle' | 'Working';
    currentAreaId: number | string | null;
    location: {
        lat: number;
        lng: number;
    };
}

export interface Database {
    services: Service[];
    teams: Team[];
}

export interface AppConfig {
    mowingProductionRate: {
        lote1: number;
        lote2: number;
    };
}
