import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  ModalShell,
  FormField,
  Input,
  Select,
  PrimaryButton,
  GhostButton,
  EmptyState,
  Toast,
  ConfirmModal,
} from './SharedUI'

type AccountType = 'payable' | 'receivable'
type AccountStatus = 'pending' | 'paid' | 'overdue'

interface Account {
  id: string
  account_type: AccountType
  description: string
  amount: number
  due_date: string
  status: AccountStatus
  category: string
  notes: string | null
  created_at: string
}

interface AccountFormData {
  account_type: AccountType
  description: string
  amount: string
  due_date: string
  status: AccountStatus
  category: string
  notes: string
}

const INITIAL_FORM: AccountFormData = {
  account_type: 'payable',
  description: '',
  amount: '',
  due_date: new Date().toISOString().slice(0, 10),
  status: 'pending',
  category: '',
  notes: '',
}

const STATUS_COLORS: Record<AccountStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  overdue: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

const STATUS_LABELS: Record<AccountStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Atrasado',
}

const TYPE_LABELS: Record<AccountType, string> = {
  payable: 'A Pagar',
  receivable: 'A Receber',
}

const CATEGORY_OPTIONS = [
  'Aluguel',
  'Equipamentos',
  'Marketing',
  'Salários',
  'Serviços',
  'Operacional',
  'Receita Aulas',
  'Receita Expedições',
  'Receita Produtos',
  'Outros',
]

