import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TripCalendar from '../components/TripCalendar'

type Experience = Tables<'experiences'>

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { addItem, checkIn, checkOut, setCheckIn, setCheckOut } = useCart()
  const [exp, setExp] = useState<Experience | null>(null)
  const [related, setRelated] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data } = await supabase.from('experiences').select('*').eq('id', id).single()
      if (data) {
        setExp(data)
        const { data: rel } = await supabase.from('experiences').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(3)
        if (rel) setRelated(rel)
      }
      setLoading(false)
    }
    load()
  }, [id])

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

  function handleAddToCart() {
    if (!exp) return
    addItem({ id: exp.id, type: 'experience', title: exp.title, price: exp.price, image_url: exp.image_url })
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      {/* Hero */}
      <div className="pt-16">
        <div className="relative h-[50vh] md:h-[60vh] bg-gradient-to-br from-amz-oceano to-amz-terra-dark overflow-hidden">
          {exp.image_url && <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amz-dourado/20 text-amz-dourado backdrop-blur-sm mb-4">
                {exp.community || 'Amazon Wind'}
              </span>
              <h1 className="text-3xl md:text-5xl font-maybug text-white mb-3">{exp.title}</h1>
              <p className="text-white/70 text-lg max-w-2xl">{exp.description}</p>
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
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5">
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.prodDetailDescription}</h3>
              <p className="text-amz-terra-light dark:text-amz-areia/60 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia mb-4">{t.expDetailRelated}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <a key={r.id} href={`/experiencia/${r.id}`} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-amz-areia-dark/20 dark:border-white/5 hover:shadow-lg transition-all group">
                      {r.image_url && <div className="h-24 overflow-hidden"><img src={r.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                      <div className="p-3">
                        <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">{r.title}</p>
                        <p className="text-xs text-amz-dourado font-bold mt-1">R$ {r.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5 sticky top-24 space-y-5">
              <div>
                <p className="text-3xl font-maybug text-amz-dourado">R$ {Number(exp.price).toFixed(2)}</p>
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-1">por pessoa</p>
              </div>

              <TripCalendar checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />

              <button onClick={handleAddToCart} className="btn-primary w-full !py-3.5">
                {t.expDetailBook}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
