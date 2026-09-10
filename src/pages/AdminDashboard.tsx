import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'stats' | 'experiences' | 'bookings'>('stats')

  // Estados para dados
  const [experiences, setExperiences] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Estado do Formulário (Edição / Criação)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [community, setCommunity] = useState('')
  const [level, setLevel] = useState('Intermediário')
  const [categoryId, setCategoryId] = useState('')

  // Nova Categoria Modal State
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // URLs / Arquivos de Mídia
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || profile?.role !== 'admin') {
        alert('Acesso restrito a administradores.')
        navigate('/')
        return
      }

      setIsAdmin(true)
      loadDashboardData()
    } catch (err) {
      console.error('Erro ao verificar permissões:', err)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      const { data: expData } = await supabase
        .from('experiences')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })

      if (expData) setExperiences(expData)

      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (catData) setCategories(catData)

      const { data: bookData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (bookData) setBookings(bookData)
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err)
    }
  }

  // Função genérica de upload para o Supabase Storage (Corrigida)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'gallery') => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const bucketName = 'experiences'

      if (type === 'gallery') {
        const uploadedUrls: string[] = [...galleryUrls]
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
          const filePath = `gallery/${fileName}`

          const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file)
          if (uploadError) throw uploadError

          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
          if (data?.publicUrl) uploadedUrls.push(data.publicUrl)
        }
        setGalleryUrls(uploadedUrls)
      } else {
        const file = files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file)
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
        if (data?.publicUrl) {
          if (type === 'image') setImageUrl(data.publicUrl)
          if (type === 'video') setVideoUrl(data.publicUrl)
        }
      }
    } catch (err: any) {
      alert('Erro ao enviar arquivo: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const openCreateModal = () => {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setPrice('')
    setDescription('')
    setCommunity('')
    setLevel('Intermediário')
    setImageUrl('')
    setVideoUrl('')
    setGalleryUrls([])
    setCategoryId(categories[0]?.id || '')
    setIsNewCategoryMode(false)
    setIsModalOpen(true)
  }

  const openEditModal = (exp: any) => {
    setEditingId(exp.id)
    setTitle(exp.title || '')
    setSlug(exp.slug || '')
    setPrice(exp.price?.toString() || '')
    setDescription(exp.description || '')
    setCommunity(exp.community || '')
    setLevel(exp.level || 'Intermediário')
    setImageUrl(exp.image_url || '')
    setVideoUrl(exp.video_url || '')
    setGalleryUrls(exp.gallery_urls || [])
    setCategoryId(exp.category_id || '')
    setIsNewCategoryMode(false)
    setIsModalOpen(true)
  }

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let finalCategoryId = categoryId

      if (isNewCategoryMode && newCategoryName.trim()) {
        const newSlug = newCategoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        const { data: newCat, error: catError } = await supabase
          .from('categories')
          .insert({ name: newCategoryName.trim(), slug: newSlug, type: 'experience' })
          .select()
          .single()

        if (catError) throw catError
        if (newCat) {
          finalCategoryId = newCat.id
          await loadDashboardData()
        }
      }

      if (!finalCategoryId) {
        alert('Selecione ou crie uma categoria válida.')
        return
      }

      const generatedSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

      const payload = {
        title,
        slug: generatedSlug,
        price: parseFloat(price) || 0,
        description,
        community,
        level,
        category_id: finalCategoryId,
        image_url: imageUrl,
        video_url: videoUrl,
        gallery_urls: galleryUrls,
        featured: true
      }

      if (editingId) {
        const { error } = await supabase.from('experiences').update(payload).eq('id', editingId)
        if (error) throw error
        alert('Experiência atualizada com sucesso!')
      } else {
        const { error } = await supabase.from('experiences').insert(payload)
        if (error) throw error
        alert('Experiência criada com sucesso!')
      }

      setIsModalOpen(false)
      loadDashboardData()
    } catch (err: any) {
      alert('Erro ao salvar experiência: ' + err.message)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return
    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) throw error
      alert('Experiência excluída com sucesso!')
      loadDashboardData()
    } catch (err: any) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="text-amz-terra dark:text-amz-areia font-maybug text-xl animate-pulse">
          Carregando Painel Administrativo...
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark text-amz-terra-dark dark:text-amz-areia pb-20">
      <header className="bg-white dark:bg-amz-terra/40 shadow-sm border-b border-amber-900/10 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia">Amazon Wind — Admin</h1>
          <p className="text-xs uppercase tracking-widest text-amz-terra-light dark:text-amz-areia/60">Gestão Operacional de Expedições</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-amz-terra/30 dark:border-amz-areia/30 hover:bg-amz-terra hover:text-white transition cursor-pointer"
        >
          Voltar ao Site
        </button>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-6 flex gap-4 border-b border-amber-900/10 pb-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${activeTab === 'stats' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${activeTab === 'experiences' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
        >
          Experiências & Downwinds ({experiences.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${activeTab === 'bookings' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
        >
          Reservas ({bookings.length})
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
              <h3 className="text-sm uppercase text-amz-terra-light dark:text-amz-areia/60">Total de Experiências</h3>
              <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{experiences.length}</p>
            </div>
            <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
              <h3 className="text-sm uppercase text-amz-terra-light dark:text-amz-areia/60">Reservas Registradas</h3>
              <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{bookings.length}</p>
            </div>
            <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
              <h3 className="text-sm uppercase text-amz-terra-light dark:text-amz-areia/60">Status do Banco</h3>
              <p className="text-lg font-semibold mt-2 text-emerald-600 dark:text-emerald-400">● Conectado (Supabase)</p>
            </div>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-maybug">Gerenciar Roteiros e Downwinds</h2>
              <button
                onClick={openCreateModal}
                className="btn-primary text-sm py-2 px-4 cursor-pointer"
              >
                + Nova Experiência
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-white dark:bg-amz-terra/30 p-5 rounded-xl border border-amber-900/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {exp.image_url && (
                      <img src={exp.image_url} alt={exp.title} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{exp.title}</h3>
                      <p className="text-xs text-amz-terra-light dark:text-amz-areia/70">Local: {exp.community || 'Geral'}</p>
                      <p className="text-sm font-semibold text-amz-terra dark:text-amz-dourado mt-1">R$ {exp.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
              {experiences.length === 0 && (
                <p className="text-amz-terra-light dark:text-amz-areia/60 italic">Nenhuma experiência cadastrada ainda.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-maybug mb-6">Gerenciamento de Reservas</h2>
            {bookings.length === 0 ? (
              <p className="text-amz-terra-light dark:text-amz-areia/60 italic">Nenhuma reserva registrada no momento.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-amz-terra/30 p-4 rounded-xl border border-amber-900/10 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">Tipo: {booking.item_type}</p>
                      <p className="text-xs text-amz-terra-light dark:text-amz-areia/60">Data: {new Date(booking.booking_date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold uppercase">
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#3D1D0F] max-w-2xl w-full p-6 rounded-2xl shadow-xl border border-amber-900/20 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-maybug text-2xl mb-4 text-amz-terra dark:text-amz-dourado">
              {editingId ? 'Editar Experiência / Roteiro' : 'Adicionar Nova Experiência'}
            </h3>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Título do Downwind / Roteiro</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="Ex: Ajuruteua > Salinas"
                />
              </div>

              {/* Seletor de Categoria com opção de criar nova */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs uppercase font-semibold">Categoria</label>
                  <button
                    type="button"
                    onClick={() => setIsNewCategoryMode(!isNewCategoryMode)}
                    className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                  >
                    {isNewCategoryMode ? '← Selecionar existente' : '+ Criar nova categoria'}
                  </button>
                </div>

                {isNewCategoryMode ? (
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nome da nova categoria..."
                    className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  />
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-white dark:bg-[#2d150b] text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                    placeholder="450.00"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold mb-1">Nível de Dificuldade</label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                    placeholder="Ex: Intermediário / Avançado"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Comunidade / Local Base</label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="Ex: Salinópolis - PA"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="Detalhes da expedição..."
                />
              </div>

              {/* Upload de Imagem de Capa */}
              <div className="p-4 rounded-xl border border-amber-900/10 bg-amber-500/5">
                <label className="block text-xs uppercase font-semibold mb-2">Imagem de Capa (Principal)</label>
                {imageUrl && (
                  <div className="mb-2 flex items-center gap-2">
                    <img src={imageUrl} alt="Capa" className="w-16 h-16 object-cover rounded-lg border" />
                    <span className="text-xs truncate max-w-xs">{imageUrl}</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amz-terra file:text-white hover:file:bg-amz-terra-dark cursor-pointer"
                />
              </div>

              {/* Upload de Vídeo */}
              <div className="p-4 rounded-xl border border-amber-900/10 bg-amber-500/5">
                <label className="block text-xs uppercase font-semibold mb-2">Vídeo Promocional (Arquivo ou URL)</label>
                {videoUrl && (
                  <p className="text-xs truncate text-emerald-600 mb-2">Vídeo configurado: {videoUrl}</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amz-terra file:text-white hover:file:bg-amz-terra-dark cursor-pointer flex-1"
                  />
                </div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Ou cole o link do YouTube / Vimeo aqui..."
                  className="w-full mt-2 px-3 py-1.5 rounded-lg border border-amber-900/20 bg-transparent text-xs focus:outline-none"
                />
              </div>

              {/* Galeria de Imagens */}
              <div className="p-4 rounded-xl border border-amber-900/10 bg-amber-500/5">
                <label className="block text-xs uppercase font-semibold mb-2">Galeria de Imagens (Múltiplas Fotos)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt={`Galeria ${idx}`} className="w-14 h-14 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amz-terra file:text-white hover:file:bg-amz-terra-dark cursor-pointer"
                />
              </div>

              {uploading && (
                <p className="text-xs text-amber-600 font-semibold animate-pulse text-center">Enviando arquivo para o Storage...</p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-900/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-amber-900/20 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary text-sm py-2 px-6 cursor-pointer disabled:opacity-50"
                >
                  {editingId ? 'Salvar Alterações' : 'Criar Roteiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}