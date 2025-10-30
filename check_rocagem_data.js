import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config_supabase.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

async function checkRocagemData() {
    console.log('🔍 Verificando dados na tabela rocagem_areas_publicas...\n');
    
    try {
        // Verificar se a tabela existe e contar registros
        const { data, error, count } = await supabase
            .from('rocagem_areas_publicas')
            .select('*', { count: 'exact' });
        
        if (error) {
            console.log('❌ Erro ao acessar a tabela:', error.message);
            console.log('📋 Detalhes do erro:', error);
            return;
        }
        
        console.log(`✅ Tabela encontrada!`);
        console.log(`📊 Total de registros: ${count}`);
        
        if (data && data.length > 0) {
            console.log('\n📋 Primeiros 3 registros:');
            data.slice(0, 3).forEach((item, index) => {
                console.log(`${index + 1}. ${item.endereco} (${item.bairro}) - Status: ${item.status}`);
            });
            
            console.log('\n🗺️ Coordenadas dos primeiros registros:');
            data.slice(0, 3).forEach((item, index) => {
                console.log(`${index + 1}. Lat: ${item.latitude}, Lng: ${item.longitude}`);
            });
        } else {
            console.log('⚠️ Nenhum registro encontrado na tabela');
        }
        
    } catch (err) {
        console.log('❌ Erro geral:', err.message);
    }
}

checkRocagemData();