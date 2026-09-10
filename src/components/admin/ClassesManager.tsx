import React, { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { FileUpload } from './SharedUI'

export function ClassesManager() {
  const [classes, setClasses] = useState<any[]>([])
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
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase.from('classes').select('*').order('created_at', { ascending: false })
      if (error) throw error
      if (data) setClasses(data)
    } catch (err) {
      console.error('Erro ao buscar aulas:', err)
    } finally {
      setLoading(false)
    }
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
    setGalleryUrls([])
    setIsModalOpen(true)
  }

  const openEditModal = (cls: any) => {
    setEditingId(cls.id)
    setTitle(cls.title || '')
    setDescription(cls.description || '')
    setPrice(cls.price?.toString() || '')
    setDuration(cls.duration || '2h')
    setLevel(cls.level || 'Iniciante')
    setImageUrl(cls.image_url || '')
    setVideoUrl(cls.video_url || '')
    setGalleryUrls(cls.gallery_urls || [])
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        title,
        description,
        price: parseFloat(price) || 0,
        duration,
        level,
        image_url: imageUrl,
        video_url: videoUrl,
        gallery_urls: galleryUrls
      }

      if (editingId) {
        const { error } = await supabase.from('classes').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('classes').insert(payload)
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchClasses()
    } catch (err: any) {
      alert('Erro ao salvar aula: ' + err.message)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('classes').delete().eq('id', deleteId)
      if (error) throw error
      setDeleteId(null)
      fetchClasses()
    } catch (err: any) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  if (loading) return <div className="p-6 text-sm opacity-60">Carregando aulas...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-maybug">Gerenciar Aulas (KiteSchool)</h2>
          <p className="text-xs text-amz-terra-light dark:text-amz-areia/60">Configure os pacotes de aulas, mídias e valores.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-xs py-2 px-4 cursor-pointer">+ Nova Aula</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white dark:bg-amz-terra/30 p-4 rounded-xl border border-amber-900/10 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {cls.image_url && <img src={cls.image_url} alt={cls.title} className="w-16 h-16 object-cover rounded-lg" />}
              <div>
                <h3 className="font-bold text-base">{cls.title}</h3>
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/70">{cls.duration} • {cls.level}</p>
                <p className="text-sm font-semibold text-amz-terra dark:text-amz-dourado mt-1">R$ {cls.price}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(cls)} className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold cursor-pointer">Editar</button>
              <button onClick={() => setDeleteId(cls.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer">Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#3D1D0F] max-w-lg w-full p-6 rounded-2xl shadow-xl border border-amber-900/25 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-maybug text-2xl mb-4 text-amz-terra dark:text-amz-dourado">{editingId ? 'Editar Aula' : 'Nova Aula'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: Aula Particular de Kite" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold mb-1">Preço (R$)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold mb-1">Duração</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: 2h30" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Nível</label>
                <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: Iniciante / Intermediário" />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Descrição</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" />
              </div>

              <FileUpload label="Imagem Principal da Aula" accept="image/*" value={imageUrl} onUpload={setImageUrl} />
              <FileUpload label="Vídeo Promocional (Opcional)" accept="video/*" value={videoUrl} onUpload={setVideoUrl} />

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-900/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full text-sm font-semibold border border-amber-900/20 cursor-pointer">Cancelar</button>
                <button type="submit" className="btn-primary text-sm py-2 px-6 cursor-pointer">Salvar Aula</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#3D1D0F] max-w-sm w-full p-6 rounded-2xl shadow-xl border border-amber-900/20 text-center">
            <h3 className="font-maybug text-xl mb-2 text-amz-terra dark:text-amz-dourado">Excluir Aula</h3>
            <p className="text-xs opacity-80 mb-6">Tem certeza que deseja remover esta aula permanentemente?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-full text-xs font-semibold border border-amber-900/20 cursor-pointer">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}