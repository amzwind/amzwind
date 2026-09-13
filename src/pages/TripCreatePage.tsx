import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import { createTrip, createTripConversation, updateTrip } from '../services/trips'

type Status = 'idle' | 'uploading' | 'saving' | 'success' | 'error'

export default function TripCreatePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(t.tripCoverTooLarge || 'Imagem muito grande. Limite: 10MB')
      return
    }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function removeCover() {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(null)
    setCoverPreview(null)
  }

  async function handleSubmit() {
    if (!title.trim() || status === 'uploading' || status === 'saving') return

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
      let coverUrl: string | null = null
      if (coverFile) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Não autenticado')
        const ext = coverFile.name.split('.').pop() || 'jpg'
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('trip-covers')
          .upload(path, coverFile, { contentType: coverFile.type })
        if (uploadError) throw new Error('Falha no upload: ' + uploadError.message)
        const { data: urlData } = supabase.storage.from('trip-covers').getPublicUrl(path)
        coverUrl = urlData?.publicUrl || null
      }

      setStatus('saving')

      const tripId = await createTrip({
        title: title.trim(),
        description: description.trim() || undefined,
        destination: destination.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        max_participants: maxP,
      })

      if (coverUrl) {
        await updateTrip(tripId, { cover_url: coverUrl })
      }

      try {
        await createTripConversation(tripId)
      } catch {
        // Non-critical: trip created without group
      }

      setStatus('success')
      setTimeout(() => navigate(`/trips/${tripId}`), 800)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao criar viagem')
      setStatus('error')
    }
  }

  const isBusy = status === 'uploading' || status === 'saving'

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia">
          {t.tripCreate || 'Nova Trip'}
        </h1>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 p-5 space-y-4">
          {coverPreview && (
            <div className="relative inline-block">
              <img src={coverPreview} alt="Cover" className="w-full h-40 rounded-xl object-cover" />
              {!isBusy && (
                <button
                  onClick={removeCover}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
              {t.tripTitleLabel || 'Título'} *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.tripTitlePlaceholder || 'Ex: Downwind Maranhão 2026'}
              disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
              {t.tripDescriptionLabel || 'Descrição'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t.tripDescriptionPlaceholder || 'Descreva a trip...'}
              disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 resize-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
              {t.tripDestinationLabel || 'Destino'}
            </label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t.tripDestinationPlaceholder || 'Ex: Maranhão, Brasil'}
              disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
                {t.tripStartDate || 'Data início'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isBusy}
                className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
                {t.tripEndDate || 'Data fim'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isBusy}
                className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
              {t.tripMaxParticipantsLabel || 'Máx. participantes'}
            </label>
            <input
              type="number"
              min={2}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder={t.tripMaxParticipantsPlaceholder || 'Ex: 12'}
              disabled={isBusy}
              className="w-full px-4 py-2.5 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">
              {t.tripCoverLabel || 'Capa'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              disabled={isBusy}
              className="hidden"
              id="trip-cover-input"
            />
            {!coverPreview && (
              <label
                htmlFor="trip-cover-input"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-amz-areia-dark/20 dark:border-white/10 text-sm text-amz-terra-light dark:text-amz-areia/40 hover:border-amz-oceano/50 hover:text-amz-oceano transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {t.tripCoverUpload || 'Selecionar imagem'}
              </label>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
          )}

          {status === 'success' && (
            <p className="text-xs text-emerald-600 font-medium">{t.tripCreateSuccess || 'Trip criada com sucesso!'}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isBusy}
            className="w-full py-3 rounded-xl bg-amz-dourado text-white text-sm font-semibold hover:bg-amz-dourado/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isBusy
              ? (status === 'uploading' ? (t.tripUploading || 'Enviando capa...') : (t.tripSaving || 'Salvando...'))
              : (t.tripCreateButton || 'Criar Trip')
            }
          </button>
        </div>
      </main>
    </div>
  )
}
