import { useState, useMemo } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface TripCalendarProps {
  checkIn: string | null
  checkOut: string | null
  onCheckInChange: (date: string | null) => void
  onCheckOutChange: (date: string | null) => void
}

const MONTH_NAMES = {
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
}

const DAY_NAMES = {
  pt: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function isBetween(date: string, start: string, end: string): boolean {
  return date > start && date < end
}

export default function TripCalendar({ checkIn, checkOut, onCheckInChange, onCheckOutChange }: TripCalendarProps) {
  const { locale, t } = useLanguage()
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const monthNames = MONTH_NAMES[locale] || MONTH_NAMES.pt
  const dayNames = DAY_NAMES[locale] || DAY_NAMES.pt

  const days = useMemo(() => {
    const allDays = getDaysInMonth(viewYear, viewMonth)
    const firstDayOfWeek = allDays[0].getDay()
    const padding: (Date | null)[] = Array(firstDayOfWeek).fill(null)
    return [...padding, ...allDays]
  }, [viewMonth, viewYear])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  function handleDayClick(date: Date) {
    const dateStr = formatDate(date)
    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(dateStr)
      onCheckOutChange(null)
    } else if (dateStr < checkIn) {
      onCheckInChange(dateStr)
      onCheckOutChange(null)
    } else {
      onCheckOutChange(dateStr)
    }
  }

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{monthNames[viewMonth]} {viewYear}</h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-white/30 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />
          const dateStr = formatDate(day)
          const isToday = dateStr === formatDate(today)
          const isCheckIn = dateStr === checkIn
          const isCheckOut = dateStr === checkOut
          const isInRange = checkIn && checkOut && isBetween(dateStr, checkIn, checkOut)
          const isPast = dateStr < formatDate(today)

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && handleDayClick(day)}
              disabled={isPast}
              className={`relative h-9 rounded-lg text-xs font-medium transition-all ${
                isPast
                  ? 'text-gray-300 dark:text-white/10 cursor-not-allowed'
                  : isCheckIn || isCheckOut
                    ? 'bg-amz-dourado text-white shadow-md scale-105'
                    : isInRange
                      ? 'bg-amz-dourado/10 text-amz-dourado'
                      : isToday
                        ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold'
                        : 'text-gray-700 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06] grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">{t.cartCheckIn}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{checkIn ? new Date(checkIn + 'T12:00:00').toLocaleDateString(locale) : '—'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-semibold">{t.cartCheckOut}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{checkOut ? new Date(checkOut + 'T12:00:00').toLocaleDateString(locale) : '—'}</p>
        </div>
      </div>
    </div>
  )
}
