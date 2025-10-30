# 📊 Script de Inserção de Áreas de Coleta

Este script permite inserir dados de áreas de coleta no Supabase baseado em informações extraídas de imagens.

## 🚀 Como Usar

### 1. Configuração Inicial

1. **Instalar dependências:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configurar Supabase:**
   - Abra o arquivo `insert_coleta_data.js`
   - Substitua `'https://your-project-url.supabase.co'` pela URL do seu projeto
   - Substitua `'your-anon-key'` pela sua chave anônima do Supabase

### 2. Preparação dos Dados

1. **Envie as imagens em lotes** (50-100 linhas por vez)
2. **Eu extrairei os dados** e fornecerei no formato correto
3. **Você copiará os dados** para o array `coletaAreas` no script

### 3. Formato dos Dados

Cada área deve ter a seguinte estrutura:

```javascript
{
    tipo: 'Coleta Seletiva',           // Tipo da área
    endereco: 'Rua das Flores, 123',   // Endereço completo
    bairro: 'Centro',                   // Nome do bairro
    area_m2: 150.5,                     // Área em metros quadrados
    lote: 'A-001',                      // Código do lote
    status: 'ativo',                    // Status: 'ativo', 'inativo', 'manutencao'
    coordinates: [                      // Coordenadas do polígono (longitude, latitude)
        [-46.633308, -23.550520],
        [-46.633200, -23.550600],
        [-46.633100, -23.550500],
        [-46.633308, -23.550520]       // Primeiro e último ponto devem ser iguais
    ]
}
```

### 4. Executar o Script

```bash
node insert_coleta_data.js
```

## 🔍 Validações

O script inclui validações automáticas para:
- ✅ Campos obrigatórios preenchidos
- ✅ Área em m² maior que 0
- ✅ Coordenadas com pelo menos 3 pontos
- ✅ Formato correto dos dados

## 📝 Processo Recomendado

1. **Lote 1:** Envie 50-100 linhas de imagem
2. **Extração:** Eu extraio os dados e formato para o script
3. **Inserção:** Você executa o script para inserir o lote
4. **Repetir:** Continue com os próximos lotes

## ⚠️ Importante

- **Backup:** Sempre faça backup antes de executar
- **Teste:** Teste com poucos dados primeiro
- **Coordenadas:** Certifique-se de que as coordenadas estão corretas
- **Duplicatas:** O script não verifica duplicatas automaticamente

## 🛠️ Troubleshooting

### Erro de Conexão
- Verifique as credenciais do Supabase
- Confirme se a URL está correta

### Erro de Validação
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme o formato das coordenadas

### Rate Limiting
- O script inclui pausas entre inserções
- Se necessário, aumente o tempo de pausa

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de erro no console
2. Confirme a estrutura dos dados
3. Teste com um único registro primeiro