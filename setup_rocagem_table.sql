-- Script para limpar e recriar a estrutura do banco de dados
-- Roçagem de Áreas Públicas

-- 1. Deletar tabelas existentes (se existirem)
DROP TABLE IF EXISTS public.coleta CASCADE;
DROP TABLE IF EXISTS public.coleta_areas CASCADE;
DROP TABLE IF EXISTS public.rocagem CASCADE;
DROP TABLE IF EXISTS public.rocagem_areas CASCADE;

-- 2. Criar a nova tabela principal: rocagem_areas_publicas
CREATE TABLE public.rocagem_areas_publicas (
    id SERIAL PRIMARY KEY,
    tipo_item VARCHAR(50) NOT NULL,
    endereco TEXT NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    metragem_m2 DECIMAL(10,2) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    lote INTEGER,
    observacoes TEXT,
    
    -- Campos para gestão de roçagem
    status VARCHAR(20) DEFAULT 'nao_programado' CHECK (status IN ('nao_programado', 'programado', 'em_andamento', 'concluido', 'cancelado')),
    prioridade INTEGER DEFAULT 1 CHECK (prioridade BETWEEN 1 AND 5), -- 1=baixa, 5=alta
    
    -- Campos para programação
    data_programada DATE,
    data_ultima_rocagem DATE,
    frequencia_dias INTEGER DEFAULT 90, -- frequência padrão de roçagem (90 dias)
    proxima_rocagem_prevista DATE,
    
    -- Campos para controle de roteiro
    roteiro_atual VARCHAR(50), -- ex: "ROTEIRO_A", "ROTEIRO_B"
    ordem_no_roteiro INTEGER, -- ordem dentro do roteiro
    
    -- Histórico de roçagens realizadas
    historico_rocagens JSONB DEFAULT '[]'::jsonb, -- [{data, fiscal, observacoes, fotos}]
    
    -- Campos de auditoria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- 3. Criar tabela para histórico detalhado de roçagens
CREATE TABLE public.historico_rocagens (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL REFERENCES rocagem_areas_publicas(id) ON DELETE CASCADE,
    data_rocagem DATE NOT NULL,
    fiscal_responsavel VARCHAR(100) NOT NULL,
    equipe_responsavel VARCHAR(200),
    observacoes TEXT,
    fotos JSONB DEFAULT '[]'::jsonb, -- URLs das fotos
    tempo_gasto_horas DECIMAL(4,2), -- tempo gasto em horas
    equipamentos_utilizados TEXT,
    condicoes_clima VARCHAR(50), -- sol, chuva, nublado, etc.
    qualidade_servico INTEGER CHECK (qualidade_servico BETWEEN 1 AND 5), -- avaliação da qualidade
    necessita_retorno BOOLEAN DEFAULT FALSE,
    data_retorno_prevista DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100)
);

-- 4. Criar tabela para programação de roteiros
CREATE TABLE public.roteiros_programacao (
    id SERIAL PRIMARY KEY,
    nome_roteiro VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido', 'cancelado')),
    responsavel VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar tabela para itens do roteiro (relação entre roteiro e áreas)
CREATE TABLE public.roteiro_itens (
    id SERIAL PRIMARY KEY,
    roteiro_id INTEGER NOT NULL REFERENCES roteiros_programacao(id) ON DELETE CASCADE,
    area_id INTEGER NOT NULL REFERENCES rocagem_areas_publicas(id) ON DELETE CASCADE,
    ordem_execucao INTEGER NOT NULL,
    data_programada DATE,
    status VARCHAR(20) DEFAULT 'programado' CHECK (status IN ('programado', 'em_andamento', 'concluido', 'cancelado', 'reagendado')),
    prioridade INTEGER DEFAULT 1 CHECK (prioridade BETWEEN 1 AND 5),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(roteiro_id, area_id) -- uma área não pode estar duplicada no mesmo roteiro
);
-- 6. Criar índices para melhor performance
CREATE INDEX idx_rocagem_areas_bairro ON public.rocagem_areas_publicas(bairro);
CREATE INDEX idx_rocagem_areas_status ON public.rocagem_areas_publicas(status);
CREATE INDEX idx_rocagem_areas_data_programada ON public.rocagem_areas_publicas(data_programada);
CREATE INDEX idx_rocagem_areas_proxima_rocagem ON public.rocagem_areas_publicas(proxima_rocagem_prevista);
CREATE INDEX idx_rocagem_areas_roteiro ON public.rocagem_areas_publicas(roteiro_atual);

-- Índices para histórico de roçagens
CREATE INDEX idx_historico_area_id ON public.historico_rocagens(area_id);
CREATE INDEX idx_historico_data_rocagem ON public.historico_rocagens(data_rocagem);
CREATE INDEX idx_historico_fiscal ON public.historico_rocagens(fiscal_responsavel);

-- Índices para roteiros
CREATE INDEX idx_roteiros_status ON public.roteiros_programacao(status);
CREATE INDEX idx_roteiros_data_inicio ON public.roteiros_programacao(data_inicio);

-- Índices para itens do roteiro
CREATE INDEX idx_roteiro_itens_roteiro_id ON public.roteiro_itens(roteiro_id);
CREATE INDEX idx_roteiro_itens_area_id ON public.roteiro_itens(area_id);
CREATE INDEX idx_roteiro_itens_data_programada ON public.roteiro_itens(data_programada);
CREATE INDEX idx_roteiro_itens_status ON public.roteiro_itens(status);

-- 4. Criar função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Criar trigger para atualizar updated_at
CREATE TRIGGER update_rocagem_areas_updated_at 
    BEFORE UPDATE ON public.rocagem_areas_publicas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar RLS (Row Level Security) se necessário
ALTER TABLE public.rocagem_areas_publicas ENABLE ROW LEVEL SECURITY;

-- 7. Criar política para permitir acesso público (ajustar conforme necessário)
CREATE POLICY "Allow public access" ON public.rocagem_areas_publicas
    FOR ALL USING (true);

-- 8. Comentários na tabela e campos
COMMENT ON TABLE public.rocagem_areas_publicas IS 'Tabela para gerenciar áreas públicas que necessitam de roçagem';
COMMENT ON COLUMN public.rocagem_areas_publicas.tipo_item IS 'Tipo da área (área pública, praça, canteiros, etc.)';
COMMENT ON COLUMN public.rocagem_areas_publicas.endereco IS 'Endereço ou localização da área';
COMMENT ON COLUMN public.rocagem_areas_publicas.bairro IS 'Bairro onde está localizada a área';
COMMENT ON COLUMN public.rocagem_areas_publicas.metragem_m2 IS 'Área em metros quadrados';
COMMENT ON COLUMN public.rocagem_areas_publicas.latitude IS 'Coordenada de latitude';
COMMENT ON COLUMN public.rocagem_areas_publicas.longitude IS 'Coordenada de longitude';
COMMENT ON COLUMN public.rocagem_areas_publicas.lote IS 'Número do lote (quando aplicável)';
COMMENT ON COLUMN public.rocagem_areas_publicas.observacoes IS 'Observações adicionais sobre a área';
COMMENT ON COLUMN public.rocagem_areas_publicas.status IS 'Status atual da roçagem (nao_programado, programado, em_andamento, concluido, cancelado)';
COMMENT ON COLUMN public.rocagem_areas_publicas.historico_rocagens IS 'Histórico de roçagens realizadas em formato JSON';