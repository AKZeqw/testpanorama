<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import PanoramaViewer from '@/components/panorama/PanoramaViewer.vue'
import type { Scene, Hotspot, HotspotType } from '@/types/scene'


const route = useRoute()
const router = useRouter()
const caseStore = useCaseStore()

const caseId = computed(() => (route.params.id as string) || 'case-001')
const targetCase = computed(() => caseStore.cases.find(c => c.id === caseId.value))

// Active scene state
const activeSceneId = ref<string>('')
const activeScene = computed<Scene | undefined>(() => {
  return targetCase.value?.scenes.find(s => s.id === activeSceneId.value) || targetCase.value?.scenes[0]
})

// Hotspot Creation / Editing state
const isAddingHotspot = ref(false)
const clickedPosition = ref<{
  yaw: string
  pitch: string
  yawRad: number
  pitchRad: number
} | null>(null)

const hotspotForm = ref<{
  id?: string
  name: string
  type: HotspotType
  description: string
  yaw: string
  pitch: string
  targetSceneId?: string
  evidenceId?: string
}>({
  name: '',
  type: 'evidence',
  description: '',
  yaw: '0deg',
  pitch: '0deg'
})

// New Scene Modal
const isNewSceneModalOpen = ref(false)
const newSceneForm = ref({
  name: '',
  description: '',
  panoramaPath: '/panoramas/laboratory.jpg'
})

const availablePanoramaPresets = [
  { label: 'Laboratory TKP Utama', path: '/panoramas/laboratory.jpg' },
  { label: 'Corridor Lorong Gedung', path: '/panoramas/corridor.jpg' },
  { label: 'Storage Room Ruang Arsip', path: '/panoramas/storage-room.jpg' }
]

onMounted(() => {
  if (!targetCase.value) {
    router.push('/admin/cases')
    return
  }

  const routeSceneId = route.params.sceneId as string
  if (routeSceneId && targetCase.value.scenes.some(s => s.id === routeSceneId)) {
    activeSceneId.value = routeSceneId
  } else if (targetCase.value.scenes.length > 0) {
    activeSceneId.value = targetCase.value.scenes[0].id
  }
})

// Handler ketika admin mengklik panorama 360°
const handleSphereClick = (coords: { yaw: string; pitch: string; yawRad: number; pitchRad: number }) => {
  clickedPosition.value = coords
  hotspotForm.value.yaw = coords.yaw
  hotspotForm.value.pitch = coords.pitch
  isAddingHotspot.value = true
}

const handleSaveHotspot = () => {
  if (!activeScene.value) return
  if (!hotspotForm.value.name.trim()) {
    alert('Nama hotspot wajib diisi!')
    return
  }

  const hsId = hotspotForm.value.id || `hs-${Date.now().toString().slice(-4)}`
  const newHotspot: Hotspot = {
    id: hsId,
    type: hotspotForm.value.type,
    name: hotspotForm.value.name.trim(),
    description: hotspotForm.value.description.trim(),
    yaw: hotspotForm.value.yaw,
    pitch: hotspotForm.value.pitch,
    targetSceneId: hotspotForm.value.type === 'navigation' ? hotspotForm.value.targetSceneId : undefined,
    evidenceId: (hotspotForm.value.type === 'evidence' || hotspotForm.value.type === 'decoy') ? (hotspotForm.value.evidenceId || `ev-${hsId}`) : undefined
  }

  if (hotspotForm.value.id) {
    caseStore.updateHotspot(caseId.value, activeScene.value.id, hsId, newHotspot)
  } else {
    caseStore.addHotspot(caseId.value, activeScene.value.id, newHotspot)
  }

  // Reset form
  resetHotspotForm()
}

const resetHotspotForm = () => {
  isAddingHotspot.value = false
  clickedPosition.value = null
  hotspotForm.value = {
    name: '',
    type: 'evidence',
    description: '',
    yaw: '0deg',
    pitch: '0deg'
  }
}

