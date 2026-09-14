import { supabase, type Tables } from './supabase'
import { isMissingRpcError } from './rpcDiagnostics'
import { staticTrips, type StaticTrip } from '../data/trips'

export type Trip = Tables<'trips'>
export type TripParticipant = Tables<'trip_participants'>

export interface TripListItem {
  id: string
  title: string
  slug: string | null
  description: string | null
  body_text: string | null
  destination: string | null
  start_date: string | null
  end_date: string | null
  cover_url: string | null
  gallery_urls: string[]
  video_url: string | null
  schedule: Array<{ day: number; title: string; description: string }>
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

/** Helpers for static trip fallback */
function isStaticTrip(idOrSlug: string): StaticTrip | undefined {
  return staticTrips.find((t) => t.id === idOrSlug || t.slug === idOrSlug)
}

function staticTripToDetail(t: StaticTrip): TripDetail {
  return {
    ...staticTripToListItem(t),
    creator_name: 'Equipe Amazon Wind',
    creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  }
}

/** Maps a StaticTrip to TripListItem shape for consistent rendering */
function staticTripToListItem(t: StaticTrip): TripListItem {
  return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    description: t.description,
    body_text: t.body_text,
    destination: t.destination,
    start_date: t.start_date,
    end_date: t.end_date,
    cover_url: t.cover_url,
    gallery_urls: t.gallery_urls,
    video_url: t.video_url,
    schedule: t.schedule,
    status: t.status,
    visibility: t.visibility,
    max_participants: t.max_participants,
    created_by: t.created_by,
    created_at: t.created_at,
    updated_at: t.updated_at,
    participant_count: t.participant_count,
    is_participant: t.is_participant,
  }
}

async function fallbackListTrips(limit = 20, offset = 0): Promise<TripListItem[]> {
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tripsData, error: tripsError } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (tripsError) throw new Error('Falha ao carregar viagens: ' + tripsError.message)

  // If database is empty, return rich local mock data so the UI is never blank
  if (!tripsData || tripsData.length === 0) {
    return staticTrips.slice(offset, offset + limit).map(staticTripToListItem)
  }

  const tripIds = tripsData.map((trip) => trip.id)
  const participantCountMap: Record<string, number> = {}
  const participantTripSet = new Set<string>()

  if (tripIds.length > 0) {
    const { data: participantsData } = await supabase
      .from('trip_participants')
      .select('trip_id, user_id, status')
      .in('trip_id', tripIds)

    for (const participant of participantsData ?? []) {
      if (participant.status === 'cancelled') continue
      participantCountMap[participant.trip_id] = (participantCountMap[participant.trip_id] ?? 0) + 1
      if (user && participant.user_id === user.id) {
        participantTripSet.add(participant.trip_id)
      }
    }
  }

  return tripsData.map((trip) => ({
    ...trip,
    body_text: (trip as Record<string, unknown>).body_text as string | null ?? null,
    gallery_urls: (trip as Record<string, unknown>).gallery_urls as string[] ?? [],
    video_url: (trip as Record<string, unknown>).video_url as string | null ?? null,
    schedule: (trip as Record<string, unknown>).schedule as TripListItem['schedule'] ?? [],
    participant_count: participantCountMap[trip.id] ?? 0,
    is_participant: user ? participantTripSet.has(trip.id) : false,
  })) as TripListItem[]
}

