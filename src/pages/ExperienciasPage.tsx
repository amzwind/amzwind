import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, type Tables } from '../services/supabase'
import { useEffect, useState } from 'react'

type Experience = Tables<'experiences'>

export default function ExperienciasPage() {
  const { t } = useLanguage()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiences()
  }, [])

  async function loadExperiences() {
    const { data } = await supabase.from('experiences').select('*').order('title')
    if (data) setExperiences(data)
    setLoading(false)
  }

  const getExperienceImage = (exp: Experience) => {
    if (exp.image_url) return exp.image_url
    if (exp.video_url) {
      const match = exp.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    }
    return 'https://images.unsplash.com/photo-1502680390548-bdbac40a5b85?w=800&q=80'
  }

  const formatBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-amz-terra to-amz-terra-dark text-white pt-20 pb-12 px-4">
        <div className="absolute inset-0 bg-patterns opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amz-dourado mb-3">
            {t.expLabel}
          </p>
          <h1 className="text-3xl md:text-4xl font-maybug mb-4">
            {t.expTitle}
          </h1>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            {t.expSubtitle}
          </p>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-2/3" />
                  <div className="h-16 bg-gray-200 dark:bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-white/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-white/40">Nenhuma experiência disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp) => (
              <Link
                key={exp.id}
                to={`/experiencia/${exp.id}`}
                className="group block rounded-2xl overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-lg hover:border-gray-200 dark:hover:border-white/[0.1] transition-all duration-300 active:scale-[0.98]"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getExperienceImage(exp)}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      {exp.level && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amz-dourado/80 text-white">
                          {exp.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amz-dourado transition-colors mb-2">
                    {exp.title}
                  </h3>
                  {exp.description && (
                    <p className="text-sm text-gray-500 dark:text-white/40 line-clamp-2 mb-4">
                      {exp.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-white/30 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-4">
                      {exp.duration && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-amz-dourado">
                      {formatBRL(exp.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
