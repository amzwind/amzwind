import { supabase, type Tables } from './supabase'

export type Trip = Tables<'trips'>
export type TripParticipant = Tables<'trip_participants'>

export interface TripListItem {
  id: string
  title: string
  slug: string | null
  description: string | null
  destination: string | null
  start_date: string | null
  end_date: string | null
  cover_url: string | null
  status: string
  max_participants: number | null
  created_by: string
  created_at: string
  updated_at: string
  participant_count: number
  is_participant: boolean
}

export interface TripDetail extends TripListItem {
  creator_name: string | null
  creator_avatar: string | null
}

export async function listTrips(limit = 20, offset = 0): Promise<TripListItem[]> {
  const { data, error } = await supabase.rpc('list_trips', {
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw new Error('Falha ao carregar viagens: ' + error.message)
  return (data ?? []) as TripListItem[]
}

export async function getTrip(tripId: string): Promise<TripDetail | null> {
  const { data, error } = await supabase.rpc('get_trip', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao carregar viagem: ' + error.message)
  if (!data || data.length === 0) return null
  return data[0] as TripDetail
}

export async function createTrip(params: {
  title: string
  description?: string
  destination?: string
  start_date?: string
  end_date?: string
  max_participants?: number
}): Promise<string> {
  const { data, error } = await supabase.rpc('create_trip', {
    p_title: params.title,
    p_description: params.description ?? null,
    p_destination: params.destination ?? null,
    p_start_date: params.start_date ?? null,
    p_end_date: params.end_date ?? null,
    p_max_participants: params.max_participants ?? null,
  })
  if (error) throw new Error('Falha ao criar viagem: ' + error.message)
  return data as string
}

export async function joinTrip(tripId: string): Promise<void> {
  const { error } = await supabase.rpc('join_trip', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao entrar na viagem: ' + error.message)
}

export async function leaveTrip(tripId: string): Promise<void> {
  const { error } = await supabase.rpc('leave_trip', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao sair da viagem: ' + error.message)
}

export async function getTripParticipants(tripId: string): Promise<(TripParticipant & { full_name: string | null; avatar_url: string | null })[]> {
  const { data, error } = await supabase
    .from('trip_participants')
    .select('*, profiles!trip_participants_user_id_fkey(full_name, avatar_url)')
    .eq('trip_id', tripId)
    .eq('status', 'confirmed')
    .order('role', { ascending: true })

  if (error) throw new Error('Falha ao carregar participantes: ' + error.message)

  return (data ?? []).map((row: any) => ({
    ...row,
    full_name: row.profiles?.full_name ?? null,
    avatar_url: row.profiles?.avatar_url ?? null,
  }))
}
