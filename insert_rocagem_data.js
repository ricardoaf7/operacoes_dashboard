import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config_supabase.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Dados extraídos da imagem fornecida
const rocagemData = [
    {
        tipo_item: 'area publica',
        endereco: 'av jorge casoni + terminal rodoviario',
        bairro: 'casoni',
        metragem_m2: 29184.94,
        latitude: -23.3044266,
        longitude: -51.1513729,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90, // padrão de 3 meses
        prioridade: 3 // média
    },
    {
        tipo_item: 'praca',
        endereco: 'rua jorge + cirurgioes',
        bairro: 'casoni',
        metragem_m2: 2332.62,
        latitude: -23.3045262,
        longitude: -51.1485067,
        lote: 1,
        observacoes: null,
        frequencia_dias: 60, // praças mais frequentes
        prioridade: 4
    },
    {
        tipo_item: 'praca',
        endereco: 'jorge casoni d/ guaicurus',
        bairro: 'motorazzo',
        metragem_m2: 244.25,
        latitude: -23.3044266,
        longitude: -51.1513729,
        lote: 1,
        observacoes: null,
        frequencia_dias: 60,
        prioridade: 3
    },
    {
        tipo_item: 'area publica',
        endereco: 'costas d/ terreos (praca/ laterais ao lado praca)',
        bairro: 'motorazzo',
        metragem_m2: 680.09,
        latitude: -23.3423444,
        longitude: -51.1606731,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 2
    },
    {
        tipo_item: 'canteiros',
        endereco: 'av jorge casoni (duas laterais canteiro rua subida)',
        bairro: 'casoni',
        metragem_m2: 482.16,
        latitude: -23.3528976,
        longitude: -51.1494482,
        lote: 1,
        observacoes: null,
        frequencia_dias: 45, // canteiros precisam de mais manutenção
        prioridade: 4
    },
    {
        tipo_item: 'area publica',
        endereco: 'rua tupiniquins (duas laterais)',
        bairro: 'casoni',
        metragem_m2: 150,
        latitude: -23.3528976,
        longitude: -51.1494482,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 2
    },
    {
        tipo_item: 'area publica',
        endereco: 'rua tupiniquins c/ passelo (duas laterais) av graci vela',
        bairro: 'casoni',
        metragem_m2: 560.00,
        latitude: -23.2957873,
        longitude: -51.1545458,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 3
    },
    {
        tipo_item: 'area publica',
        endereco: 'jorge casoni d/ camacam e elevante (lateral) av graci vela',
        bairro: 'jose',
        metragem_m2: 722.44,
        latitude: -23.2949574,
        longitude: -51.1471296,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 3
    },
    {
        tipo_item: 'area publica',
        endereco: 'jorge casoni (da casoni ate saturno de brito e rua sa',
        bairro: 'casoni',
        metragem_m2: 908.50,
        latitude: -23.29649,
        longitude: -51.145814,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 3
    },
    {
        tipo_item: 'praca',
        endereco: 'vital brasil e osvaldo cruz',
        bairro: 'jose',
        metragem_m2: 2434.69,
        latitude: -23.2798879,
        longitude: -51.2309766,
        lote: 1,
        observacoes: null,
        frequencia_dias: 60,
        prioridade: 4
    },
    {
        tipo_item: 'lote publico',
        endereco: 'lods',
        bairro: 'sao caetano',
        metragem_m2: 438.56,
        latitude: -23.3014941,
        longitude: -51.1550653,
        lote: 1,
        observacoes: null,
        frequencia_dias: 120, // lotes menos frequentes
        prioridade: 2
    },
    {
        tipo_item: 'lote publico',
        endereco: 'terreos',
        bairro: 'portuguesa',
        metragem_m2: 348,
        latitude: -23.3023947,
        longitude: -51.154633,
        lote: 1,
        observacoes: null,
        frequencia_dias: 120,
        prioridade: 2
    },
    {
        tipo_item: 'praca',
        endereco: 'tiete e john kennedy',
        bairro: 'recreio',
        metragem_m2: 1975.41,
        latitude: -23.2953414,
        longitude: -51.1587735,
        lote: 1,
        observacoes: null,
        frequencia_dias: 60,
        prioridade: 4
    },
    {
        tipo_item: 'praca',
        endereco: 'tiete e duque de caxias 2 pracas',
        bairro: 'recreio',
        metragem_m2: 2457.00,
        latitude: -23.3273806,
        longitude: -51.1540579,
        lote: 1,
        observacoes: 'São 2 praças próximas',
        frequencia_dias: 60,
        prioridade: 4
    },
    {
        tipo_item: 'area publica',
        endereco: 'av duque de caxias d/ r caetano munhoz da rocha',
        bairro: 'recreio',
        metragem_m2: 411.75,
        latitude: -23.3154575,
        longitude: -51.1531198,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 3
    },
    {
        tipo_item: 'lotes',
        endereco: 'lotes antonio vicente (rua mario l. e teodoro ate av lucia h',
        bairro: 'varias',
        metragem_m2: 3479.42,
        latitude: -23.2864407,
        longitude: -51.1585819,
        lote: 1,
        observacoes: 'Múltiplos lotes em sequência',
        frequencia_dias: 120,
        prioridade: 2
    },
    {
        tipo_item: 'fundo de vale',
        endereco: 'r angelo vincenti (rua mario l. e teodoro ate av lucia h',
        bairro: 'santa monica',
        metragem_m2: 7795.78,
        latitude: -23.2865557,
        longitude: -51.1584695,
        lote: 1,
        observacoes: 'Área de fundo de vale',
        frequencia_dias: 180, // fundos de vale menos frequentes
        prioridade: 1
    },
    {
        tipo_item: 'praca',
        endereco: 'rua carlos rotman',
        bairro: 'jd progresso',
        metragem_m2: 874.57,
        latitude: -23.2904896,
        longitude: -51.1587738,
        lote: 1,
        observacoes: null,
        frequencia_dias: 60,
        prioridade: 4
    },
    {
        tipo_item: 'fundo de vale',
        endereco: 'zacaria de goes (da lucia h a viviana ate o final)',
        bairro: 'jd paulista',
        metragem_m2: 2552.80,
        latitude: -23.2904896,
        longitude: -51.1587728,
        lote: 1,
        observacoes: 'Fundo de vale extenso',
        frequencia_dias: 180,
        prioridade: 1
    },
    {
        tipo_item: 'area publica',
        endereco: 'coelho neto (do campo de futebol ate alga de acesso b',
        bairro: 'progresso',
        metragem_m2: 26568.99,
        latitude: -23.2900568,
        longitude: -51.1529714,
        lote: 1,
        observacoes: 'Área extensa próxima ao campo de futebol',
        frequencia_dias: 90,
        prioridade: 3
    },
    {
        tipo_item: 'viela',
        endereco: 'carlos rotman',
        bairro: 'jd progresso',
        metragem_m2: 226.61,
        latitude: -23.2921294,
        longitude: -51.1529431,
        lote: 1,
        observacoes: null,
        frequencia_dias: 120,
        prioridade: 2
    },
    {
        tipo_item: 'viela',
        endereco: 'chefe newton',
        bairro: 'jd progresso',
        metragem_m2: 236.96,
        latitude: -23.2649983,
        longitude: -51.1581851,
        lote: 1,
        observacoes: null,
        frequencia_dias: 120,
        prioridade: 2
    },
    {
        tipo_item: 'laterais',
        endereco: 'lucia h. goncalves vieira c/ visconde de guarapuava',
        bairro: 'jd paschoa contoni',
        metragem_m2: 703.48,
        latitude: -23.2874127,
        longitude: -51.1550694,
        lote: 1,
        observacoes: null,
        frequencia_dias: 90,
        prioridade: 3
    },
    {
        tipo_item: 'fundo de vale',
        endereco: 'r antonio vicente (rua mario l. e teodoro ate av lucia h',
        bairro: 'varias',
        metragem_m2: 10125.36,
        latitude: -23.2590149,
        longitude: -51.1520293,
        lote: 1,
        observacoes: 'Grande área de fundo de vale',
        frequencia_dias: 180,
        prioridade: 1
    },
    {
        tipo_item: 'praca',
        endereco: 'mario novaes e jose mauricio da silva',
        bairro: 'portal itamaraca',
        metragem_m2: 5276.97,
        latitude: -23.2857066,
        longitude: -51.1503428,
        lote: 1,
        observacoes: null,
        frequencia_dias: 60,
        prioridade: 4
    },
    {
        tipo_item: 'laterais',
        endereco: 'gina luminosa muro espernat',
        bairro: 'nova ampara',
        metragem_m2: 1991.69,
        latitude: -23.3752828,
        longitude: -51.1224945,
        lote: 1,
        observacoes: 'Área lateral com muro',
        frequencia_dias: 90,
        prioridade: 2
    }
];

