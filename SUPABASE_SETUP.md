# 🚀 Guia de Configuração do Supabase

Este guia te ajudará a configurar o Supabase para o Dashboard de Operações CMTU-LD.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado
- Projeto React/TypeScript funcionando

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha:
   - **Name**: `cmtu-ld-dashboard`
   - **Database Password**: (escolha uma senha forte)
   - **Region**: `South America (São Paulo)` (recomendado para Brasil)
6. Clique em "Create new project"
7. Aguarde a criação (pode levar alguns minutos)

### 2. Configurar Tabelas

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie e cole todo o conteúdo do arquivo `supabase-setup.sql`
4. Clique em "Run" para executar o script
5. Verifique se todas as tabelas foram criadas em **Table Editor**

### 3. Obter Credenciais

1. Vá para **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública)

### 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
   ```

### 5. Testar Conexão

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o console do navegador (F12)
3. Verifique se não há erros de conexão
4. Os dados de exemplo devem aparecer no dashboard

## 📊 Estrutura das Tabelas

### `areas`
- Áreas de trabalho para manutenção urbana
- Coordenadas em formato GeoJSON
- Status: pendente, executando, concluído
- Prioridade: alta, média, baixa

### `teams`
- Equipes responsáveis pelas operações
- Membros e equipamentos
- Localização atual
- Status: disponível, ocupado, manutenção

### `services`
- Tipos de serviços: roçagem, jardins, limpeza
- Relacionamento com áreas

### `history`
- Histórico de todas as ações
- Rastreamento de mudanças
- Logs de operações

## 🔒 Segurança

### Row Level Security (RLS)
As tabelas estão configuradas com RLS habilitado. As políticas atuais permitem todas as operações, mas você pode personalizar conforme necessário.

### Políticas Personalizadas
Para restringir acesso, edite as políticas no **Authentication** → **Policies**.

## 🔄 Sincronização em Tempo Real

O Supabase oferece sincronização em tempo real. Para habilitar:

1. Vá para **Database** → **Replication**
2. Ative as tabelas que deseja sincronizar
3. Use `supabase.channel()` no código para escutar mudanças

## 📱 Funcionalidades Implementadas

✅ **CRUD Completo**
- Criar, ler, atualizar, deletar áreas
- Gerenciar equipes
- Histórico de ações

✅ **Importação CSV**
- Validação de dados
- Inserção em lote
- Log automático no histórico

✅ **Filtros e Buscas**
- Por status (pendente, executando, concluído)
- Por equipe
- Por tipo de serviço

✅ **Hook Personalizado**
- `useSupabaseData()` para gerenciar estado
- Carregamento reativo
- Tratamento de erros

## 🐛 Solução de Problemas

### Erro de Conexão
- Verifique se as credenciais estão corretas no `.env`
- Confirme se o projeto Supabase está ativo
- Verifique a conexão com internet

### Tabelas Não Encontradas
- Execute novamente o script `supabase-setup.sql`
- Verifique se não há erros no SQL Editor

### Dados Não Aparecem
- Confirme se os dados de exemplo foram inseridos
- Verifique o console do navegador para erros
- Teste as consultas no SQL Editor

### Problemas de CORS
- Adicione seu domínio local em **Authentication** → **URL Configuration**
- Para desenvolvimento: `http://localhost:5173`

## 📚 Próximos Passos

1. **Autenticação**: Implementar login/logout
2. **Permissões**: Configurar RLS personalizado
3. **Backup**: Configurar backups automáticos
4. **Monitoramento**: Configurar alertas e logs
5. **Performance**: Otimizar consultas e índices

## 🆘 Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [Discord Supabase](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**🎉 Parabéns!** Seu dashboard agora está conectado ao Supabase com persistência de dados, sincronização em tempo real e todas as funcionalidades modernas de um banco de dados na nuvem!