const handleEditHotspot = (hs: Hotspot) => {
  hotspotForm.value = {
    id: hs.id,
    name: hs.name,
    type: hs.type,
    description: hs.description,
    yaw: String(hs.yaw),
    pitch: String(hs.pitch),
    targetSceneId: hs.targetSceneId,
    evidenceId: hs.evidenceId
  }
  clickedPosition.value = {
    yaw: String(hs.yaw),
    pitch: String(hs.pitch),
    yawRad: 0,
    pitchRad: 0
  }
  isAddingHotspot.value = true
}

const handleDeleteHotspot = (hsId: string) => {
  if (!activeScene.value) return
  if (confirm('Hapus hotspot ini?')) {
    caseStore.deleteHotspot(caseId.value, activeScene.value.id, hsId)
    if (hotspotForm.value.id === hsId) {
      resetHotspotForm()
    }
  }
}

const handleCreateScene = () => {
  if (!newSceneForm.value.name.trim()) {
    alert('Nama ruangan wajib diisi!')
    return
  }

  const sId = `scene-${Date.now().toString().slice(-4)}`
  const newScene: Scene = {
    id: sId,
    name: newSceneForm.value.name.trim(),
    description: newSceneForm.value.description.trim(),
    panoramaPath: newSceneForm.value.panoramaPath,
    orderIndex: (targetCase.value?.scenes.length || 0) + 1,
    hotspots: []
  }

  caseStore.addScene(caseId.value, newScene)
  activeSceneId.value = sId
  isNewSceneModalOpen.value = false
  newSceneForm.value = {
    name: '',
    description: '',
    panoramaPath: '/panoramas/laboratory.jpg'
  }
}

