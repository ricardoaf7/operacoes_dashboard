import { SUPABASE_CONFIG } from './config_supabase.js';

console.log('🔍 VERIFICANDO CONFIGURAÇÃO DO SUPABASE');
console.log('=====================================\n');

// Verificar se as credenciais foram alteradas dos valores padrão
const urlPadrao = 'https://SEU_PROJETO_ID.supabase.co';
const keyPadrao = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SUA_CHAVE_ANON_AQUI';

console.log('📋 Configuração atual:');
console.log(`URL: ${SUPABASE_CONFIG.url}`);
console.log(`Key: ${SUPABASE_CONFIG.anonKey.substring(0, 50)}...`);
console.log('');

// Verificações
let problemas = [];

if (SUPABASE_CONFIG.url === urlPadrao) {
    problemas.push('❌ URL ainda está com valor padrão');
} else if (!SUPABASE_CONFIG.url.includes('.supabase.co')) {
    problemas.push('❌ URL não parece ser válida do Supabase');
} else {
    console.log('✅ URL configurada');
}

if (SUPABASE_CONFIG.anonKey === keyPadrao) {
    problemas.push('❌ Chave ainda está com valor padrão');
} else if (!SUPABASE_CONFIG.anonKey.startsWith('eyJ')) {
    problemas.push('❌ Chave não parece ser um JWT válido');
} else {
    console.log('✅ Chave configurada');
}

if (problemas.length > 0) {
    console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
    problemas.forEach(problema => console.log(problema));
    
    console.log('\n📝 COMO CORRIGIR:');
    console.log('1. Acesse: https://supabase.com/dashboard');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá em Settings > API');
    console.log('4. Copie a URL e a chave anon public');
    console.log('5. Edite o arquivo config_supabase.js');
    console.log('6. Substitua os valores nas linhas 6 e 9');
    
} else {
    console.log('\n🎉 CONFIGURAÇÃO PARECE CORRETA!');
    console.log('Agora você pode testar a conexão com:');
    console.log('node test_supabase.js');
}