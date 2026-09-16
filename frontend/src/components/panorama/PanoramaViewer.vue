<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Viewer } from '@photo-sphere-viewer/core'
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import type { Hotspot } from '@/types/scene'

const props = defineProps<{
  panorama: string
  hotspots?: Hotspot[]
  isEditorMode?: boolean
  isUvMode?: boolean
  tempMarker?: { yaw: string; pitch: string } | null
}>()

const emit = defineEmits<{
  (e: 'select-evidence', evidenceId: string): void
  (e: 'navigate-scene', targetSceneId: string): void
  (e: 'sphere-click', coords: { yaw: string; pitch: string; yawRad: number; pitchRad: number }): void
  (e: 'locked-clue', payload: { requiresEvidenceId: string; evidenceId?: string }): void
}>()

const viewerContainer = ref<HTMLElement | null>(null)
let viewer: Viewer | null = null
let markersPlugin: any = null

const createMarkerConfig = (hotspot: Hotspot) => {
  const isNav = hotspot.type === 'navigation'
  const isInfo = hotspot.type === 'information'
  const isSecret = hotspot.type === 'secret'
  const isDecoy = hotspot.type === 'decoy'

  let icon = '🔍'
  let badgeClass = 'bg-red-950/90 text-red-200 border-red-500/80 shadow-red-500/20'

  if (isNav) {
    icon = '🚪'
    badgeClass = 'bg-blue-950/90 text-blue-200 border-blue-400/80 shadow-blue-500/20'
  } else if (isInfo) {
    icon = 'ℹ️'
    badgeClass = 'bg-amber-950/90 text-amber-200 border-amber-400/80 shadow-amber-500/20'
  } else if (isSecret) {
    icon = '⚡'
    badgeClass = 'bg-cyan-950/95 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] font-black animate-pulse'
  } else if (isDecoy && props.isEditorMode) {
    icon = '🎭'
    badgeClass = 'bg-rose-950/95 text-rose-300 border-rose-500/90 shadow-rose-500/30 ring-1 ring-rose-400'
  }

  // Jika Senter UV aktif, redupkan bukti biasa agar pendaran fluoresens lebih menonjol
  const opacityClass = props.isUvMode && !isSecret ? 'opacity-40 hover:opacity-100' : 'opacity-100'

  return {
    id: hotspot.id,
    position: {
      yaw: hotspot.yaw,
      pitch: hotspot.pitch
    },
    html: `
      <div class="cursor-pointer group flex flex-col items-center select-none transform hover:scale-110 transition-all duration-150 ${opacityClass}">
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-lg backdrop-blur-sm ${badgeClass}">
          <span class="text-sm">${icon}</span>
          <span class="tracking-wide whitespace-nowrap">${hotspot.name}</span>
        </div>
        <div class="w-1.5 h-1.5 rounded-full ${isSecret ? 'bg-cyan-300 shadow-[0_0_10px_#22d3ee]' : 'bg-white'} shadow-md mt-1 animate-pulse"></div>
      </div>
    `,
    tooltip: {
      content: isNav ? `Pindah: ${hotspot.name}` : `${hotspot.name}`,
      position: 'top'
    },
    data: hotspot
  }
}

const syncMarkers = () => {
  if (!markersPlugin) return
  markersPlugin.clearMarkers()

  if (props.hotspots && props.hotspots.length > 0) {
    props.hotspots.forEach(hs => {
      // Hotspot secret HANYA muncul jika mode UV aktif atau sedang dalam editor mode
      if (hs.type === 'secret' && !props.isUvMode && !props.isEditorMode) {
        return
      }

      try {
        markersPlugin.addMarker(createMarkerConfig(hs))
      } catch (err) {
        console.warn('Gagal memuat marker:', hs.id, err)
      }
    })
  }

  // Jika ada tempMarker dari editor mode
  if (props.tempMarker && props.isEditorMode) {
    try {
      markersPlugin.addMarker({
        id: '__temp_marker__',
        position: {
          yaw: props.tempMarker.yaw,
          pitch: props.tempMarker.pitch
        },
        html: `
          <div class="cursor-pointer flex flex-col items-center select-none animate-bounce">
            <div class="px-2.5 py-1 rounded-full bg-amber-400 text-crime-950 font-black text-xs border-2 border-white shadow-xl flex items-center gap-1">
              <span>🎯</span> Titik Baru
            </div>
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400 mt-0.5 ring-2 ring-white"></div>
          </div>
        `,
        tooltip: {
          content: `Koordinat: yaw ${props.tempMarker.yaw}, pitch ${props.tempMarker.pitch}`,
          position: 'top'
        }
      })
    } catch (err) {
      console.warn('Gagal memuat temp marker:', err)
    }
  }
}

