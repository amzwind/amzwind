import { useState } from 'react'
import { supabase } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color?: string
  trend?: { value: number; positive: boolean }
}

export default function MetricCard({ label, value, icon, color = 'text-amz-dourado', trend }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/[0.1] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-current/10`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.positive
              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
              : 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
            }`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    confirmed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  }
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${colors[status] || colors.pending}`}>
      {labels[status] || status}
    </span>
  )
}

export function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-300 dark:text-white/20">
        {icon}
      </div>
      <p className="text-sm text-gray-400 dark:text-white/30">{message}</p>
    </div>
  )
}

export function ModalShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#1a0f08] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-white/[0.06]">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
        </div>
        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all ${props.className || ''}`}
    />
  )
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all ${props.className || ''}`}
    >
      {children}
    </select>
  )
}

export function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado resize-none transition-all ${props.className || ''}`}
    />
  )
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amz-dourado text-white text-sm font-semibold hover:bg-amber-700 active:bg-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-semibold text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

export function ConfirmModal({ title, message, onConfirm, onCancel, danger }: { title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean }) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full sm:max-w-sm bg-white dark:bg-[#1a0f08] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-white/[0.06]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">{message}</p>
        <div className="flex gap-3">
          <GhostButton onClick={onCancel} className="flex-1">{t.adminCancel}</GhostButton>
          <button
            onClick={onConfirm}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amz-dourado hover:bg-amber-700'
              }`}
          >
            {t.adminConfirm}
          </button>
        </div>
      </div>
    </div>
  )
}

export function FileUpload({ label, value, onUpload, bucket = 'experiences', accept = 'image/*' }: { label: string; value: string; onUpload: (url: string) => void; bucket?: string; accept?: string }) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type })
    if (!error) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      if (urlData?.publicUrl) onUpload(urlData.publicUrl)
    }
    setUploading(false)
  }

  return (
    <FormField label={label}>
      <div className="space-y-2">
        {value && <img src={value} alt="" className="w-full h-32 rounded-xl object-cover" />}
        <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.05] cursor-pointer transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {uploading ? 'Enviando...' : 'Escolher imagem'}
          <input type="file" accept={accept} onChange={handleFile} className="hidden" />
        </label>
      </div>
    </FormField>
  )
}

export function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[70] p-3.5 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2.5 animate-[slideDown_0.3s_ease-out] ${type === 'success'
        ? 'bg-emerald-600 text-white'
        : 'bg-red-600 text-white'
      }`}>
      {type === 'success' ? (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-70">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}