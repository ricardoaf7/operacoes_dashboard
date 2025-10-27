-- Script SQL para configurar as tabelas do Dashboard de Operações CMTU-LD
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Equipes
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    members TEXT[] DEFAULT '{}',
    current_location POINT,
    status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'ocupado', 'manutencao')),
    equipment TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Áreas
CREATE TABLE areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    coordinates JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'executando', 'concluido')),
    priority VARCHAR(10) DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa')),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    area_size NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Serviços
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('rocagem', 'jardins', 'limpeza')),
    areas UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Histórico
CREATE TABLE history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('created', 'started', 'completed', 'cancelled')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    user_id UUID
);

-- Índices para melhor performance
CREATE INDEX idx_areas_status ON areas(status);
CREATE INDEX idx_areas_team_id ON areas(team_id);
CREATE INDEX idx_areas_created_at ON areas(created_at);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_history_area_id ON history(area_id);
CREATE INDEX idx_history_team_id ON history(team_id);
CREATE INDEX idx_history_timestamp ON history(timestamp);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) - Opcional, para controle de acesso
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir todas as operações (ajuste conforme necessário)
CREATE POLICY "Allow all operations on areas" ON areas FOR ALL USING (true);
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations on history" ON history FOR ALL USING (true);

-- Inserir dados de exemplo para Londrina-PR
INSERT INTO teams (name, members, status, equipment, current_location) VALUES
('Equipe Alpha', ARRAY['João Silva', 'Maria Santos'], 'disponivel', ARRAY['Roçadeira', 'Soprador', 'Caminhão'], POINT(-51.1696, -23.3045)),
('Equipe Beta', ARRAY['Pedro Costa', 'Ana Lima'], 'ocupado', ARRAY['Trator', 'Roçadeira', 'Ferramentas manuais'], POINT(-51.1756, -23.3125)),
('Equipe Gamma', ARRAY['Carlos Oliveira', 'Lucia Ferreira'], 'disponivel', ARRAY['Motosserra', 'Caminhão', 'EPI completo'], POINT(-51.1816, -23.3185));

-- Inserir áreas de exemplo
INSERT INTO areas (name, coordinates, status, priority, team_id, area_size, notes) VALUES
('Parque Arthur Thomas', 
 '[[-23.3045, -51.1696], [-23.3055, -51.1686], [-23.3065, -51.1696], [-23.3055, -51.1706]]'::jsonb,
 'pendente', 'alta', 
 (SELECT id FROM teams WHERE name = 'Equipe Alpha'),
 15000, 'Área verde principal da cidade'),

('Jardim Botânico', 
 '[[-23.3125, -51.1756], [-23.3135, -51.1746], [-23.3145, -51.1756], [-23.3135, -51.1766]]'::jsonb,
 'executando', 'media', 
 (SELECT id FROM teams WHERE name = 'Equipe Beta'),
 8500, 'Manutenção de jardins ornamentais'),

('Lago Igapó', 
 '[[-23.3185, -51.1816], [-23.3195, -51.1806], [-23.3205, -51.1816], [-23.3195, -51.1826]]'::jsonb,
 'concluido', 'baixa', 
 (SELECT id FROM teams WHERE name = 'Equipe Gamma'),
 12000, 'Limpeza das margens concluída'),

('Praça Sete de Setembro', 
 '[[-23.3105, -51.1736], [-23.3115, -51.1726], [-23.3125, -51.1736], [-23.3115, -51.1746]]'::jsonb,
 'pendente', 'media', 
 NULL,
 3500, 'Praça central - manutenção de jardins'),

('Parque Ney Braga', 
 '[[-23.2985, -51.1636], [-23.2995, -51.1626], [-23.3005, -51.1636], [-23.2995, -51.1646]]'::jsonb,
 'pendente', 'alta', 
 NULL,
 18000, 'Grande área verde - roçagem necessária');

-- Inserir serviços
INSERT INTO services (type, areas) VALUES
('rocagem', ARRAY(SELECT id FROM areas WHERE name IN ('Parque Arthur Thomas', 'Parque Ney Braga'))),
('jardins', ARRAY(SELECT id FROM areas WHERE name IN ('Jardim Botânico', 'Praça Sete de Setembro'))),
('limpeza', ARRAY(SELECT id FROM areas WHERE name = 'Lago Igapó'));

-- Inserir histórico de exemplo
INSERT INTO history (area_id, team_id, action, notes) VALUES
((SELECT id FROM areas WHERE name = 'Lago Igapó'), 
 (SELECT id FROM teams WHERE name = 'Equipe Gamma'), 
 'completed', 'Limpeza das margens realizada com sucesso'),

((SELECT id FROM areas WHERE name = 'Jardim Botânico'), 
 (SELECT id FROM teams WHERE name = 'Equipe Beta'), 
 'started', 'Iniciada manutenção dos jardins ornamentais'),

((SELECT id FROM areas WHERE name = 'Parque Arthur Thomas'), 
 (SELECT id FROM teams WHERE name = 'Equipe Alpha'), 
 'created', 'Área cadastrada para roçagem');

-- Comentários para documentação
COMMENT ON TABLE areas IS 'Áreas de trabalho para operações de manutenção urbana';
COMMENT ON TABLE teams IS 'Equipes responsáveis pelas operações';
COMMENT ON TABLE services IS 'Tipos de serviços oferecidos';
COMMENT ON TABLE history IS 'Histórico de ações realizadas nas áreas';

COMMENT ON COLUMN areas.coordinates IS 'Coordenadas do polígono da área em formato GeoJSON';
COMMENT ON COLUMN areas.area_size IS 'Tamanho da área em metros quadrados';
COMMENT ON COLUMN teams.current_location IS 'Localização atual da equipe (latitude, longitude)';
COMMENT ON COLUMN teams.equipment IS 'Lista de equipamentos disponíveis para a equipe';