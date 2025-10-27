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