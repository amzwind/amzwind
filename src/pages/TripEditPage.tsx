import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import { getTrip, updateTrip, type TripDetail } from '../services/trips'

type Status = 'loading' | 'idle' | 'uploading' | 'saving' | 'success' | 'error'

export default function TripEditPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null)
  const [tripStatus, setTripStatus] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const data = await getTrip(id!)
        if (cancelled || !data) return
        if (data.created_by !== userId && userId) {
          navigate(`/trips/${id}`)
          return
        }
        setTrip(data)
        setTitle(data.title)
        setDescription(data.description || '')
        setDestination(data.destination || '')
        setStartDate(data.start_date || '')
        setEndDate(data.end_date || '')
        setMaxParticipants(data.max_participants?.toString() || '')
        setCurrentCoverUrl(data.cover_url)
        setTripStatus(data.status)
        setVisibility(data.visibility || 'public')
        setStatus('idle')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    if (userId !== null) load()
    return () => { cancelled = true }
  }, [id, userId, navigate])

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function removeCover() {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(null)
    setCoverPreview(null)
  }

  async function handleSubmit() {
    if (!title.trim() || !id || status === 'uploading' || status === 'saving') return

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setErrorMessage(t.tripDateError || 'Data final deve ser posterior à data inicial')
      setStatus('error')
      return
    }

    const maxP = maxParticipants ? parseInt(maxParticipants) : undefined
    if (maxP !== undefined && (isNaN(maxP) || maxP < 2)) {
      setErrorMessage(t.tripMaxParticipantsError || 'Mínimo de 2 participantes')
      setStatus('error')
      return
    }

    setStatus(coverFile ? 'uploading' : 'saving')
    setErrorMessage('')

    try {
      let coverUrl = currentCoverUrl
      if (coverFile) {
        // Delete old cover from storage if exists
        if (currentCoverUrl) {
          try {
            const oldPath = currentCoverUrl.split('/trip-covers/')[1]
            if (oldPath) {
              await supabase.storage.from('trip-covers').remove([oldPath])
            }
          } catch { /* non-critical */ }
        }

        const ext = coverFile.name.split('.').pop() || 'jpg'
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('trip-covers')
          .upload(path, coverFile, { contentType: coverFile.type })
        if (uploadError) throw new Error(t.tripErrorUpload + ' ' + uploadError.message)
        const { data: urlData } = supabase.storage.from('trip-covers').getPublicUrl(path)
        coverUrl = urlData?.publicUrl || null
      }

      setStatus('saving')

      await updateTrip(id, {
        title: title.trim(),
        description: description.trim() || undefined,
        destination: destination.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        max_participants: maxP,
        cover_url: coverUrl ?? undefined,
        status: tripStatus || undefined,
        visibility,
      })

      setStatus('success')
      setTimeout(() => navigate(`/trips/${id}`), 800)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : t.tripErrorSave)
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] flex items-center justify-center pb-20 md:pb-4">
        <div className="w-8 h-8 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <p className="text-amz-terra-light dark:text-amz-areia/60 text-sm">{t.tripNotFound || 'Viagem não encontrada'}</p>
        </div>
      </div>
    )
  }

  const isBusy = status === 'uploading' || status === 'saving'

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia">
          {t.tripEdit || 'Editar Trip'}
        </h1>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 p-5 space-y-4">
          {(coverPreview || currentCoverUrl) && (
            <div className="relative inline-block w-full">
              <img src={coverPreview || currentCoverUrl!} alt="Cover" className="w-full h-40 rounded-xl object-cover" />
              {!isBusy && (
                <button onClick={removeCover} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripTitleLabel || 'Título'} *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripDescriptionLabel || 'Descrição'}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 resize-none disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripDestinationLabel || 'Destino'}</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)} disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripStartDate || 'Data início'}</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isBusy}
                className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripEndDate || 'Data fim'}</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isBusy}
                className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripMaxParticipantsLabel || 'Máx. participantes'}</label>
            <input type="number" min={2} value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripStatusLabel || 'Status'}</label>
            <select value={tripStatus} onChange={(e) => setTripStatus(e.target.value)} disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50">
              <option value="draft">{t.tripStatusDraft || 'Rascunho'}</option>
              <option value="published">{t.tripStatusPublished || 'Publicada'}</option>
              <option value="cancelled">{t.tripStatusCancelled || 'Cancelada'}</option>
              <option value="completed">{t.tripStatusCompleted || 'Concluída'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripCoverLabel || 'Capa'}</label>
            <input type="file" accept="image/*" onChange={handleCoverSelect} disabled={isBusy} className="hidden" id="trip-cover-edit" />
            {!coverPreview && !currentCoverUrl && (
              <label htmlFor="trip-cover-edit" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-amz-areia-dark/20 dark:border-white/10 text-sm text-amz-terra-light dark:text-amz-areia/40 hover:border-amz-oceano/50 hover:text-amz-oceano transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {t.tripCoverUpload || 'Selecionar imagem'}
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripVisibilityLabel || 'Visibilidade'}</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'private')} disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50">
              <option value="public">{t.tripVisibilityPublic || 'Pública — aparece na listagem'}</option>
              <option value="private">{t.tripVisibilityPrivate || 'Privada — só participantes veem'}</option>
            </select>
          </div>

          {errorMessage && <p className="text-xs text-red-500 font-medium">{errorMessage}</p>}
          {status === 'success' && <p className="text-xs text-emerald-600 font-medium">{t.tripSaveSuccess || 'Salvo com sucesso!'}</p>}

          <button onClick={handleSubmit} disabled={!title.trim() || isBusy}
            className="w-full py-3 rounded-xl bg-amz-dourado text-white text-sm font-semibold hover:bg-amz-dourado/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {isBusy ? (t.tripSaving || 'Salvando...') : (t.tripSave || 'Salvar')}
          </button>
        </div>
      </main>
    </div>
  )
}
