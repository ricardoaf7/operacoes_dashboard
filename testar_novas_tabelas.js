import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config_supabase.js';

console.log('\n🔍 TESTANDO NOVAS TABELAS DO SISTEMA DE ROÇAGEM');
console.log('='.repeat(50));

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

async function testarTabelas() {
    try {
        console.log('\n📋 Testando tabela: rocagem_areas_publicas');
        const { data: areas, error: areasError } = await supabase
            .from('rocagem_areas_publicas')
            .select('*')
            .limit(1);
        
        if (areasError) {
            console.log('❌ Erro:', areasError.message);
        } else {
            console.log('✅ Tabela rocagem_areas_publicas: OK');
            console.log(`   Registros encontrados: ${areas.length}`);
        }

        console.log('\n📋 Testando tabela: historico_rocagens');
        const { data: historico, error: historicoError } = await supabase
            .from('historico_rocagens')
            .select('*')
            .limit(1);
        
        if (historicoError) {
            console.log('❌ Erro:', historicoError.message);
        } else {
            console.log('✅ Tabela historico_rocagens: OK');
            console.log(`   Registros encontrados: ${historico.length}`);
        }

        console.log('\n📋 Testando tabela: roteiros_programacao');
        const { data: roteiros, error: roteirosError } = await supabase
            .from('roteiros_programacao')
            .select('*')
            .limit(1);
        
        if (roteirosError) {
            console.log('❌ Erro:', roteirosError.message);
        } else {
            console.log('✅ Tabela roteiros_programacao: OK');
            console.log(`   Registros encontrados: ${roteiros.length}`);
        }

        console.log('\n📋 Testando tabela: roteiro_itens');
        const { data: itens, error: itensError } = await supabase
            .from('roteiro_itens')
            .select('*')
            .limit(1);
        
        if (itensError) {
            console.log('❌ Erro:', itensError.message);
        } else {
            console.log('✅ Tabela roteiro_itens: OK');
            console.log(`   Registros encontrados: ${itens.length}`);
        }

        console.log('\n🎉 TESTE CONCLUÍDO!');
        console.log('\nPróximos passos:');
        console.log('1. Execute limpar_tabelas_antigas.sql no Supabase');
        console.log('2. Execute: node insert_rocagem_data.js');
        
    } catch (error) {
        console.log('❌ Erro geral:', error.message);
    }
}

testarTabelas();