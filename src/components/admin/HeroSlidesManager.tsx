import React, { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { ConfirmModal, FileUpload } from './SharedUI'

export function HeroSlidesManager() {
    const [slides, setSlides] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Campos do Slide
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [mediaUrl, setMediaUrl] = useState('')
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
    const [ctaText, setCtaText] = useState('')
    const [ctaLink, setCtaLink] = useState('')
    const [displayOrder, setDisplayOrder] = useState('0')

    // Modal de Confirmação de Exclusão
    const [deleteId, setDeleteId] = useState<string | null>(null)

    useEffect(() => {
        fetchSlides()
    }, [])

    const fetchSlides = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('display_order', { ascending: true })
            if (error) throw error
            if (data) setSlides(data)
        } catch (err) {
            console.error('Erro ao buscar slides da Hero:', err)
        } finally {
            setLoading(false)
        }
    }

    const openCreateModal = () => {
        setEditingId(null)
        setTitle('')
        setSubtitle('')
        setMediaUrl('')
        setMediaType('image')
        setCtaText('Explorar Roteiros')
        setCtaLink('#experiencias')
        setDisplayOrder(slides.length.toString())
        setIsModalOpen(true)
    }

    const openEditModal = (slide: any) => {
        setEditingId(slide.id)
        setTitle(slide.title || '')
        setSubtitle(slide.subtitle || '')
        setMediaUrl(slide.media_url || '')
        setMediaType(slide.media_type || 'image')
        setCtaText(slide.cta_text || '')
        setCtaLink(slide.cta_link || '')
        setDisplayOrder(slide.display_order?.toString() || '0')
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mediaUrl) {
            alert('Por favor, envie ou informe a URL da mídia de fundo.')
            return
        }

        try {
            const payload = {
                title,
                subtitle,
                media_url: mediaUrl,
                media_type: mediaType,
                cta_text: ctaText,
                cta_link: ctaLink,
                display_order: parseInt(displayOrder) || 0
            }

            if (editingId) {
                const { error } = await supabase.from('hero_slides').update(payload).eq('id', editingId)
                if (error) throw error
            } else {
                const { error } = await supabase.from('hero_slides').insert(payload)
                if (error) throw error
            }

            setIsModalOpen(false)
            fetchSlides()
        } catch (err: any) {
            alert('Erro ao salvar slide: ' + err.message)
        }
    }

    const confirmDelete = async () => {
        if (!deleteId) return
        try {
            const { error } = await supabase.from('hero_slides').delete().eq('id', deleteId)
            if (error) throw error
            setDeleteId(null)
            fetchSlides()
        } catch (err: any) {
            alert('Erro ao excluir slide: ' + err.message)
        }
    }

    if (loading) return <div className="p-6 text-sm opacity-60">Carregando slides...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-maybug">Gerenciar Fundo da Hero (Slider Dinâmico)</h2>
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/60">Configure as imagens e vídeos de destaque da página inicial.</p>
                </div>
                <button onClick={openCreateModal} className="btn-primary text-xs py-2 px-4 cursor-pointer">
                    + Novo Slide
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slides.map((slide) => (
                    <div key={slide.id} className="bg-white dark:bg-amz-terra/30 p-4 rounded-xl border border-amber-900/10 flex flex-col justify-between">
                        <div className="relative h-36 bg-black/10 rounded-lg overflow-hidden mb-3">
                            {slide.media_type === 'video' ? (
                                <video src={slide.media_url} className="w-full h-full object-cover" muted autoPlay loop />
                            ) : (
                                <img src={slide.media_url} alt={slide.title} className="w-full h-full object-cover" />
                            )}
                            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                                Ordem: {slide.display_order}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-base">{slide.title}</h3>
                            <p className="text-xs opacity-70 line-clamp-1">{slide.subtitle}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-amber-900/10">
                            <button onClick={() => openEditModal(slide)} className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold cursor-pointer">
                                Editar
                            </button>
                            <button onClick={() => setDeleteId(slide.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer">
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Criação / Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white dark:bg-[#3D1D0F] max-w-lg w-full p-6 rounded-2xl shadow-xl border border-amber-900/20 my-8">
                        <h3 className="font-maybug text-2xl mb-2 text-amz-terra dark:text-amz-dourado">
                            {editingId ? 'Editar Slide da Hero' : 'Adicionar Novo Slide'}
                        </h3>

                        {/* Guia Visual de Dimensões Recomendadas */}
                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                            💡 <strong>Dica de Performance e Design:</strong>
                            <br />• <strong>Resolução ideal:</strong> 1920x1080px (Proporção 16:9).
                            <br />• <strong>Vídeos:</strong> Formato MP4 otimizado (Codec H.264), tamanho recomendado menor que 15MB.
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-semibold mb-1">Título de Destaque</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: Expedições na Costa Norte" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-semibold mb-1">Subtítulo</label>
                                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: Sinta a força dos ventos alísios" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-semibold mb-1">Tipo de Mídia</label>
                                    <select value={mediaType} onChange={(e) => setMediaType(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-white dark:bg-[#2d150b] text-sm">
                                        <option value="image">Imagem</option>
                                        <option value="video">Vídeo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-semibold mb-1">Ordem de Exibição</label>
                                    <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" />
                                </div>
                            </div>

                            {/* Upload da Mídia corrigido para usar onUpload */}
                            <FileUpload
                                label={mediaType === 'image' ? 'Arquivo de Imagem (1920x1080px)' : 'Arquivo de Vídeo MP4'}
                                accept={mediaType === 'image' ? 'image/*' : 'video/mp4'}
                                value={mediaUrl}
                                onUpload={setMediaUrl}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-semibold mb-1">Texto do Botão (CTA)</label>
                                    <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: Ver Roteiros" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-semibold mb-1">Link do Botão</label>
                                    <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm" placeholder="Ex: #experiencias" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-amber-900/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full text-sm font-semibold border border-amber-900/20 cursor-pointer">Cancelar</button>
                                <button type="submit" className="btn-primary text-sm py-2 px-6 cursor-pointer">Salvar Slide</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Exclusão Blindado */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#3D1D0F] max-w-sm w-full p-6 rounded-2xl shadow-xl border border-amber-900/20 text-center">
                        <h3 className="font-maybug text-xl mb-2 text-amz-terra dark:text-amz-dourado">Excluir Slide da Hero</h3>
                        <p className="text-xs opacity-80 mb-6">Tem certeza que deseja remover este slide do carrossel principal?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-full text-xs font-semibold border border-amber-900/20 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            >
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}