export async function listTrips(limit = 20, offset = 0): Promise<TripListItem[]> {
  try {
    const { data, error } = await supabase.rpc('list_trips', {
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error

    const rows = (data ?? []) as TripListItem[]
    // RPC returned successfully but the database has no seeded trips yet
    if (rows.length === 0) {
      return staticTrips.slice(offset, offset + limit).map(staticTripToListItem)
    }
    return rows
  } catch (error) {
    if (!isMissingRpcError(error)) {
      throw new Error('Falha ao carregar viagens: ' + (error as Error).message)
    }

    return fallbackListTrips(limit, offset)
  }
}

export async function getTrip(tripId: string): Promise<TripDetail | null> {
  const staticMatch = isStaticTrip(tripId)
  if (staticMatch) {
    return staticTripToDetail(staticMatch)
  }

  try {
    const { data, error } = await supabase.rpc('get_trip', { p_trip_id: tripId })
    if (error) {
      if (isMissingRpcError(error)) {
        const { data: tripRow } = await supabase
          .from('trips')
          .select('*')
          .eq('id', tripId)
          .maybeSingle()
        if (!tripRow) return null
        return {
          ...tripRow,
          creator_name: null,
          creator_avatar: null,
          participant_count: 0,
          is_participant: false,
        } as unknown as TripDetail
      }
      throw new Error('Falha ao carregar viagem: ' + error.message)
    }
    if (!data || data.length === 0) return null
    return data[0] as TripDetail
  } catch (err) {
    const fallbackMatch = isStaticTrip(tripId)
    if (fallbackMatch) return staticTripToDetail(fallbackMatch)
    throw err
  }
}

export async function notifyFriendsOfNewTrip(tripId: string, title: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: friendships } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq('status', 'accepted')

    if (!friendships || friendships.length === 0) return

    const friendIds = friendships.map((f) => (f.user_id === user.id ? f.friend_id : f.user_id))
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    const creatorName = profile?.full_name || 'Um rider da comunidade'

    const notifs = friendIds.map((friendId) => ({
      user_id: friendId,
      type: 'new_trip',
      from_user_id: user.id,
      entity_type: 'trip',
      entity_id: tripId,
      content: `${creatorName} organizou uma nova trip: ${title}`,
      read: false,
    }))

    // Inserção com fallback silencioso para não quebrar fluxo caso trigger do banco já tenha tratado
    await supabase.from('notifications').insert(notifs)
  } catch {
    // Fail-safe silencioso
  }
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
  const tripId = data as string
  void notifyFriendsOfNewTrip(tripId, params.title)
  return tripId
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

export async function joinTrip(tripId: string): Promise<void> {
  if (isStaticTrip(tripId)) return
  const { error } = await supabase.rpc('join_trip', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao entrar na viagem: ' + error.message)
}

export async function leaveTrip(tripId: string): Promise<void> {
  if (isStaticTrip(tripId)) return
  const { error } = await supabase.rpc('leave_trip', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao sair da viagem: ' + error.message)
}

export async function getTripParticipants(tripId: string): Promise<(TripParticipant & { full_name: string | null; avatar_url: string | null })[]> {
  if (isStaticTrip(tripId)) {
    return [
      {
        id: 'participant-demo-guide',
        trip_id: tripId,
        user_id: 'user-demo-guide',
        role: 'organizer',
        status: 'confirmed',
        joined_at: new Date().toISOString(),
        full_name: 'Equipe Amazon Wind',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      },
    ]
  }

  const { data, error } = await supabase
    .from('trip_participants')
    .select('*, profiles!trip_participants_user_id_fkey(full_name, avatar_url)')
    .eq('trip_id', tripId)
    .in('status', ['confirmed', 'pending'])
    .order('role', { ascending: true })

  if (error) throw new Error('Falha ao carregar participantes: ' + error.message)

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    trip_id: row.trip_id as string,
    user_id: row.user_id as string,
    role: row.role as 'organizer' | 'participant',
    status: row.status as 'pending' | 'confirmed' | 'cancelled',
    joined_at: row.joined_at as string,
    full_name: ((row.profiles as Record<string, unknown>)?.full_name as string | null) ?? null,
    avatar_url: ((row.profiles as Record<string, unknown>)?.avatar_url as string | null) ?? null,
  }))
}

export async function createTripConversation(tripId: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_trip_conversation', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao criar grupo: ' + error.message)
  return data as string
}

export async function getTripConversation(tripId: string): Promise<TripConversation | null> {
  if (isStaticTrip(tripId)) return null
  const { data, error } = await supabase.rpc('get_trip_conversation', { p_trip_id: tripId })
  if (error) throw new Error('Falha ao carregar grupo: ' + error.message)
  if (!data || data.length === 0) return null
  return data[0] as TripConversation
}

export async function inviteToTrip(tripId: string, friendId: string): Promise<void> {
  if (isStaticTrip(tripId)) return
  const { error } = await supabase.rpc('invite_to_trip', {
    p_trip_id: tripId,
    p_friend_id: friendId,
  })
  if (error) throw new Error('Falha ao enviar convite: ' + error.message)
}

export async function respondTripInvite(tripId: string, accept: boolean): Promise<void> {
  if (isStaticTrip(tripId)) return
  const { error } = await supabase.rpc('respond_trip_invite', {
    p_trip_id: tripId,
    p_accept: accept,
  })
  if (error) throw new Error('Falha ao responder convite: ' + error.message)
}

export async function removeTripParticipant(tripId: string, userId: string): Promise<void> {
  if (isStaticTrip(tripId)) return
  const { error } = await supabase.rpc('remove_trip_participant', {
    p_trip_id: tripId,
    p_user_id: userId,
  })
  if (error) throw new Error('Falha ao remover participante: ' + error.message)
}

export async function getTripFeed(tripId: string, limit = 20, offset = 0): Promise<TripFeedPost[]> {
  if (isStaticTrip(tripId)) return []
  const { data, error } = await supabase.rpc('get_trip_feed', {
    p_trip_id: tripId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw new Error('Falha ao carregar posts: ' + error.message)
  return (data ?? []) as TripFeedPost[]
}

export async function getTripInvitableFriends(tripId: string): Promise<InvitableFriend[]> {
  if (isStaticTrip(tripId)) return []
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
