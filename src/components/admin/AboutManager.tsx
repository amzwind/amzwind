import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import {
  FormField,
  Input,
  PrimaryButton,
  GhostButton,
  FileUpload,
  Textarea,
  Toast,
} from './SharedUI'

type Locale = 'pt' | 'en' | 'es'

interface AboutPage {
  id: string
  locale: Locale
  title: string
  subtitle: string | null
  description: string | null
  cover_url: string | null
  video_url: string | null
  gallery_urls: string[]
  mission: string | null
  vision: string | null
  created_at: string
  updated_at: string
}

interface AboutFormData {
  title: string
  subtitle: string
  description: string
  cover_url: string
  video_url: string
  gallery_urls: string[]
  mission: string
  vision: string
}

const EMPTY_FORM: AboutFormData = {
  title: '',
  subtitle: '',
  description: '',
  cover_url: '',
  video_url: '',
  gallery_urls: [],
  mission: '',
  vision: '',
}

const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
}

export function AboutManager() {
  const [activeLocale, setActiveLocale] = useState<Locale>('pt')
  const [aboutData, setAboutData] = useState<AboutPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<AboutFormData>(EMPTY_FORM)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  useEffect(() => {
    loadAboutData()
  }, [activeLocale])

  const loadAboutData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('about_page' as any)
        .select('*')
        .eq('locale', activeLocale)
        .single()

      if (!error && data) {
        const d = data as unknown as AboutPage
        setAboutData(d)
        setFormData({
          title: d.title || '',
          subtitle: d.subtitle || '',
          description: d.description || '',
          cover_url: d.cover_url || '',
          video_url: d.video_url || '',
          gallery_urls: d.gallery_urls || [],
          mission: d.mission || '',
          vision: d.vision || '',
        })
      } else {
        setAboutData(null)
        setFormData(EMPTY_FORM)
      }
    } catch {
      setAboutData(null)
      setFormData(EMPTY_FORM)
    }
    setLoading(false)
  }

  function enterEditMode() {
    setEditMode(true)
  }

  function cancelEdit() {
    setEditMode(false)
    if (aboutData) {
      setFormData({
        title: aboutData.title || '',
        subtitle: aboutData.subtitle || '',
        description: aboutData.description || '',
        cover_url: aboutData.cover_url || '',
        video_url: aboutData.video_url || '',
        gallery_urls: aboutData.gallery_urls || [],
        mission: aboutData.mission || '',
        vision: aboutData.vision || '',
      })
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      setToast({ message: 'O título é obrigatório.', type: 'error' })
      return
    }

    setSaving(true)

    const payload = {
      locale: activeLocale,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || null,
      description: formData.description.trim() || null,
      cover_url: formData.cover_url.trim() || null,
      video_url: formData.video_url.trim() || null,
      gallery_urls: formData.gallery_urls,
      mission: formData.mission.trim() || null,
      vision: formData.vision.trim() || null,
      updated_at: new Date().toISOString(),
    }

    if (aboutData) {
      const { error } = await supabase
        .from('about_page' as any)
        .update(payload)
        .eq('id', aboutData.id)

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Página "Sobre" atualizada!', type: 'success' })
        setEditMode(false)
        loadAboutData()
      }
    } else {
      const { error } = await supabase.from('about_page' as any).insert({
        ...payload,
        created_at: new Date().toISOString(),
      })

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Página "Sobre" criada!', type: 'success' })
        setEditMode(false)
        loadAboutData()
      }
    }

    setSaving(false)
  }

  function addGalleryImage(url: string) {
    if (!url.trim()) return
    setFormData((prev) => ({
      ...prev,
      gallery_urls: [...prev.gallery_urls, url.trim()],
    }))
    setNewGalleryUrl('')
  }

  function removeGalleryImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciar Página "Sobre"</h2>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-1">
            Edite o conteúdo da página sobre em cada idioma.
          </p>
        </div>
        {!editMode && (
          <PrimaryButton onClick={enterEditMode}>Editar Conteúdo</PrimaryButton>
        )}
      </div>

      {/* Locale Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-xl w-fit">
        {(['pt', 'en', 'es'] as Locale[]).map((loc) => (
          <button
            key={loc}
            onClick={() => { setActiveLocale(loc); setEditMode(false) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLocale === loc
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
            }`}
          >
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-400 dark:text-white/30 animate-pulse">
          Carregando conteúdo...
        </div>
      ) : editMode ? (
        /* Edit Mode */
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Conteúdo Principal</h3>

            <FormField label="Título">
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Sobre a Amazon Wind"
              />
            </FormField>

            <FormField label="Subtítulo">
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Ex: Escola de Kitesurf & Expedições"
              />
            </FormField>

            <FormField label="Descrição">
              <Textarea
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="História completa da empresa..."
              />
            </FormField>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Missão & Visão</h3>

            <FormField label="Missão">
              <Textarea
                rows={3}
                value={formData.mission}
                onChange={(e) => setFormData((prev) => ({ ...prev, mission: e.target.value }))}
                placeholder="Missão da empresa..."
              />
            </FormField>

            <FormField label="Visão">
              <Textarea
                rows={3}
                value={formData.vision}
                onChange={(e) => setFormData((prev) => ({ ...prev, vision: e.target.value }))}
                placeholder="Visão da empresa..."
              />
            </FormField>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Mídia</h3>

            <FileUpload
              label="Imagem de Capa"
              accept="image/*"
              value={formData.cover_url}
              onUpload={(url) => setFormData((prev) => ({ ...prev, cover_url: url }))}
              bucket="about"
            />

            <FormField label="Ou cole a URL da capa">
              <Input
                type="url"
                value={formData.cover_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, cover_url: e.target.value }))}
                placeholder="https://exemplo.com/capa.jpg"
              />
            </FormField>

            <FormField label="URL do Vídeo (YouTube ou link direto)">
              <Input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </FormField>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Galeria</h3>

            {formData.gallery_urls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.gallery_urls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden">
                    <img src={url} alt={`Galeria ${i + 1}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="URL da imagem da galeria"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addGalleryImage(newGalleryUrl)
                  }
                }}
              />
              <GhostButton type="button" onClick={() => addGalleryImage(newGalleryUrl)}>
                + Adicionar
              </GhostButton>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <GhostButton type="button" onClick={cancelEdit} className="flex-1">
              Cancelar
            </GhostButton>
            <PrimaryButton type="submit" disabled={saving} className="flex-1">
              {saving ? 'Salvando...' : aboutData ? 'Atualizar' : 'Criar'}
            </PrimaryButton>
          </div>
        </form>
      ) : aboutData ? (
        /* View Mode */
        <div className="space-y-6">
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-4">Conteúdo Principal</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">Título</span>
                <p className="text-sm text-gray-900 dark:text-white font-medium">{aboutData.title}</p>
              </div>
              {aboutData.subtitle && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">Subtítulo</span>
                  <p className="text-sm text-gray-700 dark:text-white/70">{aboutData.subtitle}</p>
                </div>
              )}
              {aboutData.description && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">Descrição</span>
                  <p className="text-sm text-gray-700 dark:text-white/70 whitespace-pre-line line-clamp-6">{aboutData.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Missão</h3>
              <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">{aboutData.mission || '—'}</p>
            </div>
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Visão</h3>
              <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">{aboutData.vision || '—'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-4">Mídia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aboutData.cover_url && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">Capa</span>
                  <img src={aboutData.cover_url} alt="Capa" className="mt-1 w-full h-32 object-cover rounded-xl" />
                </div>
              )}
              {aboutData.video_url && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">Vídeo</span>
                  <p className="mt-1 text-xs text-amz-dourado truncate">{aboutData.video_url}</p>
                </div>
              )}
            </div>
          </div>

          {aboutData.gallery_urls.length > 0 && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-4">Galeria ({aboutData.gallery_urls.length} imagens)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aboutData.gallery_urls.map((url, i) => (
                  <img key={i} src={url} alt={`Galeria ${i + 1}`} className="w-full h-24 object-cover rounded-xl" />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-12 border border-gray-100 dark:border-white/[0.06] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-white/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 dark:text-white/30 mb-4">
            Nenhum conteúdo configurado para {LOCALE_LABELS[activeLocale]}.
          </p>
          <PrimaryButton onClick={enterEditMode}>Criar Conteúdo</PrimaryButton>
        </div>
      )}
    </div>
  )
}
