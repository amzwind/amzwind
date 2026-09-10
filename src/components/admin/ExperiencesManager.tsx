import { useState, useEffect, type FormEvent } from 'react'
import { supabase, type Tables } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import { ModalShell, FormField, Input, Select, Textarea, PrimaryButton, GhostButton, EmptyState, Toast } from './SharedUI'

type Experience = Tables<'experiences'>
type Category = Tables<'categories'>

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export default function ExperiencesManager() {
  const { t } = useLanguage()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')

  const emptyForm = { title: '', description: '', category_id: '', price: '', duration: '', level: t.adminLevels[1], community: '', image_url: '', video_url: '', featured: false }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [expRes, catRes] = await Promise.all([
      supabase.from('experiences').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('type', 'experience').order('name'),
    ])
    if (expRes.data) setExperiences(expRes.data)
    if (catRes.data) setCategories(catRes.data)
  }

  function openCreate() {
    setEditingExp(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id || '' })
    setShowModal(true)
  }

  function openEdit(exp: Experience) {
    setEditingExp(exp)
    setForm({
      title: exp.title, description: exp.description || '', category_id: exp.category_id,
      price: String(exp.price), duration: exp.duration || '', level: exp.level || t.adminLevels[1],
      community: exp.community || '', image_url: exp.image_url || '', video_url: exp.video_url || '', featured: exp.featured,
    })
    setShowModal(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const payload = {
      title: form.title, slug: slugify(form.title), description: form.description || null,
      category_id: form.category_id, price: Number(form.price) || 0, duration: form.duration || null,
      level: form.level || null, community: form.community || null, image_url: form.image_url || null,
      video_url: form.video_url || null, featured: form.featured,
    }
    const { error } = editingExp
      ? await supabase.from('experiences').update(payload).eq('id', editingExp.id)
      : await supabase.from('experiences').insert(payload)
    if (error) { setToast({ message: error.message, type: 'error' }) }
    else { setToast({ message: editingExp ? t.adminExpUpdated : t.adminExpCreated, type: 'success' }); setShowModal(false); await loadData() }
    setFormLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.adminExpDeleteConfirm)) return
    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: t.adminExpDeleted, type: 'success' }); await loadData() }
  }

  const filtered = experiences.filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.adminExpTitle}</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{t.adminExpSubtitle}</p>
        </div>
        <PrimaryButton onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {t.adminNewExperience}
        </PrimaryButton>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.adminSearch}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 transition-all"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} message={t.adminExpNoData} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((exp) => (
            <div key={exp.id} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {exp.image_url && <div className="h-32 bg-gray-100 dark:bg-white/5 overflow-hidden"><img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{exp.title}</h3>
                    <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">{exp.community || '—'} · {exp.duration || '—'}</p>
                  </div>
                  {exp.featured && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 px-2 py-0.5 rounded-full shrink-0">★</span>}
                </div>
                <p className="text-lg font-bold text-amz-dourado mt-2">R$ {exp.price}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(exp)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">{t.adminEdit}</button>
                  <button onClick={() => handleDelete(exp.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">{t.adminDelete}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ModalShell onClose={() => setShowModal(false)} title={editingExp ? t.adminEditExperience : t.adminNewExperience}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label={t.adminExpFormTitle}><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Downwind Ajuruteua → Salinas" /></FormField>
            <FormField label={t.adminExpFormDescription}><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="..." /></FormField>
            <FormField label={t.adminExpFormCategory}>
              <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">{t.adminExpFormSelectCategory}</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.adminExpFormPrice}><Input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="450.00" /></FormField>
              <FormField label={t.adminExpFormDuration}><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2h30" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.adminExpFormLevel}>
                <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  {t.adminLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </Select>
              </FormField>
              <FormField label={t.adminExpFormCommunity}><Input value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} placeholder="Ajuruteua" /></FormField>
            </div>
            <FormField label={t.adminExpFormImageUrl}><Input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></FormField>
            <FormField label={t.adminExpFormVideoUrl}><Input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/..." /></FormField>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className={`relative w-10 h-[22px] rounded-full transition-colors ${form.featured ? 'bg-amz-dourado' : 'bg-gray-200 dark:bg-white/10'}`} onClick={() => setForm({ ...form, featured: !form.featured })}>
                <div className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-[18px]' : ''}`} />
              </div>
              <span className="text-sm text-gray-700 dark:text-white/60">{t.adminExpFormFeatured}</span>
            </label>
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
              <GhostButton type="button" onClick={() => setShowModal(false)} className="flex-1">{t.adminCancel}</GhostButton>
              <PrimaryButton type="submit" disabled={formLoading} className="flex-1">{formLoading ? '...' : editingExp ? t.adminExpFormUpdate : t.adminExpFormCreate}</PrimaryButton>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  )
}
