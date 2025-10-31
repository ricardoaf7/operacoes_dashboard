import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config_supabase.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Função para converter dados do Supabase para o formato do sistema
function convertSupabaseToSystemFormat(supabaseData) {
    return supabaseData.map((area, index) => {
        // Mapear status do Supabase para o formato do sistema
        const statusMap = {
            'nao_programado': 'Pendente',
            'programado': 'Hoje',
            'em_andamento': 'Em Execução',
            'concluido': 'Concluído'
        };

        return {
            id: area.id,
            name: `${area.endereco} - ${area.bairro}`,
            type: 'Roçagem Áreas Públicas',
            lote: area.lote,
            ordem: index + 1,
            metragem_m2: area.metragem_m2,
            status: statusMap[area.status] || 'Pendente',
            scheduledDate: area.data_programada ? new Date(area.data_programada) : null,
            completedDate: area.data_ultima_rocagem ? new Date(area.data_ultima_rocagem) : null,
            coordinates: [area.latitude, area.longitude],
            polygon: null, // Pode ser expandido futuramente
            assignedTeam: null, // Pode ser expandido futuramente
            endereco: area.endereco,
            bairro: area.bairro,
            prioridade: area.prioridade,
            frequencia_dias: area.frequencia_dias,
            proxima_rocagem_prevista: area.proxima_rocagem_prevista,
            observacoes: area.observacoes,
            history: [
                { 
                    date: new Date(area.created_at), 
                    action: 'Área cadastrada', 
                    user: 'Sistema' 
                }
            ]
        };
    });
}

// Função principal para carregar dados
async function loadRocagemData() {
    try {
        console.log('🔄 Carregando dados do Supabase...');
        
        const { data, error } = await supabase
            .from('rocagem_areas_publicas')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('❌ Erro ao carregar dados:', error);
            return null;
        }

        console.log(`✅ ${data.length} áreas carregadas do Supabase`);
        
        // Converter para o formato do sistema
        const convertedData = convertSupabaseToSystemFormat(data);
        
        return {
            services: convertedData,
            teams: [
                {
                    id: 1,
                    name: 'Equipe Alpha',
                    type: 'Roçagem',
                    status: 'Disponível',
                    coordinates: [-23.3045, -51.1696],
                    members: ['João Silva', 'Pedro Santos'],
                    specialty: 'Roçagem de áreas públicas'
                },
                {
                    id: 2,
                    name: 'Equipe Beta',
                    type: 'Roçagem',
                    status: 'Em Campo',
                    coordinates: [-23.3100, -51.1750],
                    members: ['Maria Oliveira', 'Carlos Lima'],
                    specialty: 'Manutenção de jardins'
                }
            ]
        };

    } catch (error) {
        console.error('❌ Erro geral:', error);
        return null;
    }
}

// Exportar para uso no HTML
if (typeof window !== 'undefined') {
    window.loadRocagemData = loadRocagemData;
}

export { loadRocagemData };