// Configuração do Supabase
// IMPORTANTE: Substitua pelas suas credenciais reais do projeto Supabase

export const SUPABASE_CONFIG = {
    // ⬇️ SUBSTITUA pela URL do seu projeto (ex: https://abc123def.supabase.co)
    url: 'https://rwfolmphjmuyqocetitv.supabase.co',
    
    // ⬇️ SUBSTITUA pela sua chave anon public (começa com eyJhbGciOiJIUzI1NiIs...)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Zm9sbXBoam11eXFvY2V0aXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjA2MTcsImV4cCI6MjA3NzIzNjYxN30.O1ll_msQWobgghQAg0TA5s4Xl7ZrOJNYKOXJ0zDS8B8'
};

// 📋 EXEMPLO DE COMO DEVE FICAR (com suas credenciais reais):
/*
export const SUPABASE_CONFIG = {
    url: 'https://xyzabc123.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk5OTk5OTk5LCJleHAiOjIwMTU1NzU5OTl9.exemplo_da_sua_chave_real'
};
*/

// Para encontrar suas credenciais:
// 1. Acesse https://supabase.com/dashboard
// 2. Selecione seu projeto
// 3. Vá em Settings > API
// 4. Copie a URL e a chave anon public

console.log(`
🔧 CONFIGURAÇÃO DO SUPABASE
============================

Para usar este script, você precisa:

1. Acessar: https://supabase.com/dashboard
2. Selecionar seu projeto
3. Ir em Settings > API
4. Copiar:
   - URL do projeto
   - Chave anon public

5. Substituir no arquivo config_supabase.js:
   - url: 'https://SEU_PROJETO_ID.supabase.co'
   - anonKey: 'sua_chave_anon_aqui'

6. Executar o SQL do arquivo setup_rocagem_table.sql no SQL Editor do Supabase

Depois disso, você pode rodar:
- node test_supabase.js (para testar conexão)
- node insert_rocagem_data.js (para inserir dados)
`);