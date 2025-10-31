import { useState, useCallback, useEffect } from 'react';
import { db as initialDb, APP_CONFIG as initialAppConfig } from '../data';
import { AppConfig, Database, ServiceId } from '../types';
import { produce } from 'immer';
import { LatLng } from 'leaflet';
import { updateAreaCoordinates } from '../src/lib/supabase';

const useAppData = () => {
    const [db, setDb] = useState<Database>(initialDb);
    const [appConfig, setAppConfig] = useState<AppConfig>(initialAppConfig);

    const addWorkDays = (startDate: Date, days: number): Date => {
        let currentDate = new Date(startDate);
        let addedDays = 0;
        while (addedDays < days) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // 0=Sunday, 6=Saturday
                addedDays++;
            }
        }
        return currentDate;
    };

    const calculateMowingSchedule = useCallback(() => {
        setDb(produce(draftDb => {
            const rocagemService = draftDb.services.find(s => s.id === 'rocagem');
            if (!rocagemService) return;

            // --- Lote 1 ---
            let currentDateLote1 = new Date();
            const pendingLote1 = rocagemService.areas
                .filter(a => a.lote === 1 && a.status === 'Pendente')
                .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

            for (const area of pendingLote1) {
                area.scheduledDate = new Date(currentDateLote1);
                const daysToComplete = Math.ceil((area.metragem_m2 || 0) / appConfig.mowingProductionRate.lote1);
                currentDateLote1 = addWorkDays(currentDateLote1, daysToComplete > 0 ? daysToComplete : 1);
            }
            
            // --- Lote 2 ---
            let currentDateLote2 = new Date();
            const pendingLote2 = rocagemService.areas
                .filter(a => a.lote === 2 && a.status === 'Pendente')
                .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

            for (const area of pendingLote2) {
                area.scheduledDate = new Date(currentDateLote2);
                const daysToComplete = Math.ceil((area.metragem_m2 || 0) / appConfig.mowingProductionRate.lote2);
                currentDateLote2 = addWorkDays(currentDateLote2, daysToComplete > 0 ? daysToComplete : 1);
            }
        }));
    }, [appConfig.mowingProductionRate]);
    
    useEffect(() => {
        calculateMowingSchedule();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateMowingProductionRate = useCallback((lote: 1 | 2, rate: number) => {
        setAppConfig(produce(draft => {
            if (lote === 1) draft.mowingProductionRate.lote1 = rate;
            else draft.mowingProductionRate.lote2 = rate;
        }));
        calculateMowingSchedule();
    }, [calculateMowingSchedule]);

    const updateAreaStatus = useCallback((areaId: number, serviceId: ServiceId, status: 'Em Execução' | 'Concluído') => {
        setDb(produce(draftDb => {
            const service = draftDb.services.find(s => s.id === serviceId);
            if (!service) return;
            const area = service.areas.find(a => a.id === areaId);
            if (!area) return;

            area.status = status;
            if (status === 'Concluído') {
                area.history?.push({ date: new Date(), status: 'Concluído' });
            }
        }));

        if (status === 'Concluído' && serviceId === 'rocagem') {
            calculateMowingSchedule();
        }
    }, [calculateMowingSchedule]);
    
    const assignTeamToArea = useCallback((areaId: number, serviceId: ServiceId, teamId: number) => {
        setDb(produce(draftDb => {
            const service = draftDb.services.find(s => s.id === serviceId);
            const area = service?.areas.find(a => a.id === areaId);
            const team = draftDb.teams.find(t => t.id === teamId);
            
            if (area && team) {
                const oldTeam = draftDb.teams.find(t => t.currentAreaId === areaId);
                if(oldTeam) {
                    oldTeam.status = 'Idle';
                    oldTeam.currentAreaId = null;
                }
                
                team.currentAreaId = areaId;
                team.status = 'Working';
                team.location = { lat: area.lat, lng: area.lng };
            }
        }));
    }, []);

    const updateAreaPolygon = useCallback((areaId: number, serviceId: ServiceId, polygon: [number, number][]) => {
         setDb(produce(draftDb => {
            const service = draftDb.services.find(s => s.id === serviceId);
            if (!service) return;
            const area = service.areas.find(a => a.id === areaId);
            if (area) {
                area.polygon = polygon as [number, number][];
            }
        }));
    }, []);

    const updateAreaLocation = useCallback(async (areaId: number, serviceId: ServiceId, latlng: LatLng) => {
        // Atualizar estado local
        setDb(produce(draftDb => {
            const service = draftDb.services.find(s => s.id === serviceId);
            if (!service) return;
            const area = service.areas.find(a => a.id === areaId);
            if (area) {
                area.lat = latlng.lat;
                area.lng = latlng.lng;
            }
        }));

        // Atualizar no Supabase se for uma área de roçagem
        if (serviceId === 'rocagem') {
            try {
                await updateAreaCoordinates(areaId, latlng.lat, latlng.lng);
                console.log(`✅ Localização da área ${areaId} atualizada com sucesso`);
            } catch (error) {
                console.error(`❌ Erro ao atualizar localização da área ${areaId}:`, error);
                // Aqui você pode adicionar uma notificação de erro para o usuário
            }
        }
    }, []);

    const addArea = useCallback((serviceId: ServiceId, details: { endereco: string, tipo: string }, latlng: LatLng) => {
        setDb(produce(draftDb => {
            const service = draftDb.services.find(s => s.id === serviceId);
            if(service){
                const newArea = {
                    id: Date.now(), // Simple unique ID for demo purposes
                    tipo: details.tipo,
                    endereco: details.endereco,
                    lat: latlng.lat,
                    lng: latlng.lng,
                    status: 'Pendente' as const,
                    history: []
                };
                service.areas.push(newArea);
            }
        }));
    }, []);

    return {
        db,
        appConfig,
        updateMowingProductionRate,
        updateAreaStatus,
        assignTeamToArea,
        updateAreaPolygon,
        updateAreaLocation,
        addArea,
    };
};

export default useAppData;
