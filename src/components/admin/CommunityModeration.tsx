import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../services/supabase'
import { MOCK_POSTS, MOCK_AUTHORS } from '../../data/community'
import { Toast, ConfirmModal, EmptyState } from './SharedUI'

interface ModPost {
  id: string
  user_id: string
  content: string | null
  media_url: string | null
  likes_count: number
  comments_count: number
  shares_count: number
  trip_id: string | null
  created_at: string
  author_name: string | null
  author_avatar: string | null
}

export function CommunityModeration() {
  const [posts, setPosts] = useState<ModPost[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  function applyMockFallback() {
    setPosts(
      MOCK_POSTS.map((p) => ({
        ...p,
        author_name: MOCK_AUTHORS[p.user_id]?.full_name ?? 'Rider',
        author_avatar: MOCK_AUTHORS[p.user_id]?.avatar_url ?? null,
      }))
    )
    setIsDemo(true)
  }

  async function loadPosts() {
    setLoading(true)
    setIsDemo(false)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, user_id, content, media_url, likes_count, comments_count, shares_count, trip_id, created_at')
        .order('created_at', { ascending: false })
        .limit(60)

      if (error) throw error
      const rows = (data ?? []) as Omit<ModPost, 'author_name' | 'author_avatar'>[]

      if (rows.length === 0) {
        // Tabela vazia: exibe demonstração em vez de tela de erro
        applyMockFallback()
        return
      }

      const userIds = [...new Set(rows.map((p) => p.user_id))]
      let authorMap = new Map<string, { full_name: string | null; avatar_url: string | null }>()
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds)
        authorMap = new Map(
          (profiles ?? []).map((p) => [p.id, { full_name: p.full_name, avatar_url: p.avatar_url }])
        )
      }

      setPosts(
        rows.map((p) => ({
          ...p,
          author_name: authorMap.get(p.user_id)?.full_name ?? null,
          author_avatar: authorMap.get(p.user_id)?.avatar_url ?? null,
        }))
      )
    } catch {
      // Falha amigável: nunca trava a tela — cai para demonstração
      applyMockFallback()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      if (!isDemo) {
        const { error } = await supabase.from('posts').delete().eq('id', id)
        if (error) throw error
      }
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setToast({ message: isDemo ? 'Publicação removida (demonstração).' : 'Publicação removida!', type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Não foi possível remover a publicação.'
      setToast({ message, type: 'error' })
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (p) =>
        (p.content ?? '').toLowerCase().includes(q) ||
        (p.author_name ?? '').toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    )
  }, [posts, query])

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Remover publicação"
          message="Tem certeza que deseja remover esta publicação da comunidade? Ela deixará de ser visível para todos os riders."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => (deleting ? null : setConfirmDelete(null))}
          danger
        />
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Moderação da Comunidade</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
          Monitore e remova publicações do feed que violem as diretrizes ({posts.length} recentes)
        </p>
      </div>

      {isDemo && (
        <div className="flex items-center gap-2 rounded-2xl border border-amz-dourado/30 bg-amz-dourado/5 px-4 py-3 text-xs text-gray-600 dark:text-white/60">
          <span className="text-base">💬</span>
          <p>
            <span className="font-bold">Modo demonstração:</span> o feed está vazio ou indisponível — exibindo publicações de exemplo. A moderação aqui é local.
          </p>
        </div>
      )}

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por conteúdo, autor ou ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
        />
        <svg
          className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/[0.06] animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          message={query ? 'Nenhuma publicação encontrada para a busca.' : 'Nenhuma publicação no feed.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-amz-oceano/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-amz-oceano">
                      {(post.author_name ?? '?').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {post.author_name ?? 'Rider'}
                    </p>
                    <span className="text-[11px] text-gray-400 dark:text-white/30">
                      {new Date(post.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {post.content && (
                    <p className="text-sm text-gray-700 dark:text-white/60 mt-1 whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  )}
                  {post.media_url && (
                    <img
                      src={post.media_url}
                      alt=""
                      className="mt-2 rounded-xl max-h-40 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 dark:text-white/30">
                    <span>❤️ {post.likes_count ?? 0}</span>
                    <span>💬 {post.comments_count ?? 0}</span>
                    <span>🔁 {post.shares_count ?? 0}</span>
                    <span className="font-mono">#{post.id.slice(0, 8)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmDelete(post.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                  title="Remover publicação"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
