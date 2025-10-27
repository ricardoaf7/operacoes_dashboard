import { supabase, SupabaseArea, SupabaseTeam, SupabaseService, SupabaseHistory, convertToSupabaseArea, convertFromSupabaseArea } from './supabase'

// Serviços para Áreas
export class AreaService {
  // Buscar todas as áreas
  static async getAll(): Promise<SupabaseArea[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Buscar área por ID
  static async getById(id: string): Promise<SupabaseArea | null> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Criar nova área
  static async create(area: Omit<SupabaseArea, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseArea> {
    const { data, error } = await supabase
      .from('areas')
      .insert([area])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Atualizar área
  static async update(id: string, updates: Partial<SupabaseArea>): Promise<SupabaseArea> {
    const { data, error } = await supabase
      .from('areas')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Deletar área
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Buscar áreas por status
  static async getByStatus(status: 'pendente' | 'executando' | 'concluido'): Promise<SupabaseArea[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Buscar áreas por equipe
  static async getByTeam(teamId: string): Promise<SupabaseArea[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// Serviços para Equipes
export class TeamService {
  // Buscar todas as equipes
  static async getAll(): Promise<SupabaseTeam[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  // Buscar equipe por ID
  static async getById(id: string): Promise<SupabaseTeam | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Criar nova equipe
  static async create(team: Omit<SupabaseTeam, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseTeam> {
    const { data, error } = await supabase
      .from('teams')
      .insert([team])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Atualizar equipe
  static async update(id: string, updates: Partial<SupabaseTeam>): Promise<SupabaseTeam> {
    const { data, error } = await supabase
      .from('teams')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Deletar equipe
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Atualizar localização da equipe
  static async updateLocation(id: string, location: [number, number]): Promise<SupabaseTeam> {
    return this.update(id, { current_location: location })
  }

  // Atualizar status da equipe
  static async updateStatus(id: string, status: 'disponivel' | 'ocupado' | 'manutencao'): Promise<SupabaseTeam> {
    return this.update(id, { status })
  }
}

// Serviços para Histórico
export class HistoryService {
  // Buscar histórico completo
  static async getAll(): Promise<SupabaseHistory[]> {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Buscar histórico por área
  static async getByArea(areaId: string): Promise<SupabaseHistory[]> {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('area_id', areaId)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Buscar histórico por equipe
  static async getByTeam(teamId: string): Promise<SupabaseHistory[]> {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('team_id', teamId)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Adicionar entrada no histórico
  static async add(entry: Omit<SupabaseHistory, 'id'>): Promise<SupabaseHistory> {
    const { data, error } = await supabase
      .from('history')
      .insert([entry])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Registrar ação de área
  static async logAreaAction(
    areaId: string, 
    teamId: string, 
    action: 'created' | 'started' | 'completed' | 'cancelled',
    notes?: string,
    userId?: string
  ): Promise<SupabaseHistory> {
    return this.add({
      area_id: areaId,
      team_id: teamId,
      action,
      timestamp: new Date().toISOString(),
      notes,
      user_id: userId
    })
  }
}

// Serviços para Importação CSV
export class ImportService {
  // Importar áreas do CSV
  static async importAreas(areas: any[]): Promise<SupabaseArea[]> {
    const supabaseAreas = areas.map(convertToSupabaseArea)
    
    const { data, error } = await supabase
      .from('areas')
      .insert(supabaseAreas)
      .select()
    
    if (error) throw error
    
    // Registrar no histórico
    for (const area of data) {
      await HistoryService.logAreaAction(
        area.id,
        area.team_id || '',
        'created',
        'Importado via CSV'
      )
    }
    
    return data
  }

  // Validar dados antes da importação
  static validateImportData(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    data.forEach((item, index) => {
      if (!item.name) {
        errors.push(`Linha ${index + 1}: Nome é obrigatório`)
      }
      if (!item.coordinates || !Array.isArray(item.coordinates)) {
        errors.push(`Linha ${index + 1}: Coordenadas são obrigatórias`)
      }
      if (!['pendente', 'executando', 'concluido'].includes(item.status)) {
        errors.push(`Linha ${index + 1}: Status inválido`)
      }
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Função para inicializar dados de exemplo
export async function initializeSampleData() {
  try {
    // Verificar se já existem dados
    const existingAreas = await AreaService.getAll()
    if (existingAreas.length > 0) {
      console.log('Dados já existem no Supabase')
      return
    }

    console.log('Inicializando dados de exemplo no Supabase...')
    
    // Dados de exemplo para Londrina-PR
    const sampleAreas = [
      {
        name: 'Parque Arthur Thomas',
        coordinates: [[-23.3045, -51.1696], [-23.3055, -51.1686], [-23.3065, -51.1696], [-23.3055, -51.1706]],
        status: 'pendente' as const,
        priority: 'alta' as const,
        area_size: 15000,
        notes: 'Área verde principal da cidade'
      },
      {
        name: 'Jardim Botânico',
        coordinates: [[-23.3125, -51.1756], [-23.3135, -51.1746], [-23.3145, -51.1756], [-23.3135, -51.1766]],
        status: 'executando' as const,
        priority: 'media' as const,
        area_size: 8500,
        notes: 'Manutenção de jardins ornamentais'
      },
      {
        name: 'Lago Igapó',
        coordinates: [[-23.3185, -51.1816], [-23.3195, -51.1806], [-23.3205, -51.1816], [-23.3195, -51.1826]],
        status: 'concluido' as const,
        priority: 'baixa' as const,
        area_size: 12000,
        notes: 'Limpeza das margens concluída'
      }
    ]

    const sampleTeams = [
      {
        name: 'Equipe Alpha',
        members: ['João Silva', 'Maria Santos'],
        status: 'disponivel' as const,
        equipment: ['Roçadeira', 'Soprador', 'Caminhão'],
        current_location: [-23.3045, -51.1696] as [number, number]
      },
      {
        name: 'Equipe Beta',
        members: ['Pedro Costa', 'Ana Lima'],
        status: 'ocupado' as const,
        equipment: ['Trator', 'Roçadeira', 'Ferramentas manuais'],
        current_location: [-23.3125, -51.1756] as [number, number]
      }
    ]

    // Criar equipes primeiro
    const createdTeams = await Promise.all(
      sampleTeams.map(team => TeamService.create(team))
    )

    // Associar áreas às equipes
    sampleAreas[0].team_id = createdTeams[0].id
    sampleAreas[1].team_id = createdTeams[1].id

    // Criar áreas
    await Promise.all(
      sampleAreas.map(area => AreaService.create(area))
    )

    console.log('Dados de exemplo criados com sucesso!')
    
  } catch (error) {
    console.error('Erro ao inicializar dados:', error)
    throw error
  }
}