import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Verificar se as credenciais estão configuradas
if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('⚠️ Credenciais do Supabase não configuradas. Crie um arquivo .env baseado no .env.example')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para as tabelas do Supabase
export interface SupabaseArea {
  id: string
  name: string
  coordinates: number[][]
  status: 'pendente' | 'executando' | 'concluido'
  priority: 'alta' | 'media' | 'baixa'
  team_id?: string
  scheduled_date?: string
  completed_date?: string
  area_size?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface SupabaseTeam {
  id: string
  name: string
  members: string[]
  current_location?: [number, number]
  status: 'disponivel' | 'ocupado' | 'manutencao'
  equipment: string[]
  created_at: string
  updated_at: string
}

export interface SupabaseService {
  id: string
  type: 'rocagem' | 'jardins' | 'limpeza'
  areas: SupabaseArea[]
  created_at: string
  updated_at: string
}

export interface SupabaseHistory {
  id: string
  area_id: string
  team_id: string
  action: 'created' | 'started' | 'completed' | 'cancelled'
  timestamp: string
  notes?: string
  user_id?: string
}

// Funções utilitárias para conversão de dados
export const convertToSupabaseArea = (area: any): Omit<SupabaseArea, 'id' | 'created_at' | 'updated_at'> => ({
  name: area.name,
  coordinates: area.coordinates,
  status: area.status,
  priority: area.priority || 'media',
  team_id: area.teamId,
  scheduled_date: area.scheduledDate,
  completed_date: area.completedDate,
  area_size: area.areaSize,
  notes: area.notes
})

export const convertFromSupabaseArea = (area: SupabaseArea) => ({
  id: area.id,
  name: area.name,
  coordinates: area.coordinates,
  status: area.status,
  priority: area.priority,
  teamId: area.team_id,
  scheduledDate: area.scheduled_date,
  completedDate: area.completed_date,
  areaSize: area.area_size,
  notes: area.notes,
  createdAt: area.created_at,
  updatedAt: area.updated_at
})

// Helper function to insert CSV data into Supabase
export const insertCsvData = async (data: any[]) => {
  try {
    // Transform CSV data to match Supabase schema
    const transformedData = data.map(row => ({
      name: row.address || `Área ${row.id}`,
      coordinates: row.lat && row.lng ? 
        [
          [parseFloat(row.lat), parseFloat(row.lng)],
          [parseFloat(row.lat) + 0.001, parseFloat(row.lng)],
          [parseFloat(row.lat) + 0.001, parseFloat(row.lng) + 0.001],
          [parseFloat(row.lat), parseFloat(row.lng) + 0.001]
        ] : 
        [[-23.3045, -51.1696], [-23.3055, -51.1686], [-23.3065, -51.1696], [-23.3055, -51.1706]],
      status: (row.status?.toLowerCase() === 'concluído' || row.status?.toLowerCase() === 'concluido') ? 'concluido' :
              (row.status?.toLowerCase() === 'em execução' || row.status?.toLowerCase() === 'executando') ? 'executando' : 'pendente',
      priority: 'media',
      area_size: 1000,
      notes: `Importado via CSV - Tipo: ${row.type || 'N/A'}, Equipe: ${row.team || 'N/A'}`
    }));

    const { data: insertedData, error } = await supabase
      .from('areas')
      .insert(transformedData)
      .select();

    if (error) {
      throw error;
    }

    // Log the import in history
    if (insertedData && insertedData.length > 0) {
      const historyEntries = insertedData.map(area => ({
        area_id: area.id,
        action: 'created' as const,
        notes: 'Área criada via importação CSV'
      }));

      await supabase
        .from('history')
        .insert(historyEntries);
    }

    return insertedData;
  } catch (error) {
    console.error('Error inserting CSV data:', error);
    throw error;
  }
};

// Helper function to get all areas
export const getAreas = async () => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

// Helper function to get all teams
export const getTeams = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const clearAllAreas = async (): Promise<void> => {
  const { error } = await supabase
    .from('areas')
    .delete()
    .gt('id', 0); // Delete all records where id > 0 (more reliable condition)

  if (error) {
    console.error('Erro ao limpar áreas:', error);
    throw error;
  }

  console.log('Todas as áreas foram removidas com sucesso');
};

export const insertArea = async (areaData: any): Promise<void> => {
  const { error } = await supabase
    .from('areas')
    .insert([areaData]);

  if (error) {
    console.error('Erro ao inserir área:', error);
    throw error;
  }

  console.log('Área inserida com sucesso');
};