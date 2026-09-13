import { supabase, type Tables } from './supabase'
import type { PostFeedItem, PostAuthor } from './feed'

export type PostWithCounts = PostFeedItem & {
  comments_count: number
  shares_count: number
}

export async function sharePost(
  postId: string,
  conversationId?: string
): Promise<Tables<'post_shares'>> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase.rpc('share_post', {
    p_post_id: postId,
    p_conversation_id: conversationId ?? null,
  })
  if (error) throw new Error('Falha ao compartilhar: ' + error.message)
  return data
}

export async function getPostComments(
  postId: string
): Promise<(Tables<'post_comments'> & { author: PostAuthor })[]> {
  const { data, error } = await supabase.rpc('get_post_comments', {
    p_post_id: postId,
  })
  if (error) throw new Error('Falha ao carregar comentários: ' + error.message)

  type CommentRow = Tables<'post_comments'> & { author_full_name?: string | null; author_avatar_url?: string | null }
  const comments = (data ?? []) as CommentRow[]

  return comments.map((c) => ({
    id: c.id,
    post_id: c.post_id,
    user_id: c.user_id,
    content: c.content,
    parent_id: c.parent_id ?? null,
    created_at: c.created_at,
    updated_at: c.updated_at,
    author: { full_name: c.author_full_name ?? null, avatar_url: c.author_avatar_url ?? null },
  }))
}

export async function getPostAuthors(
  userIds: string[]
): Promise<Record<string, PostAuthor>> {
  if (userIds.length === 0) return {}

  const { data, error } = await supabase.rpc('get_post_authors', {
    p_user_ids: userIds,
  })
  if (error) throw new Error('Falha ao carregar autores: ' + error.message)

  const authors: Record<string, PostAuthor> = {}
  for (const row of data ?? []) {
    authors[row.id] = { full_name: row.full_name, avatar_url: row.avatar_url }
  }
  return authors
}

export async function updatePost(
  postId: string,
  userId: string,
  content: string
): Promise<void> {
  const trimmed = content.trim()
  if (!trimmed) throw new Error('Conteúdo não pode ser vazio.')

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (fetchError || !post) throw new Error('Publicação não encontrada.')
  if (post.user_id !== userId) throw new Error('Você não tem permissão para editar esta publicação.')

  const { error } = await supabase
    .from('posts')
    .update({ content: trimmed })
    .eq('id', postId)

  if (error) throw new Error('Falha ao atualizar publicação: ' + error.message)
}
