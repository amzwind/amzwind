import { supabase, type Tables, type Inserts } from './supabase'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export type Post = Tables<'posts'>
export type PostComment = Tables<'post_comments'>

export interface PostFeedItem {
  id: string
  user_id: string
  content: string | null
  media_url: string | null
  likes_count: number
  comments_count: number
  liked_by_me: boolean
  created_at: string
}

export interface PostAuthor {
  full_name: string | null
  avatar_url: string | null
}

export interface FeedResult {
  posts: PostFeedItem[]
  authors: Record<string, PostAuthor>
}

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `Arquivo muito grande. Limite: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return 'Tipo de arquivo não suportado. Use imagens (JPEG, PNG, WebP, GIF) ou vídeos (MP4, WebM, QuickTime).'
  }
  return null
}

async function uploadMedia(file: File, userId: string): Promise<string | null> {
  const validationError = validateFile(file)
  if (validationError) throw new Error(validationError)

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('posts')
    .upload(path, file, { contentType: file.type })

  if (error) throw new Error('Falha no upload: ' + error.message)

  const { data: urlData } = supabase.storage.from('posts').getPublicUrl(path)
  return urlData?.publicUrl || null
}

export async function createPost(
  userId: string,
  content: string,
  mediaFile?: File | null
): Promise<Post> {
  let mediaUrl: string | null = null

  if (mediaFile) {
    mediaUrl = await uploadMedia(mediaFile, userId)
  }

  const insertData: Inserts<'posts'> = {
    user_id: userId,
    content: content.trim() || null,
    media_url: mediaUrl,
  }

  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    if (mediaUrl) {
      await supabase.storage.from('posts').remove([mediaUrl.split('/posts/')[1] || ''])
    }
    throw new Error('Falha ao criar publicação: ' + error.message)
  }

  return data
}

export async function deletePost(postId: string, userId: string): Promise<void> {
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('media_url, user_id')
    .eq('id', postId)
    .single()

  if (fetchError || !post) throw new Error('Publicação não encontrada.')
  if (post.user_id !== userId) throw new Error('Você não tem permissão para excluir esta publicação.')

  if (post.media_url) {
    const filePath = post.media_url.split('/posts/')[1]
    if (filePath) {
      await supabase.storage.from('posts').remove([filePath])
    }
  }

  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw new Error('Falha ao excluir publicação: ' + error.message)
}

export async function toggleLike(postId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_post_like', { p_post_id: postId })
  if (error) throw new Error('Falha ao processar curtida: ' + error.message)
  return data as boolean
}

export async function loadFeed(limit = 20, offset = 0): Promise<FeedResult> {
  const { data: feedPosts, error } = await supabase
    .rpc('get_posts_feed', { p_limit: limit, p_offset: offset })

  if (error) throw new Error('Falha ao carregar feed: ' + error.message)

  const posts = (feedPosts || []) as PostFeedItem[]
  const authors: Record<string, PostAuthor> = {}

  const userIds = [...new Set(posts.map((p) => p.user_id))]
  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    if (profilesData) {
      profilesData.forEach((p) => {
        authors[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url }
      })
    }
  }

  return { posts, authors }
}

export async function loadComments(postId: string): Promise<(PostComment & { author: PostAuthor })[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw new Error('Falha ao carregar comentários: ' + error.message)

  const comments = (data || []) as PostComment[]
  const userIds = [...new Set(comments.map((c) => c.user_id))]
  const authorMap: Record<string, PostAuthor> = {}

  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    if (profilesData) {
      profilesData.forEach((p) => {
        authorMap[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url }
      })
    }
  }

  return comments.map((c) => ({
    ...c,
    author: authorMap[c.user_id] || { full_name: 'Rider', avatar_url: null },
  }))
}

export async function addComment(postId: string, userId: string, content: string): Promise<PostComment> {
  const trimmed = content.trim()
  if (!trimmed) throw new Error('Comentário não pode ser vazio.')

  const { data, error } = await supabase
    .from('post_comments')
    .insert({ post_id: postId, user_id: userId, content: trimmed })
    .select()
    .single()

  if (error) throw new Error('Falha ao adicionar comentário: ' + error.message)
  return data
}

export async function deleteComment(commentId: string, userId: string): Promise<void> {
  const { data: comment, error: fetchError } = await supabase
    .from('post_comments')
    .select('user_id')
    .eq('id', commentId)
    .single()

  if (fetchError || !comment) throw new Error('Comentário não encontrado.')
  if (comment.user_id !== userId) throw new Error('Você não tem permissão para excluir este comentário.')

  const { error } = await supabase.from('post_comments').delete().eq('id', commentId)
  if (error) throw new Error('Falha ao excluir comentário: ' + error.message)
}

export async function updateComment(commentId: string, userId: string, content: string): Promise<PostComment> {
  const trimmed = content.trim()
  if (!trimmed) throw new Error('Comentário não pode ser vazio.')

  const { data: comment, error: fetchError } = await supabase
    .from('post_comments')
    .select('user_id')
    .eq('id', commentId)
    .single()

  if (fetchError || !comment) throw new Error('Comentário não encontrado.')
  if (comment.user_id !== userId) throw new Error('Você não tem permissão para editar este comentário.')

  const { data, error } = await supabase
    .from('post_comments')
    .update({ content: trimmed })
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw new Error('Falha ao atualizar comentário: ' + error.message)
  return data
}
