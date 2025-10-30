-- Script para limpar tabelas antigas que não serão mais utilizadas
-- Execute este script no SQL Editor do Supabase

-- Deletar tabelas antigas do sistema de coleta
DROP TABLE IF EXISTS public.coleta_history CASCADE;

-- Deletar tabelas antigas do sistema de roçagem  
DROP TABLE IF EXISTS public.rocagem_history CASCADE;

-- Verificar se existem outras tabelas antigas e deletá-las se necessário
-- (Adicione aqui outras tabelas que você vê na interface mas não quer manter)

-- Listar tabelas restantes para verificação
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;