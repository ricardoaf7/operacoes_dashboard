const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rwfolmphjmuyqocetitv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Zm9sbXBoam11eXFvY2V0aXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjA2MTcsImV4cCI6MjA3NzIzNjYxN30.O1ll_msQWobgghQAg0TA5s4Xl7ZrOJNYKOXJ0zDS8B8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Dados das áreas de roçagem extraídos da imagem
const coletaAreas = [
    {
        tipo: 'area publica',
        endereco: 'av jorge casoni - terminal rodoviario',
        bairro: 'casoni',
        area_m2: 29184.98,
        lote: 'ROCAGEM-001',
        status: 'ativo',
        coordinates: [[-51.1513729, -23.3044206]]
    },
    {
        tipo: 'praça',
        endereco: 'rua carijos c araruana',
        bairro: 'parana',
        area_m2: 2332.83,
        lote: 'ROCAGEM-002',
        status: 'ativo',
        coordinates: [[-51.1480067, -23.3045262]]
    },
    {
        tipo: 'praça',
        endereco: 'jorge casoni c/ guaicurus',
        bairro: 'matarazzo',
        area_m2: 244.25,
        lote: 'ROCAGEM-003',
        status: 'ativo',
        coordinates: [[-51.1513729, -23.3044206]]
    },
    {
        tipo: 'area publica',
        endereco: 'caetes c/ tembes (praça/ laterais do lado praça)',
        bairro: 'matarazzo',
        area_m2: 680.00,
        lote: 'ROCAGEM-004',
        status: 'ativo',
        coordinates: [[-51.1869931, -23.423468]]
    },
    {
        tipo: 'conteiros',
        endereco: 'av jorge casoni (alça lateral esquina rua guaranis)',
        bairro: 'casoni',
        area_m2: 452.16,
        lote: 'ROCAGEM-005',
        status: 'ativo',
        coordinates: [[-51.1494082, -23.3028976]]
    },
    {
        tipo: 'area publica',
        endereco: 'rua tupiniquins (duas laterais)',
        bairro: 'casoni',
        area_m2: 150,
        lote: 'ROCAGEM-006',
        status: 'ativo',
        coordinates: [[-51.1494082, -23.3028976]]
    },
    {
        tipo: 'area publica',
        endereco: 'rua tapuios c/ oswaldo cruz',
        bairro: 'casoni',
        area_m2: 500.00,
        lote: 'ROCAGEM-007',
        status: 'ativo',
        coordinates: [[-51.1454558, -23.2959873]]
    },
    {
        tipo: 'area publica',
        endereco: 'jorge casoni c/ camacan e alexandre albertoni (2 areas)',
        bairro: 'kase',
        area_m2: 722.44,
        lote: 'ROCAGEM-008',
        status: 'ativo',
        coordinates: [[-51.1471296, -23.2949574]]
    },
    {
        tipo: 'viela',
        endereco: 'jorge casoni (da casoni até saturnino de brito e rua sa)',
        bairro: 'casoni',
        area_m2: 908.80,
        lote: 'ROCAGEM-009',
        status: 'ativo',
        coordinates: [[-51.145814, -23.29849]]
    },
    {
        tipo: 'praça',
        endereco: 'vital brasil c oswaldo cruz',
        bairro: 'kase',
        area_m2: 2434.69,
        lote: 'ROCAGEM-010',
        status: 'ativo',
        coordinates: [[-51.2320966, -23.2908879]]
    },
    {
        tipo: 'lote publico',
        endereco: 'icós',
        bairro: 'são caetano',
        area_m2: 438.56,
        lote: 'ROCAGEM-011',
        status: 'ativo',
        coordinates: [[-51.1550653, -23.3014941]]
    },
    {
        tipo: 'lote publico',
        endereco: 'tembés',
        bairro: 'portuguesa',
        area_m2: 348,
        lote: 'ROCAGEM-012',
        status: 'ativo',
        coordinates: [[-51.154633, -23.3023949]]
    },
    {
        tipo: 'praça',
        endereco: 'tiete c john kennedy',
        bairro: 'recreio',
        area_m2: 1915.41,
        lote: 'ROCAGEM-013',
        status: 'ativo',
        coordinates: [[-51.1589755, -23.2953414]]
    },
    {
        tipo: 'praça',
        endereco: 'tiete c duque de caxias 2 praças',
        bairro: 'recreio',
        area_m2: 2457.00,
        lote: 'ROCAGEM-014',
        status: 'ativo',
        coordinates: [[-51.1540579, -23.3272806]]
    },
    {
        tipo: 'area publica',
        endereco: 'av duque de caxias c/ r. caetano munhoz da rocha',
        bairro: 'recreio',
        area_m2: 411.75,
        lote: 'ROCAGEM-015',
        status: 'ativo',
        coordinates: [[-51.1551198, -23.3154575]]
    },
    {
        tipo: 'lotes',
        endereco: 'irma bona dose c angelo vicentini',
        bairro: 'santa monica',
        area_m2: 3870.42,
        lote: 'ROCAGEM-016',
        status: 'ativo',
        coordinates: [[-51.1585812, -23.2869407]]
    },
    {
        tipo: 'fundo de vale',
        endereco: 'r angelo vicentini (da mario i. v teodoro até av lucia h.)',
        bairro: 'santa monica',
        area_m2: 7195.78,
        lote: 'ROCAGEM-017',
        status: 'ativo',
        coordinates: [[-51.1586495, -23.2865857]]
    },
    {
        tipo: 'praça',
        endereco: 'nilo cairo c matheu leme',
        bairro: 'jd. paulista',
        area_m2: 874.57,
        lote: 'ROCAGEM-018',
        status: 'ativo',
        coordinates: [[-51.1587728, -23.2904896]]
    },
    {
        tipo: 'fundo de vale',
        endereco: 'zacarias neto (do campo de futebol até alça de acesso t)',
        bairro: 'jd. paulista',
        area_m2: 2552.30,
        lote: 'ROCAGEM-019',
        status: 'ativo',
        coordinates: [[-51.1587728, -23.2904896]]
    },
    {
        tipo: 'fundo de vale',
        endereco: 'coelho neto (do campo de futebol até alça de acesso t)',
        bairro: 'jd. progresso',
        area_m2: 26568.99,
        lote: 'ROCAGEM-020',
        status: 'ativo',
        coordinates: [[-51.1529114, -23.2906088]]
    },
    {
        tipo: 'viela',
        endereco: 'carlos rottman',
        bairro: 'jd. progresso',
        area_m2: 229.61,
        lote: 'ROCAGEM-021',
        status: 'ativo',
        coordinates: [[-51.1532831, -23.2921294]]
    },
    {
        tipo: 'viela',
        endereco: 'chefe newton',
        bairro: 'jd. progresso',
        area_m2: 236.96,
        lote: 'ROCAGEM-022',
        status: 'ativo',
        coordinates: [[-51.1881851, -23.2649988]]
    },
    {
        tipo: 'laterais',
        endereco: 'lucio h. gonçalves viana c/ visconde de guarapuava',
        bairro: 'jd. paschool cantoni',
        area_m2: 703.48,
        lote: 'ROCAGEM-023',
        status: 'ativo',
        coordinates: [[-51.1550694, -23.2874127]]
    },
    {
        tipo: 'fundo de vale',
        endereco: 'r antonio vicente de souza e r coelho neto (extensão ta)',
        bairro: 'varios',
        area_m2: 10125.76,
        lote: 'ROCAGEM-024',
        status: 'ativo',
        coordinates: [[-51.1520293, -23.290049]]
    },
    {
        tipo: 'praça',
        endereco: 'mario novaes c jose mauricio da silva',
        bairro: 'portal itamaraca',
        area_m2: 5276.97,
        lote: 'ROCAGEM-025',
        status: 'ativo',
        coordinates: [[-51.1503428, -23.2857056]]
    },
    {
        tipo: 'laterais',
        endereco: 'gino tamiazzo muro epesmet',
        bairro: 'novo amparo',
        area_m2: 1991.69,
        lote: 'ROCAGEM-026',
        status: 'ativo',
        coordinates: [[-51.1326945, -23.3732828]]
    }
];

