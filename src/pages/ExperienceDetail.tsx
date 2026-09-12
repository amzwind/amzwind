import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'
import { getStaticExperience, type StaticExperience } from '../data/experiences'
import { portraitImages, heroDesktopFallback } from '../data/media'

type Experience = Tables<'experiences'>
type Review = Tables<'experience_reviews'>

const FALLBACK_IMAGES = [
  portraitImages[0]?.src, portraitImages[5]?.src, portraitImages[10]?.src, portraitImages[15]?.src, portraitImages[20]?.src,
].filter(Boolean)

function getExpFallback(id: string): string {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length] || heroDesktopFallback.src
}

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={readonly} onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)} onMouseLeave={() => !readonly && setHover(0)}
          className={`text-lg transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}>
          <span className={star <= (hover || value) ? 'text-amz-dourado' : 'text-gray-300 dark:text-white/10'}>★</span>
        </button>
      ))}
    </div>
  )
}

function isStaticExp(exp: any): exp is StaticExperience {
  return exp && ('gallery' in exp || ('includes' in exp && !Array.isArray(exp.includes)))
}

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, locale } = useLanguage()
  const { addItem } = useCart()
  const [exp, setExp] = useState<(Experience & { image_url?: string | null }) | StaticExperience | null>(null)
  const [related, setRelated] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Reviews
  const [reviews, setReviews] = useState<(Review & { user_name?: string })[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyComment, setReplyComment] = useState('')
  const [replyRating, setReplyRating] = useState(5)

  // Gallery lightbox
  const [lbIndex, setLbIndex] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setCurrentUser(data.session?.user?.id || null))
  }, [])

  useEffect(() => {
    if (!id) return
    const experienceId = id
    async function load() {
      const { data } = await supabase.from('experiences').select('*').eq('id', experienceId).single()
      if (data) {
        setExp(data)
        const { data: rel } = await supabase.from('experiences').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(3)
        if (rel) setRelated(rel)
      } else {
        const staticExp = getStaticExperience(experienceId)
        if (staticExp) setExp(staticExp)
      }
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => { if (id) loadReviews() }, [id])

  async function loadReviews() {
    setReviewsLoading(true)
    const { data } = await supabase.from('experience_reviews').select('*').eq('experience_id', id!).order('created_at', { ascending: false })
    if (data) {
      const userIds = [...new Set(data.map((r) => r.user_id))]
      const { data: users } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
      const userMap = new Map((users || []).map((u) => [u.id, u.full_name || 'User']))
      setReviews(data.map((r) => ({ ...r, user_name: userMap.get(r.user_id) || 'User' })))
    }
    setReviewsLoading(false)
  }

  async function submitReview(parentId: string | null = null) {
    if (!currentUser || !id) return
    setSubmitting(true)
    const rating = parentId ? replyRating : newRating
    const comment = parentId ? replyComment : newComment
    if (!rating) { setSubmitting(false); return }
    const { error } = await supabase.from('experience_reviews').insert({
      experience_id: id, user_id: currentUser, rating, comment: comment || null, parent_id: parentId,
    })
    setSubmitting(false)
    if (!error) {
      setSubmitMsg(t.reviewsPendingNotice)
      setNewRating(0); setNewComment(''); setReplyTo(null); setReplyComment(''); setReplyRating(5)
      setTimeout(() => setSubmitMsg(null), 5000)
    }
  }

  const handleNavLb = useCallback((dir: -1 | 1) => {
    if (lbIndex === null || !galleryImages.length) return
    setLbIndex((prev) => prev !== null ? (prev + dir + galleryImages.length) % galleryImages.length : null)
  }, [lbIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <p className="text-amz-terra dark:text-amz-areia">Experiência não encontrada.</p>
      </div>
    )
  }

  const approvedReviews = reviews.filter((r) => r.status === 'approved' && !r.parent_id)
  const avgRating = approvedReviews.length > 0 ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length : 0
  function getReplies(reviewId: string) { return reviews.filter((r) => r.parent_id === reviewId && r.status === 'approved') }

  // Build gallery from static data or fallback
  const staticData = isStaticExp(exp) ? exp : null
  const expType = staticData?.type || (exp as any)?.type || 'individual'
  const expIncludes = staticData?.includes || (exp as any)?.includes || []
  const expOriginalPrice = staticData?.originalPrice || (exp as any)?.original_price || null

  const galleryImages: { src: string; alt: string }[] = staticData?.gallery?.length
    ? staticData.gallery.map((src, i) => ({ src, alt: `${exp.title} — ${i + 1}` }))
    : exp.image_url
      ? [{ src: exp.image_url, alt: exp.title }, { src: getExpFallback(exp.id), alt: exp.title }]
      : [{ src: getExpFallback(exp.id), alt: exp.title }]

  function handleAddToCart() {
    if (!exp) return
    addItem({ id: exp.id, type: 'experience', title: exp.title, price: exp.price, image_url: exp.image_url, booking_date: selectedDate })
    navigate('/checkout')
  }

  const getName = (e: Experience & { name_pt?: string; name_en?: string; name_es?: string }) => {
    if (locale === 'en') return e.name_en || e.name_pt || e.title
    if (locale === 'es') return e.name_es || e.name_pt || e.title
    return e.name_pt || e.title
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500 pb-20 md:pb-0">
      <Header />

      {/* Hero */}
      <div className="pt-16">
        <div className="relative h-[50vh] md:h-[60vh] bg-gradient-to-br from-amz-oceano to-amz-terra-dark overflow-hidden">
          {exp.image_url ? (
            <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />
          ) : (
            <img src={getExpFallback(exp.id)} alt={exp.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amz-dourado/20 text-amz-dourado backdrop-blur-sm">
                  {exp.community || 'Amazon Wind'}
                </span>
                {expType === 'package' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 backdrop-blur-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    Pacote
                  </span>
                )}
                {expType === 'individual' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 backdrop-blur-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Avulso
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-maybug text-white mb-3">{exp.title}</h1>
              <p className="text-white/70 text-lg max-w-2xl">{exp.description}</p>
              {approvedReviews.length > 0 && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= Math.round(avgRating) ? 'text-amz-dourado' : 'text-white/30'}>★</span>
                    ))}
                  </div>
                  <span className="text-white/70 text-sm">{avgRating.toFixed(1)} ({approvedReviews.length} {t.reviewsTotal})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info pills */}
            <div className="flex flex-wrap gap-3">
              {exp.duration && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/5">
                  <svg className="w-4 h-4 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm text-amz-terra dark:text-amz-areia">{t.expDetailDuration}: {exp.duration}</span>
                </div>
              )}
              {exp.level && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-amz-areia-dark/20 dark:border-white/5">
                  <svg className="w-4 h-4 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-sm text-amz-terra dark:text-amz-areia">{t.expDetailLevel}: {exp.level}</span>
                </div>
              )}
              {expType === 'package' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Pacote Completo</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5">
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.prodDetailDescription}</h3>
              <p className="text-amz-terra-light dark:text-amz-areia/60 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>

            {/* Includes (for experiences with includes) */}
            {expIncludes && expIncludes.length > 0 && (
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5">
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">
                  {expType === 'package' ? 'O que está incluído no pacote' : 'O que está incluído'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expIncludes.map((item: string) => (
                    <div key={item} className="flex items-start gap-3 bg-amz-areia/50 dark:bg-white/[0.02] rounded-xl p-3 border border-amz-areia-dark/10 dark:border-white/5">
                      <div className="w-6 h-6 rounded-full bg-amz-bio/10 dark:bg-amz-bio/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-amz-bio" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-amz-terra dark:text-amz-areia/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {galleryImages.length > 1 && (
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5">
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.galleryTitle || 'Galeria'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <button key={i} onClick={() => setLbIndex(i)}
                      className="rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-white/5 group">
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.expDetailRelated}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <a key={r.id} href={`/experiencia/${r.id}`} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-amz-areia-dark/20 dark:border-white/5 hover:shadow-lg transition-all group">
                      {r.image_url ? <div className="h-24 overflow-hidden"><img src={r.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div> : <div className="h-24 overflow-hidden"><img src={getExpFallback(r.id)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                      <div className="p-3">
                        <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">{getName(r)}</p>
                        <p className="text-xs text-amz-dourado font-bold mt-1">R$ {r.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 min-w-0">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5 sticky top-24 space-y-5 overflow-hidden">
              <div>
                {expOriginalPrice && expOriginalPrice > exp.price && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400 dark:text-white/30 line-through">{formatBRL(expOriginalPrice)}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                     -{Math.round((1 - exp.price / expOriginalPrice) * 100)}%
                    </span>
                  </div>
                )}
                <p className="text-3xl font-maybug text-amz-dourado">R$ {Number(exp.price).toFixed(2)}</p>
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-1">
                  {expType === 'package' ? 'Investimento total do pacote' : 'por pessoa'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">
                  Data da Reserva
                </label>
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value || null)}
                  className="w-full max-w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors box-border"
                />
              </div>
              <button onClick={handleAddToCart} className="btn-primary w-full !py-3.5">
                {expType === 'package' ? 'Adicionar Pacote ao Carrinho' : t.expDetailBook}
              </button>
              {expType === 'package' && (
                <p className="text-[10px] text-center text-amz-terra-light dark:text-amz-areia/30">
                  Pagamento seguro via PIX, Cartão ou PayPal
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews - ALWAYS last before Footer */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5">
          <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-6">{t.reviewsTitle}</h3>
          {currentUser ? (
            <div className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
              <h4 className="text-sm font-semibold text-amz-terra dark:text-amz-areia mb-3">{t.reviewsWrite}</h4>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-amz-terra-light dark:text-amz-areia/60">{t.reviewsRating}:</span>
                <StarRating value={newRating} onChange={setNewRating} />
              </div>
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`${t.reviewsComment}...`} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors resize-none" />
              <div className="flex items-center justify-between mt-3">
                <button onClick={() => submitReview()} disabled={submitting || !newRating}
                  className="px-5 py-2 rounded-xl bg-amz-dourado text-white text-sm font-medium hover:bg-amz-dourado/90 transition-colors disabled:opacity-50">
                  {submitting ? '...' : t.reviewsSubmit}
                </button>
                {submitMsg && <span className="text-xs text-amz-dourado font-medium">{submitMsg}</span>}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 text-center">
              <p className="text-sm text-amz-terra-light dark:text-amz-areia/60">{t.reviewsLoginToComment}</p>
            </div>
          )}
          {reviewsLoading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" /></div>
          ) : approvedReviews.length === 0 ? (
            <p className="text-sm text-amz-terra-light dark:text-amz-areia/40 text-center py-8">{t.reviewsNoReviews}</p>
          ) : (
            <div className="space-y-6">
              {approvedReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-amz-terra dark:text-amz-areia">{review.user_name}</span>
                        <span className="text-xs text-amz-terra-light dark:text-amz-areia/30">{new Date(review.created_at).toLocaleDateString(locale)}</span>
                      </div>
                      <StarRating value={review.rating} readonly />
                      {review.comment && <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 mt-2 leading-relaxed">{review.comment}</p>}
                      {currentUser && (
                        <button onClick={() => setReplyTo(replyTo === review.id ? null : review.id)}
                          className="text-xs text-amz-dourado font-medium mt-2 hover:underline">
                          {replyTo === review.id ? t.reviewsCancel : t.reviewsReply}
                        </button>
                      )}
                    </div>
                  </div>
                  {replyTo === review.id && currentUser && (
                    <div className="mt-4 ml-6 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-amz-terra-light dark:text-amz-areia/60">{t.reviewsRating}:</span>
                        <StarRating value={replyRating} onChange={setReplyRating} />
                      </div>
                      <textarea value={replyComment} onChange={(e) => setReplyComment(e.target.value)} placeholder={`${t.reviewsReply}...`} rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-amz-areia-dark/20 dark:border-white/10 bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia text-xs focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 resize-none" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => submitReview(review.id)} disabled={submitting}
                          className="px-4 py-1.5 rounded-lg bg-amz-dourado text-white text-xs font-medium hover:bg-amz-dourado/90 transition-colors disabled:opacity-50">
                          {submitting ? '...' : t.reviewsSubmit}
                        </button>
                        <button onClick={() => { setReplyTo(null); setReplyComment('') }}
                          className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-amz-terra dark:text-amz-areia text-xs">
                          {t.reviewsCancel}
                        </button>
                      </div>
                    </div>
                  )}
                  {getReplies(review.id).map((reply) => (
                    <div key={reply.id} className="ml-6 mt-4 pl-4 border-l-2 border-amz-dourado/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-amz-terra dark:text-amz-areia">{reply.user_name}</span>
                        <span className="text-xs text-amz-terra-light dark:text-amz-areia/30">{new Date(reply.created_at).toLocaleDateString(locale)}</span>
                      </div>
                      <StarRating value={reply.rating} readonly />
                      {reply.comment && <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 mt-1">{reply.comment}</p>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {lbIndex !== null && (
        <Lightbox images={galleryImages} index={lbIndex} onClose={() => setLbIndex(null)} onNav={handleNavLb} />
      )}
    </div>
  )
}

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}
