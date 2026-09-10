import { useState, useEffect, type FormEvent } from 'react'
import { supabase, type Tables } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import { ModalShell, FormField, Input, Select, Textarea, PrimaryButton, GhostButton, EmptyState, Toast } from './SharedUI'

type Product = Tables<'products'>
type Category = Tables<'categories'>

export default function ProductsManager() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')

  const emptyForm = { title: '', description: '', price: '', stock: '', category_id: '', image_url: '' }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [pRes, cRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('type', 'product').order('name'),
    ])
    if (pRes.data) setProducts(pRes.data)
    if (cRes.data) setCategories(cRes.data)
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id || '' })
    setShowModal(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({ title: p.title, description: p.description || '', price: String(p.price), stock: String(p.stock), category_id: p.category_id, image_url: p.image_url || '' })
    setShowModal(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const payload = {
      title: form.title, description: form.description || null, price: Number(form.price) || 0,
      stock: Number(form.stock) || 0, category_id: form.category_id, image_url: form.image_url || null,
    }
    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: editing ? t.adminProdUpdated : t.adminProdCreated, type: 'success' }); setShowModal(false); await loadData() }
    setFormLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.adminProdDeleteConfirm)) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: t.adminProdDeleted, type: 'success' }); await loadData() }
  }

  const filtered = products.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.adminProdTitle}</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{t.adminProdSubtitle}</p>
        </div>
        <PrimaryButton onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {t.adminNewProduct}
        </PrimaryButton>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.adminSearch} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 transition-all" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} message={t.adminProdNoData} />
      ) : (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Produto</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Preço</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Estoque</th>
                  <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url && <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                          <p className="text-xs text-gray-400 dark:text-white/30 truncate max-w-[200px]">{p.description || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">R$ {p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.stock > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ModalShell onClose={() => setShowModal(false)} title={editing ? t.adminEditProduct : t.adminNewProduct}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label={t.adminProdFormTitle}><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
            <FormField label={t.adminProdFormDescription}><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.adminProdFormPrice}><Input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></FormField>
              <FormField label={t.adminProdFormStock}><Input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></FormField>
            </div>
            <FormField label={t.adminProdFormCategory}>
              <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">{t.adminExpFormSelectCategory}</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label={t.adminProdFormImage}><Input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></FormField>
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
              <GhostButton type="button" onClick={() => setShowModal(false)} className="flex-1">{t.adminCancel}</GhostButton>
              <PrimaryButton type="submit" disabled={formLoading} className="flex-1">{formLoading ? '...' : editing ? t.adminProdFormUpdate : t.adminProdFormCreate}</PrimaryButton>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  )
}
