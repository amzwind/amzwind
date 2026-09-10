import { useEffect, useState } from 'react'
import { supabase, Tables } from '../../services/supabase'
import { FileUpload, Toast, ConfirmModal } from './SharedUI'

type ClassRow = Tables<'classes'>

export function ClassesManager() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('2h')
  const [level, setLevel] = useState('Iniciante')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<ClassRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setToast({ message: 'Erro ao carregar aulas: ' + error.message, type: 'error' })
    } else if (data) {
      setClasses(data)
    }
    setLoading(false)
  }

  const openCreateModal = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setPrice('')
    setDuration('2h')
    setLevel('Iniciante')
    setImageUrl('')
    setVideoUrl('')
    setIsModalOpen(true)
  }

  const openEditModal = (cls: ClassRow) => {
    setEditingId(cls.id)
    setTitle(cls.title)
    setDescription(cls.description || '')
    setPrice(cls.price?.toString() || '')
    setDuration(cls.duration || '2h')
    setLevel(cls.level || 'Iniciante')
    setImageUrl(cls.image_url || '')
    setVideoUrl(cls.video_url || '')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSaving(true)
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      price: parseFloat(price) || 0,
      duration,
      level,
      image_url: imageUrl || null,
      video_url: videoUrl || null,
    }

    if (editingId) {
      const { error } = await supabase
        .from('classes')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setToast({ message: 'Erro ao atualizar aula: ' + error.message, type: 'error' })
      } else {
        setToast({ message: 'Aula atualizada com sucesso!', type: 'success' })
        setIsModalOpen(false)
        fetchClasses()
      }
    } else {
      const { error } = await supabase.from('classes').insert(payload)

      if (error) {
        setToast({ message: 'Erro ao criar aula: ' + error.message, type: 'error' })
      } else {
        setToast({ message: 'Aula criada com sucesso!', type: 'success' })
        setIsModalOpen(false)
        fetchClasses()
      }
    }

    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', deleteTarget.id)

    if (error) {
      setToast({ message: 'Erro ao excluir aula: ' + error.message, type: 'error' })
    } else {
      setToast({ message: 'Aula excluída.', type: 'success' })
      fetchClasses()
    }
    setDeleteTarget(null)
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-400 dark:text-white/40 animate-pulse">
        Carregando aulas...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-maybug text-gray-900 dark:text-white">Gerenciar Aulas</h2>
          <p className="text-xs text-amz-terra-light dark:text-amz-areia/60">
            Configure os pacotes de aulas, mídias e valores.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amz-dourado text-white text-sm font-semibold hover:bg-amber-700 active:bg-amber-800 transition-all"
        >
          + Nova Aula
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-12 border border-gray-100 dark:border-white/[0.06] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-white/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 dark:text-white/30">Nenhuma aula cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white dark:bg-white/[0.03] rounded-2xl p-4 border border-gray-100 dark:border-white/[0.06] flex justify-between items-center hover:border-gray-200 dark:hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {cls.image_url ? (
                  <img
                    src={cls.image_url}
                    alt={cls.title}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-amz-dourado/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">{cls.title}</h3>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/70">
                    {cls.duration} {cls.level && `• ${cls.level}`}
                  </p>
                  <p className="text-sm font-semibold text-amz-terra dark:text-amz-dourado mt-1">
                    R$ {cls.price}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(cls)}
                  className="px-3 py-1.5 rounded-lg bg-amz-dourado/10 text-amz-dourado text-xs font-semibold hover:bg-amz-dourado/20 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleteTarget(cls)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#1a0f08] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-white/[0.06]">
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
            </div>
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Aula' : 'Nova Aula'}
                </h3>
                <button
                  onClick={() => !saving && setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40 mb-1.5">
                    Titulo
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
                    placeholder="Ex: Aula Particular de Kite"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40 mb-1.5">
                      Preco (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40 mb-1.5">
                      Duracao
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
                      placeholder="Ex: 2h30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40 mb-1.5">
                    Nivel
                  </label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
                    placeholder="Ex: Iniciante / Intermediario"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40 mb-1.5">
                    Descricao
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado resize-none transition-all"
                  />
                </div>

                <FileUpload
                  label="Imagem Principal da Aula"
                  accept="image/*"
                  value={imageUrl}
                  onUpload={setImageUrl}
                />
                <FileUpload
                  label="Video Promocional (Opcional)"
                  accept="video/*"
                  value={videoUrl}
                  onUpload={setVideoUrl}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-semibold text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amz-dourado text-white text-sm font-semibold hover:bg-amber-700 active:bg-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar Aula'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Excluir Aula"
          message={`Tem certeza que deseja excluir "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  )
}
