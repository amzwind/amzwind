import { useState, useEffect } from 'react'
import { supabase, type Tables } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import { EmptyState, Toast, ConfirmModal } from './SharedUI'

type Review = Tables<'experience_reviews'> & { experience_name?: string; user_name?: string }
type Filter = 'pending' | 'approved' | 'rejected' | 'all'

export function ReviewsManager() {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<Filter>('pending')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: reviewData } = await supabase.from('experience_reviews').select('*').order('created_at', { ascending: false })
    if (!reviewData) return
    const expIds = [...new Set(reviewData.map((r) => r.experience_id))]
    const userIds = [...new Set(reviewData.map((r) => r.user_id))]
    const [expResult, userResult] = await Promise.all([
      supabase.from('experiences').select('id, name_en, name_pt, name_es').in('id', expIds),
      supabase.from('profiles').select('id, full_name').in('id', userIds),
    ])
    const expMap = new Map((expResult.data || []).map((e) => [e.id, e.name_pt || e.name_en || e.name_es]))
    const userMap = new Map((userResult.data || []).map((u) => [u.id, u.full_name || 'User']))
    setReviews(reviewData.map((r) => ({ ...r, experience_name: expMap.get(r.experience_id) || r.experience_id, user_name: userMap.get(r.user_id) || r.user_id })))
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    const { error } = await supabase.from('experience_reviews').update({ status }).eq('id', id)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: status === 'approved' ? t.reviewsApproved : t.reviewsRejected, type: 'success' }); await loadData() }
  }

  async function deleteReview(id: string) {
    const { error } = await supabase.from('experience_reviews').delete().eq('id', id)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: 'Review deleted', type: 'success' }); await loadData() }
    setConfirmDelete(null)
  }

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter)
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'pending', label: t.reviewsAdminPending, count: reviews.filter((r) => r.status === 'pending').length },
    { key: 'all', label: t.reviewsAdminAll, count: reviews.length },
    { key: 'approved', label: t.reviewsApproved, count: reviews.filter((r) => r.status === 'approved').length },
    { key: 'rejected', label: t.reviewsRejected, count: reviews.filter((r) => r.status === 'rejected').length },
  ]

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-amz-dourado' : 'text-gray-300 dark:text-white/10'}>★</span>
    ))
  }

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal title={t.reviewsDelete} message={t.reviewsConfirmDelete}
          onConfirm={() => deleteReview(confirmDelete)} onCancel={() => setConfirmDelete(null)} danger />
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.reviewsAdminTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{t.reviewsTotal} {reviews.length}</p>
      </div>

      {/* Filters - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-1 pb-1 -mx-1 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.key ? 'bg-amz-dourado text-white shadow-md' : 'bg-white dark:bg-white/[0.03] text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/[0.06]'
            }`}>
            {f.label}
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg className="w-10 h-10 text-gray-300 dark:text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
          message={t.reviewsNoReviews}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id}
              className={`bg-white dark:bg-white/[0.03] rounded-2xl border p-4 transition-all ${
                review.status === 'pending' ? 'border-amz-dourado/30' : review.status === 'approved' ? 'border-green-500/20' : 'border-red-500/20 opacity-60'
              }`}>
              {/* Top: stars + status badge */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-xs font-medium text-gray-400 dark:text-white/30">{review.rating}/5</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  review.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : review.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {review.status === 'pending' ? t.reviewsPending : review.status === 'approved' ? t.reviewsApproved : t.reviewsRejected}
                </span>
              </div>

              {/* Meta */}
              <div className="text-xs text-gray-500 dark:text-white/40 mb-2 flex flex-wrap gap-x-2 gap-y-0.5">
                <span className="font-medium text-gray-700 dark:text-white/60">{review.user_name}</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{review.experience_name}</span>
                <span>·</span>
                <span>{new Date(review.created_at).toLocaleDateString('pt-BR')}</span>
              </div>

              {review.parent_id && (
                <span className="text-xs text-amz-dourado font-medium mb-1 inline-block">↳ {t.reviewsReply}</span>
              )}

              {review.comment && (
                <p className="text-sm text-gray-700 dark:text-white/60 leading-relaxed mb-3">{review.comment}</p>
              )}

              {/* Action buttons - full width on mobile */}
              <div className="flex gap-2 pt-1">
                {review.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(review.id, 'approved')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.97] transition-all">
                      {t.reviewsApprove}
                    </button>
                    <button onClick={() => updateStatus(review.id, 'rejected')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-[0.97] transition-all">
                      {t.reviewsReject}
                    </button>
                  </>
                )}
                <button onClick={() => setConfirmDelete(review.id)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/30 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 active:scale-[0.97] transition-all">
                  {t.reviewsDelete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
