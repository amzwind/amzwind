import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { OFFICIAL_HERO_SLIDES, type HeroSlide } from '../../data/heroSlides'
import {
  ModalShell,
  FormField,
  Input,
  Select,
  PrimaryButton,
  GhostButton,
  FileUpload,
  Toast,
  ConfirmModal,
} from './SharedUI'

interface SlideFormData {
  title: string
  subtitle: string
  media_url: string
  media_type: 'image' | 'video'
  cta_text: string
  cta_link: string
  display_order: string
}

const INITIAL_FORM: SlideFormData = {
  title: '',
  subtitle: '',
  media_url: '',
  media_type: 'image',
  cta_text: 'Explorar Roteiros',
  cta_link: '#experiencias',
  display_order: '0',
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/|youtu\.be\/)/i.test(url)
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

function detectMediaType(url: string, fileName?: string): 'image' | 'video' {
  if (isYouTubeUrl(url)) return 'video'
  if (/\.(mp4|webm|ogg|mov)$/i.test(url)) return 'video'
  if (fileName && /\.(mp4|webm|ogg|mov)$/i.test(fileName)) return 'video'
  if (/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url)) return 'image'
  return 'image'
}

function mergeWithOfficial(dbSlides: HeroSlide[]): HeroSlide[] {
  const officialIds = new Set(OFFICIAL_HERO_SLIDES.map((s) => s.id))
  const merged: HeroSlide[] = []

  for (const official of OFFICIAL_HERO_SLIDES) {
    const dbVersion = dbSlides.find((s) => s.id === official.id)
    merged.push(dbVersion || official)
  }

  for (const dbSlide of dbSlides) {
    if (!officialIds.has(dbSlide.id)) {
      merged.push(dbSlide)
    }
  }

  return merged
}