const handleDeleteScene = (sId: string, sName: string) => {
  if (targetCase.value && targetCase.value.scenes.length <= 1) {
    alert('Kasus harus memiliki minimal 1 ruangan!')
    return
  }
  if (confirm(`Hapus ruangan "${sName}" beserta seluruh hotspot di dalamnya?`)) {
    caseStore.deleteScene(caseId.value, sId)
    if (targetCase.value?.scenes[0]) {
      activeSceneId.value = targetCase.value.scenes[0].id
    }
  }
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-crime-950 text-gray-100 overflow-hidden select-none">
    <!-- Topbar -->
    <header class="h-16 px-6 bg-crime-900 border-b border-crime-700/80 flex items-center justify-between z-20 shadow-md">
      <div class="flex items-center gap-3">
        <router-link
          to="/admin/cases"
          class="p-2 rounded-xl bg-crime-800 hover:bg-crime-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5"
        >
          <span>←</span> Kembali ke Kasus
        </router-link>
        <div class="h-6 w-px bg-crime-800 hidden sm:block"></div>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">
            Scene & 360° Hotspot Editor
          </div>
          <h1 class="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <span>{{ targetCase?.title || 'Unknown Case' }}</span>
            <span class="text-xs font-mono text-gray-400">({{ targetCase?.caseNumber }})</span>
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="isNewSceneModalOpen = true"
          class="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-900/70 hover:bg-blue-800 text-blue-200 border border-blue-700 transition flex items-center gap-1.5"
        >
          <span>+</span> Tambah Ruangan
        </button>

        <router-link
          :to="`/cases/${caseId}/investigate`"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-md flex items-center gap-1.5 transition"
        >
          <span>🎮</span> Uji Coba TKP
        </router-link>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left Scene Selector Bar -->
      <aside class="w-64 bg-crime-900 border-r border-crime-800 flex flex-col h-full z-10">
        <div class="p-4 border-b border-crime-800 flex items-center justify-between">
          <span class="text-xs font-mono uppercase text-gray-400 font-bold">Daftar Ruangan</span>
          <span class="text-xs text-red-400 font-mono">{{ targetCase?.scenes.length || 0 }} Scene</span>
        </div>

        <div class="flex-1 overflow-y-auto p-3 space-y-2">
          <div
            v-for="scene in targetCase?.scenes"
            :key="scene.id"
            @click="activeSceneId = scene.id; resetHotspotForm()"
            :class="[
              'p-3 rounded-xl border cursor-pointer transition flex items-center justify-between group',
              scene.id === activeScene?.id
                ? 'bg-crime-850 border-red-500 ring-1 ring-red-500/50'
                : 'bg-crime-950 border-crime-800 hover:border-gray-700'
            ]"
          >
            <div class="flex-1 truncate pr-2">
              <div class="text-xs font-bold text-white truncate">{{ scene.name }}</div>
              <div class="text-[10px] text-gray-400 font-mono">
                {{ scene.hotspots?.length || 0 }} Hotspot aktif
              </div>
            </div>

            <button
              v-if="targetCase && targetCase.scenes.length > 1"
              @click.stop="handleDeleteScene(scene.id, scene.name)"
              class="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 text-xs transition"
              title="Hapus ruangan"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Hotspot List in active scene -->
        <div class="p-4 border-t border-crime-800 bg-crime-950/60 max-h-56 overflow-y-auto">
          <div class="text-[11px] font-mono text-gray-400 uppercase font-bold mb-2 flex items-center justify-between">
            <span>Hotspots di Ruang Ini</span>
            <span class="text-red-400">{{ activeScene?.hotspots?.length || 0 }}</span>
          </div>

          <div v-if="!activeScene?.hotspots?.length" class="text-[11px] text-gray-500 italic py-2">
            Belum ada hotspot. Klik di panorama untuk menambahkan.
          </div>

          <div v-else class="space-y-1.5">
            <div
              v-for="hs in activeScene.hotspots"
              :key="hs.id"
              class="p-2 rounded-lg bg-crime-900 border border-crime-800 hover:border-crime-700 flex items-center justify-between text-xs transition"
            >
              <div class="flex items-center gap-1.5 truncate flex-1 cursor-pointer" @click="handleEditHotspot(hs)">
                <span>{{ hs.type === 'navigation' ? '🚪' : hs.type === 'evidence' ? '🔎' : 'ℹ️' }}</span>
                <span class="font-medium text-gray-200 truncate">{{ hs.name }}</span>
              </div>
              <button
                @click="handleDeleteHotspot(hs.id)"
                class="text-gray-500 hover:text-red-400 px-1 text-xs"
                title="Hapus"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center 360° Panorama Viewport -->
      <main class="flex-1 h-full relative bg-black flex flex-col">
        <PanoramaViewer
          v-if="activeScene"
          :panorama="activeScene.panoramaPath"
          :hotspots="activeScene.hotspots"
          :is-editor-mode="true"
          :temp-marker="clickedPosition ? { yaw: clickedPosition.yaw, pitch: clickedPosition.pitch } : null"
          @sphere-click="handleSphereClick"
        />

        <!-- Helper Instructions Overlay -->
        <div class="absolute bottom-4 left-4 z-10 pointer-events-none bg-crime-900/90 backdrop-blur-md border border-crime-700 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs">
          <span class="text-amber-400">💡</span>
          <span class="text-gray-300">
            Arahkan kamera ke objek di ruangan dan <strong>klik lokasi pada panorama</strong> untuk menentukan titik hotspot.
          </span>
        </div>
      </main>

      <!-- Right Hotspot Configuration Panel -->
      <aside
        v-if="isAddingHotspot"
        class="w-80 md:w-96 bg-crime-900 border-l border-crime-700/80 flex flex-col h-full z-10 shadow-2xl animate-in slide-in-from-right duration-200"
      >
        <!-- Panel Header -->
        <div class="p-4 border-b border-crime-800 flex items-center justify-between">
          <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <span>🎯</span> {{ hotspotForm.id ? 'Edit Hotspot' : 'Konfigurasi Hotspot Baru' }}
          </h3>
          <button
            @click="resetHotspotForm"
            class="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-crime-800"
          >
            ✕ Batal
          </button>
        </div>

        <!-- Panel Form -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <!-- Captured Coordinates -->
          <div class="p-3 rounded-xl bg-crime-950 border border-amber-500/40 space-y-1">
            <span class="text-[10px] font-mono uppercase text-amber-400 font-bold block">Koordinat Terdeteksi</span>
            <div class="grid grid-cols-2 gap-2 text-gray-300 font-mono text-[11px]">
              <div>Yaw: <strong class="text-white">{{ hotspotForm.yaw }}</strong></div>
              <div>Pitch: <strong class="text-white">{{ hotspotForm.pitch }}</strong></div>
            </div>
          </div>

          <!-- Hotspot Type -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1.5">Tipe Hotspot</label>
            <select
              v-model="hotspotForm.type"
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="evidence">🔎 Evidence (Barang Bukti Asli)</option>
              <option value="decoy">🎭 Decoy / Red Herring (Bukti Pengalih / Jebakan)</option>
              <option value="navigation">🚪 Navigation (Pindah Ruangan)</option>
              <option value="information">ℹ️ Information (Petunjuk / Tanda)</option>
              <option value="secret">⚡ Secret (Bukti Tersembunyi UV)</option>
            </select>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1.5">Nama Hotspot *</label>
            <input
              v-model="hotspotForm.name"
              type="text"
              placeholder="Misal: Laptop Menyala / Pintu Koridor"
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1.5">Deskripsi Hotspot</label>
            <textarea
              v-model="hotspotForm.description"
              rows="3"
              placeholder="Jelaskan objek atau petunjuk yang ditemukan pada titik ini..."
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            ></textarea>
          </div>

          <!-- If Navigation: Target Scene -->
          <div v-if="hotspotForm.type === 'navigation'">
            <label class="block text-xs font-semibold text-gray-300 mb-1.5">Ruangan Tujuan (Target Scene)</label>
            <select
              v-model="hotspotForm.targetSceneId"
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="" disabled>Pilih ruangan tujuan...</option>
              <option
                v-for="s in targetCase?.scenes.filter(s => s.id !== activeScene?.id)"
                :key="s.id"
                :value="s.id"
              >
                {{ s.name }}
              </option>
            </select>
          </div>

          <!-- If Evidence or Decoy: Link to Case Evidence -->
          <div v-if="hotspotForm.type === 'evidence' || hotspotForm.type === 'decoy'">
            <label class="block text-xs font-semibold text-gray-300 mb-1.5">Tautkan ke Master Barang Bukti</label>
            <select
              v-model="hotspotForm.evidenceId"
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="">-- Buat Bukti Otomatis dari Hotspot ini --</option>
              <option
                v-for="ev in targetCase?.evidences"
                :key="ev.id"
                :value="ev.id"
              >
                {{ ev.name }} ({{ ev.importance }})
              </option>
            </select>
          </div>
        </div>

        <!-- Panel Footer Actions -->
        <div class="p-4 border-t border-crime-800 flex items-center justify-between">
          <button
            @click="resetHotspotForm"
            class="px-3 py-2 rounded-xl text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-300"
          >
            Batal
          </button>
          <button
            @click="handleSaveHotspot"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-md shadow-red-950 flex items-center gap-1.5"
          >
            <span>💾</span> Simpan Hotspot
          </button>
        </div>
      </aside>
    </div>

    <!-- Modal Tambah Ruangan Baru -->
    <div
      v-if="isNewSceneModalOpen"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-crime-900 border border-crime-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
          <span>🚪</span> Tambah Ruangan (Scene 360°) Baru
        </h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-300 font-semibold mb-1">Nama Ruangan *</label>
            <input
              v-model="newSceneForm.name"
              type="text"
              placeholder="Misal: Security Office / Ruang Arsip"
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Deskripsi Ruangan</label>
            <textarea
              v-model="newSceneForm.description"
              rows="2"
              placeholder="Jelaskan kondisi dan fungsi ruangan ini..."
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-300 font-semibold mb-1">Gambar Panorama 360°</label>
            <select
              v-model="newSceneForm.panoramaPath"
              class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option
                v-for="p in availablePanoramaPresets"
                :key="p.path"
                :value="p.path"
              >
                {{ p.label }} ({{ p.path }})
              </option>
            </select>
            <p class="text-[11px] text-gray-400 mt-1">
              File tersimpan pada direktori <code>public/panoramas/</code>.
            </p>
          </div>
        </div>

        <div class="pt-3 border-t border-crime-800 flex items-center justify-end gap-2">
          <button
            @click="isNewSceneModalOpen = false"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-300"
          >
            Batal
          </button>
          <button
            @click="handleCreateScene"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white shadow-md"
          >
            Tambah Ruangan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
