# CMTU-LD - Dashboard Operacional

## 📋 Descrição

O Dashboard Operacional CMTU-LD é uma aplicação web moderna e responsiva desenvolvida para gerenciar as operações urbanas da Companhia Municipal de Trânsito e Urbanização de Londrina. O sistema oferece uma interface visual centrada em mapas para monitoramento e controle de serviços de roçagem de áreas públicas e manutenção de jardins.

## ✨ Características Principais

- **Interface Centrada em Mapas**: Visualização geográfica completa usando Leaflet.js
- **Sistema de Agendamento Inteligente**: Cálculo automático de cronogramas baseado em produtividade
- **Gestão de Equipes**: Monitoramento em tempo real do status e localização das equipes
- **Controles Visuais**: Sistema de cores baseado em status e prioridades
- **Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Localização Brasileira**: Totalmente em português brasileiro

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **Tailwind CSS**: Framework CSS utilitário via CDN
- **Leaflet.js**: Biblioteca de mapas interativos via CDN
- **Leaflet.draw**: Plugin para desenho de polígonos via CDN
- **JavaScript ES6+**: Lógica da aplicação em vanilla JavaScript

## 📁 Estrutura do Projeto

```
operacoes_dashboard/
├── dashboard.html          # Arquivo principal da aplicação
└── README.md              # Documentação do projeto
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para CDNs)

### Execução
1. Clone ou baixe o repositório
2. Abra o arquivo `dashboard.html` diretamente no navegador
3. A aplicação estará pronta para uso

**Nota**: Não é necessário servidor web ou processo de build. O arquivo é totalmente auto-contido.

## 📖 Manual de Uso

### Interface Principal

#### Painel Lateral (Sidebar)
- **Filtros**: Controle de visibilidade das camadas do mapa
- **Planejador**: Configuração de taxas de produção e recálculo de cronogramas
- **Cadastro de Área**: Formulário para adicionar novas áreas de serviço

#### Mapa Principal
- **Visualização Geográfica**: Mapa centrado em Londrina (-23.31, -51.16)
- **Marcadores Coloridos**: Áreas e equipes com cores baseadas em status
- **Interatividade**: Clique em marcadores para abrir detalhes

### Sistema de Cores

| Cor | Status | Descrição |
|-----|--------|-----------|
| 🟢 Verde Brilhante | Em Execução | Serviços atualmente em andamento |
| 🟡 Amarelo | Hoje | Serviços agendados para hoje |
| 🟨 Amarelo Claro | Próximos 3 dias | Serviços nos próximos 3 dias |
| 🔵 Azul Claro | Próxima semana | Serviços na próxima semana |
| 🟢 Verde Escuro | Concluído | Serviços concluídos recentemente |
| ⚫ Cinza | Pendente | Serviços sem agendamento |

### Funcionalidades Principais

#### 1. Agendamento Automático
- Função `calculateMowingSchedule()` calcula cronogramas baseados em:
  - Taxa de produção configurável por lote
  - Metragem das áreas
  - Dias úteis (exclui fins de semana)
  - Ordem de prioridade

#### 2. Gestão de Áreas
- **Visualização**: Marcadores no mapa com tooltips informativos
- **Detalhes**: Modal com informações completas da área
- **Ações**: Iniciar/concluir serviços, atribuir equipes
- **Histórico**: Registro de todas as ações realizadas

#### 3. Controle de Equipes
- **Tipos de Equipe**: Giro Zero, Acabamento, Coleta, Touceiras
- **Status**: Idle (disponível) ou Assigned (atribuída)
- **Localização**: Posicionamento visual no mapa
- **Atribuição**: Associação de equipes a áreas específicas

#### 4. Desenho de Polígonos
- **Leaflet.draw**: Ferramenta para desenhar áreas no mapa
- **Associação**: Vincular polígonos desenhados a áreas cadastradas
- **Edição**: Modificar polígonos existentes

### Dados Simulados

#### Serviços Disponíveis
1. **Roçagem de Áreas Públicas**
   - Lote 1: Taxa padrão 25.000 m²/dia
   - Lote 2: Taxa padrão 20.000 m²/dia
   - Áreas com endereços reais de Londrina

2. **Manutenção de Jardins**
   - Serviços de manutenção e irrigação
   - Localizações estratégicas da cidade

#### Equipes Simuladas
- 4 equipes para Lote 1 (Giro Zero, Acabamento, Coleta, Touceiras)
- 2 equipes para Lote 2 (Giro Zero, Acabamento)
- 2 equipes para jardins (Manutenção, Irrigação)

## 🔧 Configuração

### Taxas de Produção
As taxas de produção podem ser ajustadas no painel "Planejador":
- **Lote 1**: Padrão 25.000 m²/dia
- **Lote 2**: Padrão 20.000 m²/dia

### Filtros de Camadas
Controle a visibilidade de:
- Roçagem (Lote 1 e 2)
- Jardins
- Equipes por tipo

## 📊 Estrutura de Dados

### Configuração da Aplicação
```javascript
APP_CONFIG = {
    mowingProductionRate: {
        lote1: 25000, // m²/dia
        lote2: 20000  // m²/dia
    }
}
```

### Estrutura de Áreas
```javascript
area = {
    id: number,
    ordem: number,
    tipo: string,
    endereco: string,
    bairro: string,
    metragem_m2: number,
    lat: number,
    lng: number,
    lote: number,
    status: string,
    history: array,
    polygon: array,
    scheduledDate: Date
}
```

### Estrutura de Equipes
```javascript
team = {
    id: number,
    service: string,
    type: string,
    lote: number,
    status: string,
    currentAreaId: number,
    location: { lat: number, lng: number }
}
```

## 🎯 Funcionalidades Implementadas

### ✅ Recursos Principais
- [x] Mapa interativo com Leaflet.js
- [x] Sistema de cores baseado em status
- [x] Função de agendamento automático
- [x] Modal de detalhes das áreas
- [x] Controle de filtros/camadas
- [x] Sidebar colapsável
- [x] Cadastro de novas áreas
- [x] Gestão de equipes
- [x] Integração Leaflet.draw
- [x] Localização em português brasileiro
- [x] Design responsivo

### ✅ Recursos Técnicos
- [x] Arquivo único auto-contido
- [x] CDNs para bibliotecas externas
- [x] Dados simulados em memória
- [x] Event listeners organizados
- [x] Documentação JSDoc
- [x] Tratamento básico de erros
- [x] Interface moderna com Tailwind CSS

## 🚧 Limitações Conhecidas

1. **Persistência**: Dados são perdidos ao recarregar a página
2. **Offline**: Requer conexão para CDNs
3. **Escalabilidade**: Dados em memória limitam quantidade de áreas
4. **Validação**: Validação básica de formulários
5. **Backup**: Sem sistema de backup automático

## 🔮 Roadmap Futuro

### Versão 2.0
- [ ] Backend com API REST
- [ ] Banco de dados persistente
- [ ] Autenticação de usuários
- [ ] Relatórios em PDF/Excel

### Versão 3.0
- [ ] Aplicativo móvel
- [ ] Integração GPS em tempo real
- [ ] Notificações push
- [ ] Dashboard analítico

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação técnica

## 🏛️ Sobre a CMTU-LD

A Companhia Municipal de Trânsito e Urbanização de Londrina é responsável pela gestão do trânsito e manutenção urbana da cidade de Londrina, Paraná. Este dashboard foi desenvolvido para otimizar as operações de manutenção de áreas verdes e espaços públicos.

---

**Desenvolvido para CMTU-LD | Londrina - PR | Brasil** 🇧🇷