export function FinancialManager() {
  useLanguage()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | AccountType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | AccountStatus>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState<AccountFormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('financial_accounts' as any)
      .select('*')
      .order('due_date', { ascending: true })

    if (!error && data) {
      setAccounts(data as unknown as Account[])
    }
    setLoading(false)
  }

  const filtered = accounts.filter((a) => {
    if (filterType !== 'all' && a.account_type !== filterType) return false
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    return true
  })

  const totals = {
    payable: accounts
      .filter((a) => a.account_type === 'payable' && a.status !== 'paid')
      .reduce((s, a) => s + a.amount, 0),
    receivable: accounts
      .filter((a) => a.account_type === 'receivable' && a.status !== 'paid')
      .reduce((s, a) => s + a.amount, 0),
    paidPayable: accounts
      .filter((a) => a.account_type === 'payable' && a.status === 'paid')
      .reduce((s, a) => s + a.amount, 0),
    paidReceivable: accounts
      .filter((a) => a.account_type === 'receivable' && a.status === 'paid')
      .reduce((s, a) => s + a.amount, 0),
  }

  const balance = totals.receivable - totals.payable

  function openNew() {
    setEditingAccount(null)
    setFormData(INITIAL_FORM)
    setModalOpen(true)
  }

  function openEdit(acc: Account) {
    setEditingAccount(acc)
    setFormData({
      account_type: acc.account_type,
      description: acc.description,
      amount: String(acc.amount),
      due_date: acc.due_date,
      status: acc.status,
      category: acc.category,
      notes: acc.notes || '',
    })
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.description.trim() || !formData.amount || !formData.due_date) return

    setSaving(true)
    const payload = {
      account_type: formData.account_type,
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      due_date: formData.due_date,
      status: formData.status,
      category: formData.category,
      notes: formData.notes.trim() || null,
    }

    if (editingAccount) {
      const { error } = await supabase
        .from('financial_accounts' as any)
        .update(payload)
        .eq('id', editingAccount.id)

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Conta atualizada!', type: 'success' })
        loadAccounts()
      }
    } else {
      const { error } = await supabase.from('financial_accounts' as any).insert(payload)

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Conta criada!', type: 'success' })
        loadAccounts()
      }
    }

    setSaving(false)
    setModalOpen(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase
      .from('financial_accounts' as any)
      .delete()
      .eq('id', deleteTarget.id)

    if (!error) {
      setToast({ message: 'Conta excluída.', type: 'success' })
      loadAccounts()
    }
    setDeleteTarget(null)
  }

  async function togglePaid(acc: Account) {
    const newStatus = acc.status === 'paid' ? 'pending' : 'paid'
    const { error } = await supabase
      .from('financial_accounts' as any)
      .update({ status: newStatus })
      .eq('id', acc.id)

    if (!error) {
      loadAccounts()
    }
  }

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

  // Simple SVG Bar Chart
  function BalanceChart() {
    const maxVal = Math.max(totals.payable, totals.receivable, 1)
    const payableH = (totals.payable / maxVal) * 100
    const receivableH = (totals.receivable / maxVal) * 100
    const paidPayableH = (totals.paidPayable / maxVal) * 100
    const paidReceivableH = (totals.paidReceivable / maxVal) * 100

    return (
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06]">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 mb-6 uppercase tracking-wider">Resumo Financeiro</h3>
        <div className="flex items-end justify-center gap-8 h-48">
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
            <div className="w-full flex flex-col justify-end h-40 relative">
              <div className="absolute bottom-0 w-full bg-red-100 dark:bg-red-500/10 rounded-t-lg" style={{ height: `${payableH}%` }} />
              <div className="absolute bottom-0 w-full bg-red-500 dark:bg-red-400 rounded-t-lg opacity-40" style={{ height: `${paidPayableH}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-white/40 uppercase">Pagar</span>
            <span className="text-xs font-bold text-red-600 dark:text-red-400">{formatCurrency(totals.payable)}</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
            <div className="w-full flex flex-col justify-end h-40 relative">
              <div className="absolute bottom-0 w-full bg-emerald-100 dark:bg-emerald-500/10 rounded-t-lg" style={{ height: `${receivableH}%` }} />
              <div className="absolute bottom-0 w-full bg-emerald-500 dark:bg-emerald-400 rounded-t-lg opacity-40" style={{ height: `${paidReceivableH}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-white/40 uppercase">Receber</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totals.receivable)}</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
            <div className="w-full flex flex-col justify-end h-40">
              <div
                className={`w-full rounded-t-lg ${balance >= 0 ? 'bg-amz-dourado' : 'bg-red-500'}`}
                style={{ height: `${Math.min(Math.abs(balance) / maxVal * 100, 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-white/40 uppercase">Saldo</span>
            <span className={`text-xs font-bold ${balance >= 0 ? 'text-amz-dourado' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-400 dark:text-white/30">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-white/20" /> Pendente</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white/40 opacity-60" /> Pago</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06]">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-medium mb-1">A Receber (Pendente)</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totals.receivable)}</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06]">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-medium mb-1">A Pagar (Pendente)</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totals.payable)}</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06]">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-medium mb-1">Recebido (Pago)</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totals.paidReceivable)}</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06]">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-medium mb-1">Pago</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totals.paidPayable)}</p>
        </div>
      </div>

      {/* Chart + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceChart />
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Filtros</h3>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)}>
            <option value="all">Todos os Tipos</option>
            <option value="payable">A Pagar</option>
            <option value="receivable">A Receber</option>
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="overdue">Atrasado</option>
          </Select>
          <PrimaryButton onClick={openNew} className="w-full">
            + Nova Conta
          </PrimaryButton>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Lançamentos</h3>
          <span className="text-xs text-gray-400 dark:text-white/30">{filtered.length} itens</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400 dark:text-white/30 animate-pulse">Carregando...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            message="Nenhum lançamento encontrado"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Descrição</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Tipo</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Categoria</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Valor</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Vencimento</th>
                  <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Status</th>
                  <th className="text-right px-6 py-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-white/30">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">{acc.description}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.account_type === 'receivable' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                        {TYPE_LABELS[acc.account_type]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-white/40 text-xs">{acc.category}</td>
                    <td className={`px-4 py-3.5 text-right font-semibold ${acc.account_type === 'receivable' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(acc.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-white/40 text-xs">{formatDate(acc.due_date)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => togglePaid(acc)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide cursor-pointer transition-all hover:scale-105 ${STATUS_COLORS[acc.status]}`}
                      >
                        {STATUS_LABELS[acc.status]}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(acc)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteTarget(acc)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalShell
          onClose={() => setModalOpen(false)}
          title={editingAccount ? 'Editar Conta' : 'Nova Conta'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Tipo">
              <Select
                value={formData.account_type}
                onChange={(e) => setFormData({ ...formData, account_type: e.target.value as AccountType })}
              >
                <option value="payable">A Pagar</option>
                <option value="receivable">A Receber</option>
              </Select>
            </FormField>

            <FormField label="Descrição">
              <Input
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Aluguel espaço, Aula particular..."
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Valor (R$)">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                />
              </FormField>
              <FormField label="Vencimento">
                <Input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Categoria">
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Status">
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AccountStatus })}
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="overdue">Atrasado</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Observações">
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado resize-none transition-all"
                placeholder="Opcional..."
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <GhostButton type="button" onClick={() => setModalOpen(false)} className="flex-1">
                Cancelar
              </GhostButton>
              <PrimaryButton type="submit" disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : editingAccount ? 'Atualizar' : 'Criar Conta'}
              </PrimaryButton>
            </div>
          </form>
        </ModalShell>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Excluir Lançamento"
          message={`Tem certeza que deseja excluir "${deleteTarget.description}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  )
}
