import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config_supabase.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com Supabase...');
        
        // Testar conexão básica
        const { data, error } = await supabase
            .from('rocagem_areas_publicas')
            .select('count(*)', { count: 'exact', head: true });

        if (error) {
            console.log('❌ Erro na conexão:', error.message);
            
            // Se a tabela não existe, vamos verificar outras tabelas
            console.log('\n🔍 Verificando tabelas existentes...');
            const { data: tables, error: tablesError } = await supabase
                .rpc('get_table_names');
                
            if (tablesError) {
                console.log('❌ Erro ao listar tabelas:', tablesError.message);
            } else {
                console.log('📋 Tabelas encontradas:', tables);
            }
        } else {
            console.log('✅ Conexão bem-sucedida!');
            console.log(`📊 Registros na tabela rocagem_areas_publicas: ${data || 0}`);
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testConnection();