onMounted(() => {
  if (!viewerContainer.value) return

  viewer = new Viewer({
    container: viewerContainer.value,
    panorama: props.panorama,
    navbar: [
      'zoom',
      'move',
      'fullscreen'
    ],
    defaultZoomLvl: 50,
    plugins: [
      [MarkersPlugin, {}]
    ]
  })

  markersPlugin = viewer.getPlugin(MarkersPlugin)

  markersPlugin.addEventListener('select-marker', ({ marker }: any) => {
    if (marker.id === '__temp_marker__') return
    const hs: Hotspot = marker.data
    if (!hs) return

    if (hs.type === 'navigation' && hs.targetSceneId) {
      emit('navigate-scene', hs.targetSceneId)
    } else if (hs.requiresEvidenceId) {
      emit('locked-clue', { requiresEvidenceId: hs.requiresEvidenceId, evidenceId: hs.evidenceId })
    } else if (hs.evidenceId) {
      emit('select-evidence', hs.evidenceId)
    }
  })

  // Listener klik di panorama untuk capture yaw & pitch (terutama pada editor mode)
  viewer.addEventListener('click', ({ data }: any) => {
    if (!data) return
    const yawDeg = `${((data.yaw * 180) / Math.PI).toFixed(1)}deg`
    const pitchDeg = `${((data.pitch * 180) / Math.PI).toFixed(1)}deg`

    emit('sphere-click', {
      yaw: yawDeg,
      pitch: pitchDeg,
      yawRad: Number(data.yaw.toFixed(3)),
      pitchRad: Number(data.pitch.toFixed(3))
    })
  })

  viewer.addEventListener('ready', () => {
    syncMarkers()
  })
})

watch(() => props.panorama, async (newPanorama) => {
  if (viewer && newPanorama) {
    await viewer.setPanorama(newPanorama)
    syncMarkers()
  }
})

watch(() => [props.hotspots, props.tempMarker, props.isUvMode], () => {
  syncMarkers()
}, { deep: true })

onBeforeUnmount(() => {
  viewer?.destroy()
  viewer = null
  markersPlugin = null
})
</script>

<template>
  <div class="relative w-full h-full min-h-[500px] overflow-hidden">
    <div
      ref="viewerContainer"
      class="w-full h-full transition-[filter] duration-700 ease-in-out"
      :class="isUvMode ? 'uv-blacklight-filter' : ''"
    ></div>

    <!-- Indicator Editor Mode Overlay -->
    <div
      v-if="isEditorMode"
      class="absolute top-4 left-4 z-10 pointer-events-none bg-crime-900/90 backdrop-blur-md border border-amber-500/60 px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-xs"
    >
      <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
      <span class="text-amber-300 font-bold">Hotspot Placement Mode:</span>
      <span class="text-gray-300">Klik panorama untuk memilih titik koordinat</span>
    </div>

    <!-- Indicator UV Mode Active Overlay -->
    <div
      v-if="isUvMode"
      class="absolute top-4 right-4 z-10 pointer-events-none bg-purple-950/90 backdrop-blur-md border border-purple-500/80 px-3.5 py-1.5 rounded-xl shadow-xl shadow-purple-950/60 flex items-center gap-2 text-xs animate-in fade-in duration-300"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse ring-2 ring-cyan-300/60"></span>
      <span class="text-cyan-300 font-mono font-bold tracking-wider uppercase">Senter UV Menyala</span>
      <span class="text-purple-300 text-[10px] hidden sm:inline">(Residu Fluoresens Aktif)</span>
    </div>
  </div>
</template>

<style>
/* Filter visual UV Blacklight */
.uv-blacklight-filter {
  filter: brightness(0.38) contrast(1.75) hue-rotate(245deg) saturate(2);
}

/* Override Photo Sphere Viewer tooltip dark styling */
.psv-tooltip {
  background: rgba(15, 23, 42, 0.95) !important;
  color: #f8fafc !important;
  border: 1px solid rgba(71, 85, 105, 0.6) !important;
  font-family: inherit !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  border-radius: 6px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}
.psv-navbar {
  background: rgba(13, 17, 23, 0.85) !important;
  backdrop-filter: blur(8px) !important;
  }
</style>
