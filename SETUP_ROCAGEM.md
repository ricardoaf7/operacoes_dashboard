# 🌱 Setup do Sistema de Roçagem

## 📋 Pré-requisitos

1. **Projeto Supabase ativo**
2. **Node.js instalado**
3. **Dependências instaladas** (`npm install`)

## 🚀 Passo a Passo

### 1️⃣ Configurar Credenciais do Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings > API**
4. Copie:
   - **URL do projeto** (ex: `https://abc123.supabase.co`)
   - **Chave anon public** (começa com `eyJhbGciOiJIUzI1NiIs...`)

5. Edite o arquivo `config_supabase.js` e substitua:
   ```javascript
   export const SUPABASE_CONFIG = {
       url: 'https://SEU_PROJETO_ID.supabase.co',  // ← Sua URL aqui
       anonKey: 'eyJhbGciOiJIUzI1NiIs...'          // ← Sua chave aqui
   };
   ```

### 2️⃣ Criar Estrutura do Banco

1. No Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo do arquivo `setup_rocagem_table.sql`
3. Cole no editor e execute (**Run**)

Isso vai criar:
- ✅ Deletar tabelas antigas (coleta, coleta_areas, rocagem, rocagem_areas)
- ✅ Criar tabela `rocagem_areas_publicas` (dados principais)
- ✅ Criar tabela `historico_rocagens` (histórico detalhado)
- ✅ Criar tabelas de roteiros (`roteiros_programacao`, `roteiro_itens`)
- ✅ Criar índices para performance
- ✅ Configurar triggers e RLS

### 3️⃣ Inserir Dados Iniciais

```bash
# Testar conexão
node test_supabase.js

# Inserir dados da imagem
node insert_rocagem_data.js
```

## 📊 Estrutura Criada

### 🏠 **rocagem_areas_publicas** (Tabela Principal)
- **Dados básicos**: tipo, endereço, bairro, metragem, coordenadas
- **Gestão**: status, prioridade, datas
- **Frequência**: dias entre roçagens, próxima prevista
- **Roteiros**: roteiro atual, ordem de execução

### 📝 **historico_rocagens** (Histórico Detalhado)
- Data da roçagem, fiscal responsável
- Tempo gasto, equipamentos utilizados
- Fotos, condições climáticas
- Qualidade do serviço, necessidade de retorno

### 🗺️ **roteiros_programacao** (Gestão de Roteiros)
- Nome do roteiro, período de execução
- Status, responsável, observações

### 📋 **roteiro_itens** (Itens do Roteiro)
- Relação roteiro ↔ área
- Ordem de execução, data programada
- Status individual por item

## 🎯 Funcionalidades

✅ **Histórico completo** de roçagens por área  
✅ **Programação flexível** de roteiros  
✅ **Reprogramação** quando necessário  
✅ **Controle de frequência** automático  
✅ **Relatórios** de produtividade  
✅ **Gestão de prioridades**  
✅ **Cálculo automático** da próxima roçagem  

## 🔧 Comandos Úteis

```bash
# Testar conexão
node test_supabase.js

# Inserir dados
node insert_rocagem_data.js

# Ver configuração
node config_supabase.js
```

## 📱 Próximos Passos

1. **Interface web** para fiscais registrarem roçagens
2. **Tela de programação** de roteiros
3. **Dashboard** com métricas e relatórios
4. **App mobile** para campo
5. **Integração** com GPS/mapas

## ❓ Problemas Comuns

### Erro "TypeError: fetch failed"
- ✅ Verifique as credenciais no `config_supabase.js`
- ✅ Confirme que o projeto Supabase está ativo
- ✅ Teste a conexão com `node test_supabase.js`

### Erro "relation does not exist"
- ✅ Execute o SQL do `setup_rocagem_table.sql` no Supabase
- ✅ Verifique se as tabelas foram criadas no Dashboard

### Dados não inserem
- ✅ Verifique RLS (Row Level Security) no Supabase
- ✅ Confirme que a chave anon tem permissões