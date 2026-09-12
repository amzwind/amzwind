import { useState, useRef } from 'react'
import { createPost, type PostFeedItem } from '../../services/feed'

type Status = 'idle' | 'uploading' | 'publishing' | 'success' | 'error'

interface CreatePostProps {
  userId: string
  userName: string | null
  avatarUrl: string | null
  onPostCreated: (post: PostFeedItem) => void
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video')
}

export default function CreatePost({ userId, userName, avatarUrl, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaFile(file)
    setMediaPreview(URL.createObjectURL(file))
  }

  function removeMedia() {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview)
    setMediaFile(null)
    setMediaPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    if ((!content.trim() && !mediaFile) || status === 'uploading' || status === 'publishing') return

    setStatus(mediaFile ? 'uploading' : 'publishing')
    setErrorMessage('')

    try {
      const post = await createPost(userId, content, mediaFile)
      onPostCreated({
        ...post,
        comments_count: 0,
        liked_by_me: false,
      })
      setContent('')
      removeMedia()
      setStatus('success')
      setTimeout(() => setStatus('idle'), 1500)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao publicar.')
      setStatus('error')
    }
  }

  const isBusy = status === 'uploading' || status === 'publishing'

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-amz-areia-dark/20 dark:border-white/5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amz-dourado/20 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-amz-dourado">{getInitials(userName)}</span>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compartilhe sua session de kite... 🪁"
            disabled={isBusy}
            className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm resize-none disabled:opacity-50"
          />

          {mediaPreview && (
            <div className="relative inline-block">
              {isVideoUrl(mediaFile?.name || '') ? (
                <video src={mediaPreview} className="w-32 h-32 rounded-xl object-cover" preload="metadata" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="w-32 h-32 rounded-xl object-cover" />
              )}
              {!isBusy && (
                <button
                  onClick={removeMedia}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
          )}

          {status === 'success' && (
            <p className="text-xs text-emerald-600 font-medium">Publicado com sucesso!</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isBusy}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amz-oceano hover:bg-amz-oceano/10 transition-colors disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Foto/Vídeo
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isBusy || (!content.trim() && !mediaFile)}
              className="px-5 py-2 rounded-xl bg-amz-dourado text-white text-sm font-semibold hover:bg-amz-dourado/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isBusy ? (status === 'uploading' ? 'Enviando mídia...' : 'Publicando...') : 'Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