async function insertRocagemData() {
    try {
        console.log('Iniciando inserção dos dados de roçagem...');
        
        // Calcular próxima roçagem prevista baseada na frequência
        const dataAtual = new Date();
        const rocagemDataWithDates = rocagemData.map(item => ({
            ...item,
            proxima_rocagem_prevista: new Date(dataAtual.getTime() + (item.frequencia_dias * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        }));
        
        const { data, error } = await supabase
            .from('rocagem_areas_publicas')
            .insert(rocagemDataWithDates)
            .select();

        if (error) {
            console.error('Erro ao inserir dados:', error);
            return;
        }

        console.log(`✅ ${data.length} áreas de roçagem inseridas com sucesso!`);
        
        // Mostrar resumo por bairro
        const resumoPorBairro = {};
        data.forEach(item => {
            if (!resumoPorBairro[item.bairro]) {
                resumoPorBairro[item.bairro] = { count: 0, area_total: 0 };
            }
            resumoPorBairro[item.bairro].count++;
            resumoPorBairro[item.bairro].area_total += parseFloat(item.metragem_m2);
        });
        
        console.log('\n📊 Resumo por bairro:');
        Object.entries(resumoPorBairro).forEach(([bairro, info]) => {
            console.log(`${bairro}: ${info.count} áreas, ${info.area_total.toFixed(2)} m²`);
        });
        
        // Mostrar próximas roçagens
        console.log('\n📅 Próximas roçagens programadas:');
        const proximasRocagens = data
            .sort((a, b) => new Date(a.proxima_rocagem_prevista) - new Date(b.proxima_rocagem_prevista))
            .slice(0, 5);
            
        proximasRocagens.forEach(item => {
            console.log(`${item.proxima_rocagem_prevista} - ${item.endereco} (${item.bairro})`);
        });

    } catch (error) {
        console.error('Erro geral:', error);
    }
}

// Executar a inserção
insertRocagemData();