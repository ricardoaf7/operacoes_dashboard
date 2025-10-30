import { LatLngTuple } from 'leaflet';

export type ServiceId = 'rocagem' | 'jardins' | 'limpeza' | 'lagos' | 'coleta' | 'descarteIrregular' | 'areaAdotada';

export interface HistoryEntry {
    date: Date;
    status: string;
}

export interface Area {
    id: number;
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
    lastServiceDate?: Date | null;
    servico?: string;
}

export interface Service {
    id: ServiceId;
    name: string;
    areas: Area[];
}

export type TeamType = 'Giro Zero' | 'Acabamento' | 'Coleta' | 'Touceiras' | 'Manutenção' | 'Irrigação';

export interface Team {
    id: number;
    service: ServiceId;
    type: TeamType;
    lote: number | null;
    status: 'Idle' | 'Working';
    currentAreaId: number | null;
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
