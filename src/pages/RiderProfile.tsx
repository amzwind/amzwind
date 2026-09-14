import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getMockRider, getMockPostsByRider, MOCK_RIDERS } from '../data/community'

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function RiderProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [requestSent, setRequestSent] = useState(false)

  const rider = id ? getMockRider(id) : undefined
  const posts = id ? getMockPostsByRider(id) : []

  if (!rider) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark">
        <Header />
        <div className="pt-28 pb-16 px-4 text-center">
          <p className="text-amz-terra dark:text-amz-areia mb-4">Rider não encontrado.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/amigos" className="btn-primary text-sm">Ver riders</Link>
            <button onClick={() => navigate(-1)} className="text-sm text-amz-terra-light dark:text-amz-areia/50">
              Voltar
            </button>
          </div>
          <div className="max-w-md mx-auto mt-10 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/40 mb-3">
              Riders da comunidade
            </h3>
            <div className="space-y-2">
              {MOCK_RIDERS.slice(0, 5).map((r) => (
                <Link
                  key={r.id}
                  to={`/rider/${r.id}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/5"
                >
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold text-sm">
                      {getInitials(r.full_name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-amz-terra dark:text-amz-areia">{r.full_name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark pb-20 md:pb-0">
      <Header />

      {/* Cover */}
      <div className="pt-16">
        <div className="relative h-44 md:h-56 bg-gradient-to-br from-[#091e24] via-amz-oceano-dark to-amz-terra-dark overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 L1200,200 L0,200 Z" fill="currentColor" className="text-white" />
            </svg>
          </div>
          <button
            onClick={() => navigate(-1)}
            aria-label={t.adminBack}
            className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          {rider.is_online && (
            <span className="absolute top-4 right-4 flex items-center gap-1.5 text-[11px] font-semibold text-white bg-emerald-500/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Online
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Identity card */}
        <div className="relative -mt-12 bg-white/85 dark:bg-[#241407]/85 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-xl shadow-amz-terra/10 p-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-amz-dourado via-amber-400 to-amz-oceano shrink-0 -mt-10">
              {rider.avatar_url ? (
                <img src={rider.avatar_url} alt={rider.full_name} className="w-full h-full rounded-full object-cover border-4 border-white dark:border-[#241407]" />
              ) : (
                <div className="w-full h-full rounded-full bg-amz-terra dark:bg-amz-areia flex items-center justify-center text-xl font-bold text-white dark:text-amz-terra border-4 border-white dark:border-[#241407]">
                  {getInitials(rider.full_name)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia truncate">{rider.full_name}</h1>
              <p className="text-xs text-amz-terra-light dark:text-amz-areia/50">
                {rider.level} · {rider.location}
              </p>
              <p className="text-xs text-amz-oceano dark:text-amz-dourado font-medium mt-0.5">
                📍 Home spot: {rider.home_spot}
              </p>
            </div>
          </div>

          <p className="text-sm text-amz-terra/80 dark:text-amz-areia/70 leading-relaxed mt-3">{rider.bio}</p>

          <div className="flex gap-1.5 mt-3 flex-wrap">
            {rider.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amz-oceano/10 text-amz-oceano dark:bg-amz-dourado/15 dark:text-amz-dourado">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="rounded-2xl bg-amz-areia/60 dark:bg-white/5 py-2.5">
              <p className="text-base font-bold text-amz-terra dark:text-amz-areia">{rider.mutual_friends + 14}</p>
              <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/40">Amigos</p>
            </div>
            <div className="rounded-2xl bg-amz-areia/60 dark:bg-white/5 py-2.5">
              <p className="text-base font-bold text-amz-terra dark:text-amz-areia">{posts.length + 6}</p>
              <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/40">Trips</p>
            </div>
            <div className="rounded-2xl bg-amz-areia/60 dark:bg-white/5 py-2.5">
              <p className="text-base font-bold text-amz-terra dark:text-amz-areia">{posts.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/40">Posts</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {requestSent ? (
              <span className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40">
                Pedido enviado ✓
              </span>
            ) : (
              <button
                onClick={() => setRequestSent(true)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amz-dourado to-amber-500 text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amz-dourado/25 active:scale-[0.98]"
              >
                Adicionar amigo
              </button>
            )}
            <Link
              to="/conversas"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center border border-amz-oceano/30 text-amz-oceano dark:text-amz-areia hover:bg-amz-oceano/10 transition-colors"
            >
              Mensagem
            </Link>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-xs font-bold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/40 mt-8 mb-3">
          Publicações de {rider.full_name.split(' ')[0]}
        </h2>
        {posts.length === 0 ? (
          <div className="bg-white/70 dark:bg-white/5 rounded-3xl border border-white/40 dark:border-white/10 p-8 text-center">
            <p className="text-sm text-amz-terra-light dark:text-amz-areia/40">
              Nenhuma publicação por aqui ainda. Chame {rider.full_name.split(' ')[0]} para velejar! 🪁
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white/85 dark:bg-[#241407]/80 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-lg shadow-amz-terra/5 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {rider.avatar_url ? (
                      <img src={rider.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-amz-dourado/50 ring-offset-2 ring-offset-white dark:ring-offset-[#241407]" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado text-xs font-bold ring-2 ring-amz-dourado/50 ring-offset-2 ring-offset-white dark:ring-offset-[#241407]">
                        {getInitials(rider.full_name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia">{rider.full_name}</p>
                      <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  {post.content && (
                    <p className="text-sm text-amz-terra dark:text-amz-areia whitespace-pre-wrap">{post.content}</p>
                  )}
                </div>
                {post.media_url && (
                  <img src={post.media_url} alt="" className="w-full max-h-72 object-cover" loading="lazy" />
                )}
                <div className="flex items-center gap-4 px-4 py-3 text-xs text-amz-terra-light dark:text-amz-areia/40">
                  <span>❤️ {post.likes_count}</span>
                  <span>💬 {post.comments_count}</span>
                  <span>🔁 {post.shares_count}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
