import { useState, useEffect, useCallback } from 'react'
import { AreaService, TeamService, HistoryService } from '../lib/database'
import { SupabaseArea, SupabaseTeam, SupabaseHistory } from '../lib/supabase'

interface UseSupabaseDataReturn {
  // Dados
  areas: SupabaseArea[]
  teams: SupabaseTeam[]
  history: SupabaseHistory[]
  
  // Estados de carregamento
  loading: boolean
  areasLoading: boolean
  teamsLoading: boolean
  historyLoading: boolean
  
  // Erros
  error: string | null
  
  // Funções de atualização
  refreshAreas: () => Promise<void>
  refreshTeams: () => Promise<void>
  refreshHistory: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Funções de manipulação
  createArea: (area: Omit<SupabaseArea, 'id' | 'created_at' | 'updated_at'>) => Promise<SupabaseArea>
  updateArea: (id: string, updates: Partial<SupabaseArea>) => Promise<SupabaseArea>
  deleteArea: (id: string) => Promise<void>
  
  createTeam: (team: Omit<SupabaseTeam, 'id' | 'created_at' | 'updated_at'>) => Promise<SupabaseTeam>
  updateTeam: (id: string, updates: Partial<SupabaseTeam>) => Promise<SupabaseTeam>
  deleteTeam: (id: string) => Promise<void>
  
  // Filtros
  getAreasByStatus: (status: 'pendente' | 'executando' | 'concluido') => SupabaseArea[]
  getAreasByTeam: (teamId: string) => SupabaseArea[]
  getAvailableTeams: () => SupabaseTeam[]
}

export function useSupabaseData(): UseSupabaseDataReturn {
  // Estados
  const [areas, setAreas] = useState<SupabaseArea[]>([])
  const [teams, setTeams] = useState<SupabaseTeam[]>([])
  const [history, setHistory] = useState<SupabaseHistory[]>([])
  
  const [areasLoading, setAreasLoading] = useState(true)
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para tratar erros
  const handleError = useCallback((err: any, context: string) => {
    console.error(`Erro em ${context}:`, err)
    setError(`Erro em ${context}: ${err.message || 'Erro desconhecido'}`)
  }, [])

  // Funções de carregamento
  const refreshAreas = useCallback(async () => {
    try {
      setAreasLoading(true)
      setError(null)
      const data = await AreaService.getAll()
      setAreas(data)
    } catch (err) {
      handleError(err, 'carregar áreas')
    } finally {
      setAreasLoading(false)
    }
  }, [handleError])

  const refreshTeams = useCallback(async () => {
    try {
      setTeamsLoading(true)
      setError(null)
      const data = await TeamService.getAll()
      setTeams(data)
    } catch (err) {
      handleError(err, 'carregar equipes')
    } finally {
      setTeamsLoading(false)
    }
  }, [handleError])

  const refreshHistory = useCallback(async () => {
    try {
      setHistoryLoading(true)
      setError(null)
      const data = await HistoryService.getAll()
      setHistory(data)
    } catch (err) {
      handleError(err, 'carregar histórico')
    } finally {
      setHistoryLoading(false)
    }
  }, [handleError])

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshAreas(), refreshTeams(), refreshHistory()])
  }, [refreshAreas, refreshTeams, refreshHistory])

  // Funções de manipulação de áreas
  const createArea = useCallback(async (area: Omit<SupabaseArea, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newArea = await AreaService.create(area)
      setAreas(prev => [newArea, ...prev])
      return newArea
    } catch (err) {
      handleError(err, 'criar área')
      throw err
    }
  }, [handleError])

  const updateArea = useCallback(async (id: string, updates: Partial<SupabaseArea>) => {
    try {
      const updatedArea = await AreaService.update(id, updates)
      setAreas(prev => prev.map(area => area.id === id ? updatedArea : area))
      return updatedArea
    } catch (err) {
      handleError(err, 'atualizar área')
      throw err
    }
  }, [handleError])

  const deleteArea = useCallback(async (id: string) => {
    try {
      await AreaService.delete(id)
      setAreas(prev => prev.filter(area => area.id !== id))
    } catch (err) {
      handleError(err, 'deletar área')
      throw err
    }
  }, [handleError])

  // Funções de manipulação de equipes
  const createTeam = useCallback(async (team: Omit<SupabaseTeam, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTeam = await TeamService.create(team)
      setTeams(prev => [newTeam, ...prev])
      return newTeam
    } catch (err) {
      handleError(err, 'criar equipe')
      throw err
    }
  }, [handleError])

  const updateTeam = useCallback(async (id: string, updates: Partial<SupabaseTeam>) => {
    try {
      const updatedTeam = await TeamService.update(id, updates)
      setTeams(prev => prev.map(team => team.id === id ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      handleError(err, 'atualizar equipe')
      throw err
    }
  }, [handleError])

  const deleteTeam = useCallback(async (id: string) => {
    try {
      await TeamService.delete(id)
      setTeams(prev => prev.filter(team => team.id !== id))
    } catch (err) {
      handleError(err, 'deletar equipe')
      throw err
    }
  }, [handleError])

  // Funções de filtro
  const getAreasByStatus = useCallback((status: 'pendente' | 'executando' | 'concluido') => {
    return areas.filter(area => area.status === status)
  }, [areas])

  const getAreasByTeam = useCallback((teamId: string) => {
    return areas.filter(area => area.team_id === teamId)
  }, [areas])

  const getAvailableTeams = useCallback(() => {
    return teams.filter(team => team.status === 'disponivel')
  }, [teams])

  // Carregar dados iniciais
  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  // Estado de carregamento geral
  const loading = areasLoading || teamsLoading || historyLoading

  return {
    // Dados
    areas,
    teams,
    history,
    
    // Estados de carregamento
    loading,
    areasLoading,
    teamsLoading,
    historyLoading,
    
    // Erros
    error,
    
    // Funções de atualização
    refreshAreas,
    refreshTeams,
    refreshHistory,
    refreshAll,
    
    // Funções de manipulação
    createArea,
    updateArea,
    deleteArea,
    createTeam,
    updateTeam,
    deleteTeam,
    
    // Filtros
    getAreasByStatus,
    getAreasByTeam,
    getAvailableTeams
  }
}