# Dashboard Operacional CMTU-LD

## Descrição

Dashboard operacional visual e centrado em mapa para a Companhia Municipal de Trânsito e Urbanização de Londrina (CMTU-LD), destinado ao Prefeito e equipe de gestão. O sistema permite o monitoramento e gerenciamento de operações de roçagem e manutenção de jardins na cidade de Londrina.

## Funcionalidades

### 🗺️ Visualização em Mapa
- **Mapa interativo** centrado em Londrina usando Leaflet.js
- **Visualização por status** com cores distintas:
  - 🔴 **Crítico** (Atrasado) - Vermelho
  - 🟢 **Em Execução** - Verde vibrante com animação pulsante
  - 🟡 **Hoje** - Amarelo
  - 🟡 **Próximos 3 Dias** - Amarelo claro
  - 🔵 **Próxima Semana** - Azul claro
  - 🟢 **Concluído Recente** - Verde escuro
  - ⚫ **Pendente** - Cinza

### 📋 Gerenciamento de Áreas
- **Cadastro de novas áreas** com informações detalhadas
- **Desenho de polígonos** diretamente no mapa usando Leaflet.draw
- **Visualização de detalhes** através de modais interativos
- **Histórico completo** de ações realizadas em cada área

### 📅 Agendamento Automático
- **Cálculo automático** de cronograma de roçagem
- **Consideração de dias úteis** (pula fins de semana)
- **Baseado em produtividade** configurável (m²/dia)
- **Organização por lotes** e ordem de execução

### 👥 Gestão de Equipes
- **Visualização de equipes** no mapa com ícones customizados
- **Status das equipes** (Ativo/Idle) com opacidade diferenciada
- **Atribuição de equipes** às áreas de trabalho
- **Informações detalhadas** de cada equipe

### 🔍 Filtros e Camadas
- **Filtros por tipo**: Roçagem Lote 1, Roçagem Lote 2, Jardins, Equipes
- **Controle de visibilidade** individual de cada camada
- **Interface intuitiva** com checkboxes na sidebar

### 📱 Interface Responsiva
- **Design moderno** usando Tailwind CSS
- **Sidebar recolhível** para otimização do espaço
- **Compatível com desktop e mobile**
- **Modais informativos** sem uso de alert/prompt

## Tecnologias Utilizadas

- **HTML5** - Estrutura da aplicação
- **Tailwind CSS** (via CDN) - Estilização moderna e responsiva
- **Leaflet.js** (via CDN) - Biblioteca de mapas interativos
- **Leaflet.draw** (via CDN) - Ferramentas de desenho no mapa
- **Vanilla JavaScript (ES6+)** - Lógica da aplicação
- **OpenStreetMap** - Tiles do mapa

## Como Executar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com a internet (para carregar as bibliotecas via CDN)

### Instalação
1. **Clone ou baixe** o arquivo `index.html`
2. **Abra o arquivo** diretamente no navegador
3. **Pronto!** O dashboard estará funcionando

### Execução Local
```bash
# Opção 1: Abrir diretamente no navegador
# Clique duas vezes no arquivo index.html

# Opção 2: Usar um servidor local simples (opcional)
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (se tiver o http-server instalado)
npx http-server

# Depois acesse: http://localhost:8000
```

## Estrutura do Projeto

```
operacoes_dashboard/
├── index.html          # Arquivo principal (auto-contido)
└── README.md          # Esta documentação
```

### Estrutura do Código

O arquivo `index.html` contém toda a aplicação organizada em seções:

#### 📄 HTML
- **Container principal** com layout flexível
- **Sidebar** com filtros, agendamento e cadastro
- **Área do mapa** ocupando o restante da tela
- **Modal** para detalhes e ações das áreas

#### 🎨 CSS
- **Tailwind CSS** para estilização base
- **Estilos customizados** para animações e transições
- **Classes de status** para cores dinâmicas
- **Responsividade** para diferentes tamanhos de tela

#### ⚙️ JavaScript
- **APP_CONFIG**: Configurações globais da aplicação
- **db**: Base de dados simulada (services e teams)
- **Funções de agendamento**: calculateMowingSchedule(), addBusinessDays()
- **Funções de renderização**: renderAreas(), renderTeams()
- **Funções de interação**: modais, filtros, desenho
- **Event listeners**: inicialização e interações do usuário

## Dados Simulados

