import React, { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { RoutePoint, WindCondition } from '../../data/trips'
import { createPost } from '../../services/feed'
import { useLanguage } from '../../contexts/LanguageContext'

interface TripInteractiveMapProps {
  tripId: string
  tripTitle: string
  destination?: string | null
  startPoint?: string | null
  endPoint?: string | null
  startCoords?: [number, number] | null
  endCoords?: [number, number] | null
  officialRoutePoints?: RoutePoint[]
  distanceKm?: number
  estimatedDuration?: string
  windCondition?: WindCondition
  canEdit?: boolean
}

// Cálculo de distância Haversine em km entre dois pontos geográficos
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Estima tempo em minutos considerando velocidade média de kitesurf em downwind (~24 km/h)
function estimateDownwindTimeMinutes(distKm: number): number {
  const avgSpeedKmh = 24
  return Math.round((distKm / avgSpeedKmh) * 60)
}

function formatMinutesToHours(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function createMarkerIcon(type: 'start' | 'waypoint' | 'end', label: string) {
  const bgColor =
    type === 'start'
      ? 'bg-emerald-500 ring-emerald-400/50'
      : type === 'end'
      ? 'bg-amber-400 ring-amber-300/50'
      : 'bg-teal-500 ring-teal-400/50'

  const iconText = type === 'start' ? '🏁' : type === 'end' ? '🎯' : label

  return L.divIcon({
    className: 'custom-downwind-marker',
    html: `
      <div class="relative group cursor-pointer">
        <div class="w-8 h-8 rounded-full ${bgColor} ring-4 text-slate-900 font-bold flex items-center justify-center shadow-2xl border-2 border-white text-xs transform -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-125">
          ${iconText}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })
}

export const TripInteractiveMap: React.FC<TripInteractiveMapProps> = ({
  tripId,
  tripTitle,
  destination,
  startPoint,
  endPoint,
  startCoords,
  endCoords,
  officialRoutePoints = [],
  distanceKm: initialDistanceKm,
  estimatedDuration: initialEstimatedDuration,
  windCondition,
}) => {
  const { t } = useLanguage()
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const polylineLayerRef = useRef<L.Polyline | null>(null)
  const markersGroupRef = useRef<L.LayerGroup | null>(null)

  // Estado do planejador interativo
  const [plannerMode, setPlannerMode] = useState<'official' | 'custom'>('official')
  const [customPoints, setCustomPoints] = useState<RoutePoint[]>([])
  const [sharing, setSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [shareNotes, setShareNotes] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  // Determina pontos base de fallback caso a trip não tenha pontos geográficos
  const effectiveOfficialPoints = useMemo<RoutePoint[]>(() => {
    if (officialRoutePoints && officialRoutePoints.length > 0) {
      return officialRoutePoints
    }
    if (startCoords && endCoords) {
      return [
        { lat: startCoords[0], lng: startCoords[1], name: startPoint || 'Ponto Inicial', type: 'start' },
        { lat: endCoords[0], lng: endCoords[1], name: endPoint || 'Ponto Final', type: 'end' },
      ]
    }
    // Coordenadas padrão da Amazônia Atlântica (Salinópolis / Ilha de Marieta)
    return [
      { lat: -0.602, lng: -47.356, name: startPoint || 'Farol Velho (Salinas - PA)', type: 'start', notes: 'Ponto de partida clássico' },
      { lat: -0.5965, lng: -47.338, name: 'Praia do Atalaia', type: 'waypoint', notes: 'Apoio e abastecimento' },
      { lat: -0.591, lng: -47.319, name: endPoint || 'Ilha da Marieta (PA)', type: 'end', notes: 'Chegada e almoço' },
    ]
  }, [officialRoutePoints, startCoords, endCoords, startPoint, endPoint])

  const activePoints = plannerMode === 'official' ? effectiveOfficialPoints : customPoints

  // Cálculos de rota
  const computedDistance = useMemo(() => {
    if (plannerMode === 'official' && initialDistanceKm && initialDistanceKm > 0) {
      return initialDistanceKm
    }
    if (activePoints.length < 2) return 0
    let total = 0
    for (let i = 0; i < activePoints.length - 1; i++) {
      total += calculateDistanceKm(
        activePoints[i].lat,
        activePoints[i].lng,
        activePoints[i + 1].lat,
        activePoints[i + 1].lng
      )
    }
    return Math.round(total * 10) / 10
  }, [activePoints, plannerMode, initialDistanceKm])

  const computedDuration = useMemo(() => {
    if (plannerMode === 'official' && initialEstimatedDuration) {
      return initialEstimatedDuration
    }
    if (computedDistance === 0) return '0 min'
    const minutes = estimateDownwindTimeMinutes(computedDistance)
    return formatMinutesToHours(minutes)
  }, [plannerMode, initialEstimatedDuration, computedDistance])

  // Inicialização do Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Se já existir instância anterior, limpa
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const initialCenter: [number, number] =
      effectiveOfficialPoints.length > 0
        ? [effectiveOfficialPoints[0].lat, effectiveOfficialPoints[0].lng]
        : [-0.602, -47.356]

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      scrollWheelZoom: false,
    })

    // Camada de mapa OpenStreetMap com visual náutico/limpo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | AMZWind Downwind Nav',
    }).addTo(map)

    markersGroupRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    // Handler de clique para o modo de planejamento customizado
    map.on('click', (e: L.LeafletMouseEvent) => {
      setPlannerMode((currentMode) => {
        if (currentMode === 'custom') {
          setCustomPoints((prev) => {
            const nextType: 'start' | 'waypoint' | 'end' =
              prev.length === 0 ? 'start' : 'waypoint'
            const nextPoint: RoutePoint = {
              lat: Number(e.latlng.lat.toFixed(5)),
              lng: Number(e.latlng.lng.toFixed(5)),
              name: `Ponto ${prev.length + 1}`,
              type: nextType,
              notes: 'Ponto adicionado interativamente pelo rider',
            }
            return [...prev, nextPoint]
          })
        }
        return currentMode
      })
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [effectiveOfficialPoints])

  // Atualização dos marcadores e linha da rota
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersGroup = markersGroupRef.current
    if (!map || !markersGroup) return

    markersGroup.clearLayers()

    if (polylineLayerRef.current) {
      map.removeLayer(polylineLayerRef.current)
      polylineLayerRef.current = null
    }

    if (activePoints.length === 0) return

    const latLngs: [number, number][] = activePoints.map((p) => [p.lat, p.lng])

    // Desenha traçado da rota com estética náutica (verde esmeralda ou dourado no modo custom)
    const polylineColor = plannerMode === 'official' ? '#10b981' : '#f59e0b'
    const polyline = L.polyline(latLngs, {
      color: polylineColor,
      weight: 5,
      opacity: 0.85,
      dashArray: plannerMode === 'custom' ? '8, 8' : undefined,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    polylineLayerRef.current = polyline

    // Adiciona Marcadores
    activePoints.forEach((point, index) => {
      const isStart = index === 0
      const isEnd = index === activePoints.length - 1 && activePoints.length > 1
      const pointType: 'start' | 'waypoint' | 'end' = isStart ? 'start' : isEnd ? 'end' : 'waypoint'

      const marker = L.marker([point.lat, point.lng], {
        icon: createMarkerIcon(pointType, String(index + 1)),
      })

      const popupHtml = `
        <div class="font-sans text-slate-900 p-1 min-w-[180px]">
          <div class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
            ${pointType === 'start' ? '🚩 Ponto de Partida' : pointType === 'end' ? '🎯 Ponto de Chegada' : `📍 Parada #${index + 1}`}
          </div>
          <h4 class="font-bold text-sm text-slate-900 mt-0.5">${point.name}</h4>
          ${point.notes ? `<p class="text-xs text-slate-600 mt-1">${point.notes}</p>` : ''}
          <div class="text-[11px] text-slate-400 mt-2 font-mono">
            ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}
          </div>
        </div>
      `

      marker.bindPopup(popupHtml)
      markersGroup.addLayer(marker)
    })

    // Enquadra a visão do mapa nos pontos
    if (latLngs.length > 1) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] })
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 13)
    }
  }, [activePoints, plannerMode])

  // Desfazer último ponto
  const handleUndoPoint = () => {
    setCustomPoints((prev) => prev.slice(0, prev.length - 1))
  }

  // Limpar pontos customizados
  const handleClearCustom = () => {
    setCustomPoints([])
  }

  // Copiar pontos oficiais para modo customizado
  const handleStartCustomFromOfficial = () => {
    setCustomPoints([...effectiveOfficialPoints])
    setPlannerMode('custom')
  }

  // Publicar trajeto na comunidade
  const handleShareToCommunity = async () => {
    setSharing(true)
    try {
      const summaryText =
        `🌊 **Plano de Rota de Downwind** — ${tripTitle}\n\n` +
        `📍 **Percurso**: ${activePoints.map((p) => p.name).join(' ➔ ')}\n` +
        `📏 **Distância total**: ${computedDistance} km\n` +
        `⏱️ **Tempo estimado**: ${computedDuration}\n` +
        `💨 **Condição recomendada**: Vento ${windCondition?.direction || 'NE'} (${windCondition?.speed_min_kts || 18}-${windCondition?.speed_max_kts || 25} nós)\n\n` +
        (shareNotes ? `💬 *Comentário do Rider*: "${shareNotes}"\n\n` : '') +
        `👉 Bora velejar junto? Veja os detalhes da trip em: /trips/${tripId}`

      await createPost(summaryText, null, tripId)
      setShareSuccess(true)
      setTimeout(() => {
        setShareSuccess(false)
        setShowShareModal(false)
        setShareNotes('')
      }, 2500)
    } catch (err) {
      alert('Não foi possível compartilhar a rota no momento: ' + (err as Error).message)
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Header do Mapa com Ações e Alternância de Modo */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🧭</span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Mapa Interativo & Rota de Downwind
            </h3>
            <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
              Kitesurf GPS
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {destination || 'Litoral Amazônico e Nordeste brasileiro'}
          </p>
        </div>

        {/* Botoes de Modo */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setPlannerMode('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                plannerMode === 'official'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Rota Oficial
            </button>
            <button
              type="button"
              onClick={() => {
                if (plannerMode === 'official' && customPoints.length === 0) {
                  handleStartCustomFromOfficial()
                } else {
                  setPlannerMode('custom')
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                plannerMode === 'custom'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ✏️ Planejar Trajeto
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5"
            title="Compartilhar trajeto na comunidade"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Barra de Indicadores Técnicos de Downwind */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 bg-gray-50/70 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800 text-center">
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200/70 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Distância Total</span>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {computedDistance > 0 ? `${computedDistance} km` : '--'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200/70 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Tempo Estimado</span>
          <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {computedDuration}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200/70 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Vento Recomendado</span>
          <span className="text-base sm:text-lg font-bold text-amber-500">
            {windCondition?.direction || 'E/NE'} {windCondition?.speed_min_kts || 18}-{windCondition?.speed_max_kts || 26} kts
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200/70 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Condição de Maré</span>
          <span className="text-base sm:text-lg font-bold text-teal-500">
            {windCondition?.tide || 'Vazante'}
          </span>
        </div>
      </div>

      {/* Banner de Instrução no Modo Customizado */}
      {plannerMode === 'custom' && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
            <span className="animate-pulse">📍</span>
            <span>
              <strong>Modo Planejamento Ativo:</strong> Clique em qualquer local da costa no mapa para adicionar paradas e calcular sua rota.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndoPoint}
              disabled={customPoints.length === 0}
              className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-slate-700 hover:bg-gray-50 disabled:opacity-40"
            >
              ↩ Desfazer Ponto
            </button>
            <button
              type="button"
              onClick={handleClearCustom}
              disabled={customPoints.length === 0}
              className="px-2.5 py-1 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 disabled:opacity-40"
            >
              Limpar Rota
            </button>
          </div>
        </div>
      )}

      {/* Container do Mapa Leaflet */}
      <div className="relative w-full h-[380px] sm:h-[460px] z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Lista de Waypoints e Paradas Detalhadas */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
          <span>Pontos de Passagem & Paradas ({activePoints.length})</span>
          <span className="text-[11px] font-normal lowercase text-gray-400">
            {plannerMode === 'official' ? 'rota oficial confirmada' : 'trajeto personalizado'}
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activePoints.map((pt, idx) => {
            const isStart = idx === 0
            const isEnd = idx === activePoints.length - 1 && activePoints.length > 1
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200/60 dark:border-slate-800"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isStart
                      ? 'bg-emerald-500 text-white'
                      : isEnd
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-teal-500 text-white'
                  }`}
                >
                  {isStart ? 'S' : isEnd ? 'F' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-900 dark:text-white block truncate">
                    {pt.name}
                  </span>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {pt.notes || (isStart ? 'Ponto de decolagem e briefing' : isEnd ? 'Final do downwind e resgate' : 'Parada para reagrupamento')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de Compartilhamento na Comunidade */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t.bannerClose || 'Fechar'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl">
                🌊
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Compartilhar Trajeto na Comunidade
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mostre sua rota de downwind para os outros kitesurfistas
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Trip:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tripTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Distância:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{computedDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tempo estimado:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{computedDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paradas:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{activePoints.length} waypoints</span>
              </div>
            </div>

            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Adicione uma mensagem aos riders (opcional):
            </label>
            <textarea
              rows={3}
              value={shareNotes}
              onChange={(e) => setShareNotes(e.target.value)}
              placeholder="Ex: Condição perfeita para 9m e 11m, maré secando às 14h..."
              className="w-full text-xs p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />

            {shareSuccess ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-center text-xs font-bold animate-in fade-in">
                ✅ Trajeto compartilhado com sucesso no Feed da Comunidade!
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleShareToCommunity}
                  disabled={sharing}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {sharing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <span>Publicar no Feed</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