export function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>(OFFICIAL_HERO_SLIDES)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState<SlideFormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null)

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hero_slides' as any)
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data && data.length > 0) {
      setSlides(mergeWithOfficial(data as unknown as HeroSlide[]))
    } else {
      setSlides([...OFFICIAL_HERO_SLIDES])
    }
    setLoading(false)
  }

  function openNew() {
    if (slides.length >= 6) {
      setToast({ message: 'Limite de 6 slides atingido. Exclua um slide antes de criar outro.', type: 'error' })
      return
    }
    setEditingSlide(null)
    setFormData({ ...INITIAL_FORM, display_order: String(slides.length) })
    setModalOpen(true)
  }

  function openEdit(slide: HeroSlide) {
    setEditingSlide(slide)
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      media_url: slide.media_url || '',
      media_type: slide.media_type || 'image',
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      display_order: String(slide.display_order ?? 0),
    })
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const mediaUrl = formData.media_url.trim()
    const title = formData.title.trim()

    if (!mediaUrl) {
      setToast({ message: 'Informe ou envie a midia de fundo.', type: 'error' })
      return
    }
    if (!title) {
      setToast({ message: 'O titulo e obrigatorio.', type: 'error' })
      return
    }

    setSaving(true)
    const payload = {
      title,
      subtitle: formData.subtitle.trim() || null,
      media_url: mediaUrl,
      media_type: formData.media_type,
      cta_text: formData.cta_text.trim() || null,
      cta_link: formData.cta_link.trim() || null,
      display_order: parseInt(formData.display_order) || 0,
    }

    if (editingSlide && !String(editingSlide.id ?? '').startsWith('default-')) {
      const { error } = await supabase
        .from('hero_slides' as any)
        .update(payload)
        .eq('id', editingSlide.id)

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Slide atualizado com sucesso!', type: 'success' })
        loadSlides()
      }
    } else {
      const { error } = await supabase.from('hero_slides' as any).insert(payload)

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Slide criado com sucesso!', type: 'success' })
        loadSlides()
      }
    }

    setSaving(false)
    setModalOpen(false)
  }

  async function moveSlide(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= slides.length) return

    const updated = [...slides]
    const tempOrder = updated[index].display_order
    updated[index].display_order = updated[targetIndex].display_order
    updated[targetIndex].display_order = tempOrder

    const [a, b] = [updated[index], updated[targetIndex]]

    await Promise.all([
      supabase.from('hero_slides' as any).update({ display_order: a.display_order }).eq('id', a.id),
      supabase.from('hero_slides' as any).update({ display_order: b.display_order }).eq('id', b.id),
    ])

    loadSlides()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    if (String(deleteTarget.id ?? '').startsWith('default-')) {
      setSlides((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setToast({ message: 'Slide oficial removido da visualizacao.', type: 'success' })
      setDeleteTarget(null)
      return
    }

    const { error } = await supabase
      .from('hero_slides' as any)
      .delete()
      .eq('id', deleteTarget.id)

    if (!error) {
      setToast({ message: 'Slide excluido.', type: 'success' })
      loadSlides()
    } else {
      setToast({ message: error.message, type: 'error' })
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciar Hero / Capa</h2>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-1">
            Controle as midias e textos de destaque da pagina inicial. {slides.length}/6 slides
          </p>
        </div>
        {slides.length >= 6 ? (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl font-medium">
            Limite de 6 slides atingido
          </span>
        ) : (
          <PrimaryButton onClick={openNew}>+ Novo Slide</PrimaryButton>
        )}
      </div>

      {/* Tips */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-200 space-y-1">
        <p><strong>Sugestao de dimensoes:</strong> 1920x1080px (proporcao 16:9).</p>
        <p>Voce pode fazer upload de arquivo, colar um link direto (URL) de imagem/video, ou colar um link do YouTube — o tipo de midia sera detectado automaticamente.</p>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-400 dark:text-white/30 animate-pulse">
          Carregando slides...
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-12 border border-gray-100 dark:border-white/[0.06] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-white/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 dark:text-white/30 mb-4">Nenhum slide configurado.</p>
          <PrimaryButton onClick={openNew}>Criar primeiro slide</PrimaryButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden hover:border-gray-200 dark:hover:border-white/[0.1] transition-all group"
            >
              {/* Media Preview */}
              <div className="relative h-40 bg-black/5 dark:bg-white/[0.02] overflow-hidden">
                {slide.media_type === 'video' && isYouTubeUrl(slide.media_url) ? (
                  <img
                    src={getYouTubeThumbnail(slide.media_url) || ''}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : slide.media_type === 'video' ? (
                  <video
                    src={slide.media_url}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={slide.media_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold backdrop-blur-sm">
                    {slide.media_type === 'video' ? (isYouTubeUrl(slide.media_url) ? 'YouTube' : 'Video') : 'Imagem'}
                  </span>
                  <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                    #{slide.display_order}
                  </span>
                  {String(slide.id ?? '').startsWith('default-') && (
                    <span className="bg-amz-dourado/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                      Oficial
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{slide.title}</h3>
                {slide.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5 line-clamp-1">{slide.subtitle}</p>
                )}
                {slide.cta_text && (
                  <p className="text-[10px] text-amz-dourado mt-2 font-semibold uppercase tracking-wider">
                    CTA: {slide.cta_text}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => moveSlide(slides.indexOf(slide), 'up')}
                  disabled={slides.indexOf(slide) === 0}
                  className="inline-flex items-center justify-center px-2 py-1.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-xs text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover para cima"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button
                  onClick={() => moveSlide(slides.indexOf(slide), 'down')}
                  disabled={slides.indexOf(slide) === slides.length - 1}
                  className="inline-flex items-center justify-center px-2 py-1.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-xs text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover para baixo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <GhostButton onClick={() => openEdit(slide)} className="flex-1 text-xs py-1.5">
                  Editar
                </GhostButton>
                <button
                  onClick={() => setDeleteTarget(slide)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl border border-red-200 dark:border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <ModalShell
          onClose={() => setModalOpen(false)}
          title={editingSlide ? 'Editar Slide' : 'Novo Slide da Hero'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Titulo de Destaque">
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Expedicoes na Costa Norte"
              />
            </FormField>

            <FormField label="Subtitulo">
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Ex: Sinta a forca dos ventos alisios"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tipo de Midia">
                <Select
                  value={formData.media_type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, media_type: e.target.value as 'image' | 'video' }))}
                >
                  <option value="image">Imagem</option>
                  <option value="video">Video</option>
                </Select>
              </FormField>
              <FormField label="Ordem">
                <Input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: e.target.value }))}
                />
              </FormField>
            </div>

            {/* Media: Upload + URL */}
            <FileUpload
              label="Fazer Upload do Arquivo"
              accept={formData.media_type === 'image' ? 'image/*' : 'video/mp4,video/webm'}
              value={formData.media_url}
              onUpload={(url) => {
                const fileName = url.split('/').pop() || ''
                setFormData((prev) => ({
                  ...prev,
                  media_url: url,
                  media_type: detectMediaType(url, fileName),
                }))
              }}
              bucket="hero"
            />

            <FormField label="Ou cole o link direto (URL)">
              <Input
                type="url"
                value={formData.media_url}
                onChange={(e) => {
                  const url = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    media_url: url,
                    media_type: detectMediaType(url),
                  }))
                }}
                placeholder="https://exemplo.com/imagem.jpg ou link do YouTube"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Texto do Botao (CTA)">
                <Input
                  value={formData.cta_text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cta_text: e.target.value }))}
                  placeholder="Explorar Roteiros"
                />
              </FormField>
              <FormField label="Link do Botao">
                <Input
                  value={formData.cta_link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cta_link: e.target.value }))}
                  placeholder="#experiencias"
                />
              </FormField>
            </div>

            <div className="flex gap-3 pt-2">
              <GhostButton type="button" onClick={() => setModalOpen(false)} className="flex-1">
                Cancelar
              </GhostButton>
              <PrimaryButton type="submit" disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : editingSlide ? 'Atualizar' : 'Criar Slide'}
              </PrimaryButton>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          title="Excluir Slide"
          message={`Tem certeza que deseja excluir "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  )
}