### Configuração (APP_CONFIG)
```javascript
{
    mowingProductionRate: 5000, // m²/dia
    center: [-23.3045, -51.1696], // Londrina
    zoom: 12
}
```

### Áreas de Serviço (db.services)
- **Área Central - Praça** (Roçagem Lote 1, Em Execução)
- **Parque Municipal** (Roçagem Lote 1, Hoje)
- **Jardim Botânico** (Jardins, Pendente)

### Equipes (db.teams)
- **Equipe Alpha** (Roçagem, Ativo, 4 membros)
- **Equipe Beta** (Roçagem, Idle, 3 membros)
- **Equipe Jardins** (Jardins, Idle, 2 membros)

## Funcionalidades Detalhadas

### 🎯 Agendamento Inteligente
A função `calculateMowingSchedule()` implementa um algoritmo que:
1. **Filtra áreas** de roçagem pendentes
2. **Agrupa por lote** (1 ou 2)
3. **Ordena por sequência** definida
4. **Calcula dias necessários** baseado na metragem e produtividade
5. **Agenda considerando dias úteis** (pula sábados e domingos)
6. **Atualiza status** automaticamente baseado nas datas

### 🎨 Sistema de Cores por Status
- **Crítico**: Áreas com data agendada no passado
- **Em Execução**: Áreas atualmente sendo trabalhadas (com animação)
- **Hoje**: Áreas agendadas para o dia atual
- **Próximos 3 Dias**: Áreas agendadas para os próximos 3 dias
- **Próxima Semana**: Áreas agendadas para a próxima semana
- **Concluído**: Áreas finalizadas recentemente
- **Pendente**: Áreas sem agendamento definido

### 🖱️ Interações do Usuário
- **Clique em área**: Abre modal com detalhes e ações
- **Desenhar polígono**: Ativa ferramenta de desenho
- **Filtros**: Controla visibilidade das camadas
- **Sidebar**: Recolhe/expande para otimizar espaço
- **Modais**: Interface rica sem popups intrusivos

### 📊 Gestão de Equipes
- **Visualização no mapa**: Ícones com número de membros
- **Status visual**: Opacidade reduzida para equipes ociosas
- **Atribuição inteligente**: Apenas equipes compatíveis e disponíveis
- **Rastreamento**: Histórico de atribuições nas áreas

## Melhorias Futuras Sugeridas

### 🔄 Persistência de Dados
- **Integração com banco de dados** (PostgreSQL, MySQL)
- **API REST** para operações CRUD
- **Sincronização em tempo real** entre usuários
- **Backup automático** dos dados

### 📱 Funcionalidades Mobile
- **App nativo** ou PWA (Progressive Web App)
- **Geolocalização** das equipes em tempo real
- **Notificações push** para atualizações importantes
- **Modo offline** para áreas sem conectividade

### 📈 Analytics e Relatórios
- **Dashboard de métricas** (produtividade, tempo médio, etc.)
- **Relatórios automáticos** em PDF
- **Gráficos de performance** por equipe e período
- **Previsões** baseadas em dados históricos

### 🔐 Segurança e Autenticação
- **Sistema de login** com diferentes níveis de acesso
- **Auditoria completa** de todas as ações
- **Criptografia** de dados sensíveis
- **Integração com Active Directory**

### 🌐 Integração Externa
- **API de clima** para planejamento
- **Integração com GPS** das equipes
- **Notificações via WhatsApp/SMS**
- **Integração com sistemas municipais**

### 🎨 Interface Avançada
- **Temas personalizáveis** (claro/escuro)
- **Mapas satelitais** como opção
- **Medição de distâncias** no mapa
- **Exportação de mapas** em alta resolução

## Suporte e Manutenção

### 🐛 Resolução de Problemas
- **Console do navegador**: Verifique erros JavaScript
- **Conexão internet**: Necessária para carregar bibliotecas CDN
- **Navegador atualizado**: Use versões recentes para melhor compatibilidade

### 🔧 Personalização
- **Cores**: Modifique a função `getStatusColor()`
- **Coordenadas**: Ajuste `APP_CONFIG.center` para sua cidade
- **Produtividade**: Altere `APP_CONFIG.mowingProductionRate`
- **Dados**: Modifique o objeto `db` para seus dados reais

### 📞 Contato
Para suporte técnico ou melhorias, entre em contato com a equipe de desenvolvimento.

---

**Dashboard CMTU-LD** - Desenvolvido para otimizar a gestão operacional urbana de Londrina.