async function insertColetaAreas() {
    console.log('🚀 Iniciando inserção de áreas de coleta...');
    
    try {
        // Inserir áreas uma por uma para melhor controle
        for (let i = 0; i < coletaAreas.length; i++) {
            const area = coletaAreas[i];
            
            console.log(`📍 Inserindo área ${i + 1}/${coletaAreas.length}: ${area.endereco}`);
            
            const { data, error } = await supabase
                .from('rocagem_areas')
                .insert([{
                    tipo: area.tipo,
                    endereco: area.endereco,
                    bairro: area.bairro,
                    area_m2: area.area_m2,
                    lote: area.lote,
                    status: area.status,
                    coordinates: area.coordinates,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) {
                console.error(`❌ Erro ao inserir área ${area.endereco}:`, error);
            } else {
                console.log(`✅ Área inserida com sucesso: ${area.endereco}`);
            }
            
            // Pequena pausa entre inserções para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('🎉 Inserção concluída!');
        
    } catch (error) {
        console.error('💥 Erro geral:', error);
    }
}

// Função para validar dados antes da inserção
function validateData() {
    console.log('🔍 Validando dados...');
    
    const errors = [];
    
    coletaAreas.forEach((area, index) => {
        if (!area.tipo) errors.push(`Área ${index + 1}: tipo é obrigatório`);
        if (!area.endereco) errors.push(`Área ${index + 1}: endereço é obrigatório`);
        if (!area.bairro) errors.push(`Área ${index + 1}: bairro é obrigatório`);
        if (!area.area_m2 || area.area_m2 <= 0) errors.push(`Área ${index + 1}: área em m² deve ser maior que 0`);
        if (!area.lote) errors.push(`Área ${index + 1}: lote é obrigatório`);
        if (!area.status) errors.push(`Área ${index + 1}: status é obrigatório`);
        if (!area.coordinates || !Array.isArray(area.coordinates) || area.coordinates.length < 1) {
            errors.push(`Área ${index + 1}: coordenadas são obrigatórias`);
        }
    });
    
    if (errors.length > 0) {
        console.error('❌ Erros de validação encontrados:');
        errors.forEach(error => console.error(`  - ${error}`));
        return false;
    }
    
    console.log('✅ Dados válidos!');
    return true;
}

// Função principal
async function main() {
    console.log('📊 Script de Inserção de Áreas de Coleta');
    console.log('=====================================');
    
    if (coletaAreas.length === 0) {
        console.log('⚠️  Nenhum dado encontrado para inserir.');
        console.log('📝 Adicione os dados no array coletaAreas baseado nas imagens.');
        return;
    }
    
    console.log(`📈 Total de áreas para inserir: ${coletaAreas.length}`);
    
    if (!validateData()) {
        return;
    }
    
    // Confirmar antes de inserir
    console.log('⚠️  ATENÇÃO: Este script irá inserir dados no Supabase.');
    console.log('🔧 Certifique-se de que as configurações do Supabase estão corretas.');
    console.log('');
    
    await insertColetaAreas();
}

// Executar script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { insertColetaAreas, validateData };