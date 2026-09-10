import { useState, useEffect, type FormEvent } from 'react'
import { supabase, type Tables } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import { ModalShell, FormField, Input, Select, Textarea, PrimaryButton, GhostButton, EmptyState, Toast } from './SharedUI'

type ClassItem = Tables<'experiences'>

export default function ClassesManager() {
  const { t } = useLanguage()
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ClassItem | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')

  const emptyForm = { title: '', description: '', price: '', duration: '', level: t.adminLevels[0], community: '' }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    // Aulas são experiências com category_id de tipo 'class'
    const { data } = await supabase.from('experiences').select('*').order('created_at', { ascending: false })
    if (data) setClasses(data)
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(c: ClassItem) {
    setEditing(c)
    setForm({ title: c.title, description: c.description || '', price: String(c.price), duration: c.duration || '', level: c.level || t.adminLevels[0], community: c.community || '' })
    setShowModal(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const payload = {
      title: form.title, slug: form.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description: form.description || null, price: Number(form.price) || 0, duration: form.duration || null,
      level: form.level || null, community: form.community || null, category_id: '',
    }
    const { error } = editing
      ? await supabase.from('experiences').update(payload).eq('id', editing.id)
      : await supabase.from('experiences').insert(payload)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: editing ? t.adminClassUpdated : t.adminClassCreated, type: 'success' }); setShowModal(false); await loadData() }
    setFormLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.adminClassDeleteConfirm)) return
    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: t.adminClassDeleted, type: 'success' }); await loadData() }
  }

  const filtered = classes.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.adminClassTitle}</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{t.adminClassSubtitle}</p>
        </div>
        <PrimaryButton onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {t.adminNewClass}
        </PrimaryButton>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.adminSearch} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 transition-all" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} message={t.adminClassNoData} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-1">{c.duration || '—'} · {c.level || '—'}</p>
              <p className="text-lg font-bold text-amz-dourado mt-3">R$ {c.price}</p>
              {c.description && <p className="text-xs text-gray-500 dark:text-white/40 mt-2 line-clamp-2">{c.description}</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(c)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">{t.adminEdit}</button>
                <button onClick={() => handleDelete(c.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">{t.adminDelete}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ModalShell onClose={() => setShowModal(false)} title={editing ? t.adminEditClass : t.adminNewClass}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label={t.adminClassFormTitle}><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
            <FormField label={t.adminClassFormDescription}><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.adminClassFormPrice}><Input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></FormField>
              <FormField label={t.adminClassFormDuration}><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2h" /></FormField>
            </div>
            <FormField label={t.adminClassFormLevel}>
              <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {t.adminLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </FormField>
            <FormField label={t.adminClassFormInstructor}><Input value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} placeholder="Pingo / Pablo / Rafael" /></FormField>
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
              <GhostButton type="button" onClick={() => setShowModal(false)} className="flex-1">{t.adminCancel}</GhostButton>
              <PrimaryButton type="submit" disabled={formLoading} className="flex-1">{formLoading ? '...' : editing ? t.adminClassFormUpdate : t.adminClassFormCreate}</PrimaryButton>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  )
}
