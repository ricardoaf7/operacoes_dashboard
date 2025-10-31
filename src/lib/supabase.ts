import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rwfolmphjmuyqocetitv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Zm9sbXBoam11eXFvY2V0aXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjA2MTcsImV4cCI6MjA3NzIzNjYxN30.O1ll_msQWobgghQAg0TA5s4Xl7ZrOJNYKOXJ0zDS8B8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para a tabela rocagem_areas_publicas
export interface RocagemArea {
  id: number;
  tipo_item: string;
  endereco: string;
  bairro: string;
  metragem_m2: number;
  latitude: number;
  longitude: number;
  lote: number;
  observacoes?: string;
  status: 'nao_programado' | 'programado' | 'em_andamento' | 'concluido';
  prioridade: number;
  data_programada?: string;
  data_ultima_rocagem?: string;
  frequencia_dias: number;
  proxima_rocagem_prevista?: string;
  roteiro_atual?: string;
  ordem_no_roteiro?: number;
  historico_rocagens: any[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Função para buscar todas as áreas de roçagem
export async function fetchRocagemAreas(): Promise<RocagemArea[]> {
  try {
    const { data, error } = await supabase
      .from('rocagem_areas_publicas')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Erro ao buscar áreas de roçagem:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro na função fetchRocagemAreas:', error);
    throw error;
  }
}

// Função para atualizar o status de uma área
export async function updateAreaStatus(id: number, status: RocagemArea['status']): Promise<void> {
  try {
    const { error } = await supabase
      .from('rocagem_areas_publicas')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status da área:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro na função updateAreaStatus:', error);
    throw error;
  }
}

// Função para atualizar as coordenadas de uma área
export async function updateAreaCoordinates(id: number, latitude: number, longitude: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('rocagem_areas_publicas')
      .update({ 
        latitude,
        longitude,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar coordenadas da área:', error);
      throw error;
    }

    console.log(`✅ Coordenadas atualizadas para área ${id}: ${latitude}, ${longitude}`);
  } catch (error) {
    console.error('Erro na função updateAreaCoordinates:', error);
    throw error;
  }
}