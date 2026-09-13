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
  visibility: 'public' | 'private'
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

export interface TripConversation {
  conversation_id: string
  conversation_name: string | null
  member_count: number
  is_member: boolean
}

export interface TripFeedPost {
  id: string
  user_id: string
  content: string | null
  media_url: string | null
  likes_count: number
  comments_count: number
  shares_count: number
  liked_by_me: boolean
  created_at: string
  updated_at: string
}

export interface InvitableFriend {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export interface UserTrip {
  id: string
  title: string
  slug: string | null
  destination: string | null
  start_date: string | null
  end_date: string | null
  cover_url: string | null
  status: string
  participant_count: number
  role: string
  created_at: string
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
  visibility?: 'public' | 'private'
}): Promise<string> {
  const { data, error } = await supabase.rpc('create_trip', {
    p_title: params.title,
    p_description: params.description ?? null,
    p_destination: params.destination ?? null,
    p_start_date: params.start_date ?? null,
    p_end_date: params.end_date ?? null,
    p_max_participants: params.max_participants ?? null,
    p_visibility: params.visibility ?? 'public',
  })
  if (error) throw new Error('Falha ao criar viagem: ' + error.message)
  return data as string
}

export async function updateTrip(tripId: string, params: {
  title?: string
  description?: string
  destination?: string
  start_date?: string
  end_date?: string
  max_participants?: number
  cover_url?: string
  status?: string
  visibility?: 'public' | 'private'
}): Promise<void> {
  const { error } = await supabase.rpc('update_trip', {
    p_trip_id: tripId,
    p_title: params.title ?? null,
    p_description: params.description ?? null,
    p_destination: params.destination ?? null,
    p_start_date: params.start_date ?? null,
    p_end_date: params.end_date ?? null,
    p_max_participants: params.max_participants ?? null,
    p_cover_url: params.cover_url ?? null,
    p_status: params.status ?? null,
    p_visibility: params.visibility ?? null,
  })
  if (error) throw new Error('Falha ao atualizar viagem: ' + error.message)
}

export async function joinTrip(tripId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('join_trip_with_group', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao entrar na viagem: ' + error.message)
  return data as string | null
}

export async function leaveTrip(tripId: string): Promise<void> {
  const { error } = await supabase.rpc('leave_trip_with_group', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao sair da viagem: ' + error.message)
}

export async function getTripParticipants(tripId: string): Promise<(TripParticipant & { full_name: string | null; avatar_url: string | null })[]> {
  const { data, error } = await supabase
    .from('trip_participants')
    .select('*, profiles!trip_participants_user_id_fkey(full_name, avatar_url)')
    .eq('trip_id', tripId)
    .in('status', ['confirmed', 'pending'])
    .order('role', { ascending: true })

  if (error) throw new Error('Falha ao carregar participantes: ' + error.message)

  return (data ?? []).map((row: any) => ({
    ...row,
    full_name: row.profiles?.full_name ?? null,
    avatar_url: row.profiles?.avatar_url ?? null,
  }))
}

export async function createTripConversation(tripId: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_trip_conversation', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao criar grupo: ' + error.message)
  return data as string
}

export async function getTripConversation(tripId: string): Promise<TripConversation | null> {
  const { data, error } = await supabase.rpc('get_trip_conversation', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao carregar grupo: ' + error.message)
  if (!data || data.length === 0) return null
  return data[0] as TripConversation
}

export async function inviteToTrip(tripId: string, friendId: string): Promise<void> {
  const { error } = await supabase.rpc('invite_to_trip', {
    p_trip_id: tripId,
    p_friend_id: friendId,
  })
  if (error) throw new Error('Falha ao enviar convite: ' + error.message)
}

export async function respondTripInvite(tripId: string, accept: boolean): Promise<void> {
  const { error } = await supabase.rpc('respond_trip_invite', {
    p_trip_id: tripId,
    p_accept: accept,
  })
  if (error) throw new Error('Falha ao responder convite: ' + error.message)
}

export async function removeTripParticipant(tripId: string, userId: string): Promise<void> {
  const { error } = await supabase.rpc('remove_trip_participant', {
    p_trip_id: tripId,
    p_user_id: userId,
  })
  if (error) throw new Error('Falha ao remover participante: ' + error.message)
}

export async function getTripFeed(tripId: string, limit = 20, offset = 0): Promise<TripFeedPost[]> {
  const { data, error } = await supabase.rpc('get_trip_feed', {
    p_trip_id: tripId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw new Error('Falha ao carregar posts: ' + error.message)
  return (data ?? []) as TripFeedPost[]
}

export async function getTripInvitableFriends(tripId: string): Promise<InvitableFriend[]> {
  const { data, error } = await supabase.rpc('get_trip_invitable_friends', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao carregar amigos: ' + error.message)
  return (data ?? []) as InvitableFriend[]
}

export async function listUserTrips(userId?: string, limit = 20, offset = 0): Promise<UserTrip[]> {
  const { data, error } = await supabase.rpc('list_user_trips', {
    p_user_id: userId ?? null,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw new Error('Falha ao carregar viagens: ' + error.message)
  return (data ?? []) as UserTrip[]
}

export async function adminListTrips(limit = 50, offset = 0): Promise<TripListItem[]> {
  const { data, error } = await supabase.rpc('admin_list_trips', {
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw new Error('Falha ao carregar trips: ' + error.message)
  return (data ?? []) as TripListItem[]
}

export async function adminDeleteTrip(tripId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_trip', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao excluir trip: ' + error.message)
}

export async function adminUpdateTripStatus(tripId: string, status: string): Promise<void> {
  const { error } = await supabase.rpc('admin_update_trip_status', {
    p_trip_id: tripId,
    p_status: status,
  })
  if (error) throw new Error('Falha ao atualizar status: ' + error.message)
}
