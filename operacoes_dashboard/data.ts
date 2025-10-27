import { AppConfig, Database } from './types';

export const APP_CONFIG: AppConfig = {
    mowingProductionRate: {
        lote1: 25000, // m²/day
        lote2: 20000  // m²/day
    }
};

export const db: Database = {
    services: [
        {
            id: "rocagem",
            name: "Roçagem de Áreas Públicas",
            areas: [
                { id: 1, ordem: 1, tipo: "area publica", endereco: "av jorge casoni - terminal rodoviario", bairro: "casoni", metragem_m2: 29184.98, lat: -23.3044206, lng: -51.1513729, lote: 1, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 2, ordem: 2, tipo: "praça", endereco: "rua carijós c oraruana", bairro: "paraná", metragem_m2: 2332.83, lat: -23.3045262, lng: -51.1480067, lote: 1, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 3, ordem: 3, tipo: "area publica", endereco: "Av. Arcebispo Dom Geraldo Fernandes, 2200", bairro: "Centro", metragem_m2: 15000, lat: -23.3087, lng: -51.1605, lote: 1, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 4, ordem: 4, tipo: "córrego", endereco: "Córrego Água Fresca", bairro: "Aeroporto", metragem_m2: 32000, lat: -23.2984, lng: -51.1412, lote: 1, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 5, ordem: 5, tipo: "area publica", endereco: "Rua Bélgica, 896", bairro: "Jd Igapó", metragem_m2: 5400, lat: -23.3378, lng: -51.1713, lote: 1, status: "Pendente", history: [], polygon: null, scheduledDate: null },

                { id: 500, ordem: 1, tipo: "praça", endereco: "Praça Nishinomiya", bairro: "Centro Cívico", metragem_m2: 18500, lat: -23.3204, lng: -51.1583, lote: 2, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 501, ordem: 2, tipo: "rotatória", endereco: "Rotatória Av. Ayrton Senna", bairro: "Gleba Palhano", metragem_m2: 8000, lat: -23.3315, lng: -51.1897, lote: 2, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 502, ordem: 3, tipo: "area publica", endereco: "Lago Igapó II", bairro: "Gleba Palhano", metragem_m2: 45000, lat: -23.332, lng: -51.178, lote: 2, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 503, ordem: 4, tipo: "praça", endereco: "Praça dos Sertões", bairro: "Cinco Conjuntos", metragem_m2: 9800, lat: -23.291, lng: -51.185, lote: 2, status: "Pendente", history: [], polygon: null, scheduledDate: null },
                { id: 504, ordem: 5, tipo: "area publica", endereco: "Aterro do Lago Igapó", bairro: "Jd. Bela Suíça", metragem_m2: 22000, lat: -23.327, lng: -51.172, lote: 2, status: "Pendente", history: [], polygon: null, scheduledDate: null },
            ]
        },
        {
            id: "jardins",
            name: "Manutenção de Jardins",
            areas: [
                { id: 1, tipo: "ROT", endereco: "Alameda Julio de Mesquita Filho x Av. Bandeirantes (Moringão)", servico: "Manutenção", lat: -23.321586653652826, lng: -51.16304688242233 },
                { id: 2, tipo: "ROT", endereco: "Av. JK x Av. Higienópolis", servico: "Manutenção", lat: -23.31986607769368, lng: -51.16627462245202 },
                { id: 3, tipo: "FLO", endereco: "Rua Bento Munhoz e Rua Prof. Joaquim de Matos Barreto (Floreiras Lago II)", servico: "Manutenção", lat: -23.326708700423733, lng: -51.17155199259297 },
                { id: 4, tipo: "FLO", endereco: "Rua Bento Munhoz e Rua Prof. Joaquim de Matos Barreto (Floreiras Aterro)", servico: "Irrigação", lat: -23.324004565709696, lng: -51.181099193620554 },
                { id: 5, tipo: "ROT", endereco: "Av. Maringá x Rua Prof. Joaquim de Matos Barreto (Aterro Maior)", servico: "Irrigação", lat: -23.32493443825895, lng: -51.17644905839304 },
                { id: 6, tipo: "ROT", endereco: "Av. Ayrton Senna x Rua Bento Munhoz da Rocha Neto (Aterro Menor)", servico: "Irrigação", lat: -23.326005034323302, lng: -51.17720941696329 },
                { id: 7, tipo: "ROT", endereco: "Av. Ayrton Senna x Av. Ernani de Lacerda Athaíde (Ernani - Gleba)", servico: "Irrigação", lat: -23.33046171734009, lng: -51.17740312139235 },
                { id: 8, tipo: "ROT", endereco: "Av. Ayrton Senna x Av. Madre Leonia Milito (Chafariz da Madre)", servico: "Irrigação", lat: -23.335231473405486, lng: -51.17762034996104 },
                { id: 9, tipo: "ROT", endereco: "Av. Madre Leonia Milito x Rod PR 445 (Oitão da Madre)", servico: "Irrigação", lat: -23.337245718930212, lng: -51.184218729506 },
                { id: 10, tipo: "ROT", endereco: "Av. Harry Prochet x Av. Adhemar Pereira de Barros (Rotary)", servico: "Irrigação", lat: -23.34555849359653, lng: -51.163010924878165 },
                { id: 11, tipo: "ROT", endereco: "Av. Waldemar Spranger x Av. Harry Prochet (Mercado Prochet)", servico: "Irrigação", lat: -23.342776015162247, lng: -51.15991473807532 },
                { id: 12, tipo: "ROT", endereco: "Av. Waldemar Spranger x Rua Bélgica (Cativa)", servico: "Irrigação", lat: -23.34059793146698, lng: -51.15147617841238 },
                { id: 13, tipo: "ROT", endereco: "Av. Heródoto x Rua Bélgica (Barragem)", servico: "Irrigação", lat: -23.338612970121474, lng: -51.15091291451521 },
                { id: 14, tipo: "ROT", endereco: "Av. Duque de Caxias x Av. Inglaterra", servico: "Irrigação", lat: -23.33920071403425, lng: -51.147537700060234 },
                { id: 15, tipo: "ROT", endereco: "Av. Robert Koch x Av. Alziro Zarur (H.U.)", servico: "Irrigação", lat: -23.325306279677, lng: -51.12956314066304 },
                { id: 16, tipo: "ROT", endereco: "Av. dos Pioneiros x Av. das Laranjeiras (Pioneiros)", servico: "Irrigação", lat: -23.311155191425843, lng: -51.12905391535784 },
                { id: 17, tipo: "ROT", endereco: "Av. JK x Av. Santos Dumont (Santos Dumont)", servico: "Irrigação", lat: -23.318712972058588, lng: -51.14778325242933 },
                { id: 18, tipo: "ROT", endereco: "Av. Dez de Dezembro x Av. Theodoro Victorelli (Shopping Boulevard)", servico: "Irrigação", lat: -23.311427880373017, lng: -51.14907739835855 },
                { id: 19, tipo: "ROT", endereco: "Rua Amadeu Mortari (Rodoviária)", servico: "Irrigação", lat: -23.308481759300893, lng: -51.149303665068636 },
                { id: 20, tipo: "ROT", endereco: "Av. Celso Garcia Cid x Rua Minas Gerais", servico: "Irrigação", lat: -23.3120689941553, lng: -51.157705598095994 },
                { id: 21, tipo: "FLO", endereco: "Rua Sergipe (Floreiras entre R. Jacob Bartolomeu Minatti e Pref. Hugo Cabral)", servico: "Irrigação", lat: -23.309818097081614, lng: -51.1595854496206 },
                { id: 22, tipo: "FLO", endereco: "Av. Paraná - Calçadão (Floreiras entre R. Minas Gerais e Pref. Hugo Cabral)", servico: "Irrigação", lat: -23.310933708629477, lng: -51.160941445358674 },
                { id: 23, tipo: "ROT", endereco: "Av. Angelina Ricci Vezozzo x Av. Prefeito Milton Ribeiro de Menezes", servico: "Irrigação", lat: -23.278182050812287, lng: -51.138513370454646 },
                { id: 24, tipo: "ROT", endereco: "Av. Saul Elkind x Rod. Carlos João Strass (Agro Tettus)", servico: "Irrigação", lat: -23.258614442089602, lng: -51.15765478784617 },
                { id: 25, tipo: "ROT", endereco: "Av. Sylvio Barros x Rod. Carlos João Strass", servico: "Irrigação", lat: -23.280530092185906, lng: -51.14918894508608 },
                { id: 26, tipo: "ROT", endereco: "Av. Henrique Mansano x Av. Lucia Helena Gonçalves Vianna (Sanepar)", servico: "Manutenção", lat: -23.282252514107643, lng: -51.15512041073017 },
                { id: 27, tipo: "ROT", endereco: "Av. Winston Churchill x Rua Tanzânia (Term. Ouro Verde)", servico: "Manutenção", lat: -23.28206812922016, lng: -51.17286539977826 },
                { id: 28, tipo: "ROT", endereco: "Av. Winston Churchill x Av. dos Amigos (Term. Ouro Verde)", servico: "Manutenção", lat: -23.28210112487256, lng: -51.17251361804945 },
                { id: 29, tipo: "ROT", endereco: "Av. Rio Branco x Av. Dom Geraldo Fernandes (Eletroluz)", servico: "Manutenção", lat: -23.29928447151832, lng: -51.17348909080396 },
                { id: 30, tipo: "ROT", endereco: "Av. Leste Oeste x Av. Universo (Delegacia Cidadã)", servico: "Manutenção", lat: -23.29706065321076, lng: -51.19035772811406 }
            ]
        },
        { id: "limpeza", name: "Limpeza de Vias", areas: [] },
        { id: "lagos", name: "Manutenção de Lagos", areas: [] },
        { id: "coleta", name: "Coleta de Resíduos", areas: [] },
        { id: "descarteIrregular", name: "Pontos de Descarte Irregular", areas: [] },
        { id: "areaAdotada", name: "Áreas Públicas Adotadas", areas: [] },
    ],
    teams: [
        { id: 1, service: "rocagem", type: "Giro Zero", lote: 1, status: "Idle", currentAreaId: null, location: { lat: -23.30, lng: -51.15 } },
        { id: 2, service: "rocagem", type: "Acabamento", lote: 1, status: "Idle", currentAreaId: null, location: { lat: -23.301, lng: -51.151 } },
        { id: 3, service: "rocagem", type: "Coleta", lote: 1, status: "Idle", currentAreaId: null, location: { lat: -23.302, lng: -51.152 } },
        { id: 4, service: "rocagem", type: "Touceiras", lote: 1, status: "Idle", currentAreaId: null, location: { lat: -23.303, lng: -51.153 } },
        { id: 5, service: "rocagem", type: "Giro Zero", lote: 2, status: "Idle", currentAreaId: null, location: { lat: -23.31, lng: -51.16 } },
        { id: 6, service: "rocagem", type: "Acabamento", lote: 2, status: "Idle", currentAreaId: null, location: { lat: -23.311, lng: -51.161 } },
        { id: 7, service: "jardins", type: "Manutenção", lote: null, status: "Idle", currentAreaId: null, location: { lat: -23.32, lng: -51.17 } },
        { id: 8, service: "jardins", type: "Irrigação", lote: null, status: "Idle", currentAreaId: null, location: { lat: -23.321, lng: -51.171 } },
    ]
};
