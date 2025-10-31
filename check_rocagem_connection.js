import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config_supabase.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

async function checkRocagemData() {
    try {
        console.log('🔍 Conectando ao Supabase...');
        console.log('URL:', SUPABASE_CONFIG.url);
        
        // Buscar dados da tabela rocagem_areas_publicas
        const { data, error } = await supabase
            .from('rocagem_areas_publicas')
            .select('*')
            .limit(5);

        if (error) {
            console.log('❌ Erro ao buscar dados:', error.message);
            console.log('Detalhes do erro:', error);
        } else {
            console.log('✅ Conexão bem-sucedida!');
            console.log(`📊 Encontrados ${data.length} registros (mostrando primeiros 5):`);
            console.log(JSON.stringify(data, null, 2));
        }

        // Contar total de registros
        const { count, error: countError } = await supabase
            .from('rocagem_areas_publicas')
            .select('*', { count: 'exact', head: true });

        if (!countError) {
            console.log(`📈 Total de registros na tabela: ${count}`);
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

checkRocagemData();