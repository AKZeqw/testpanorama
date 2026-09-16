<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import { useInvestigationStore } from '@/stores/investigationStore'
import PanoramaViewer from '@/components/panorama/PanoramaViewer.vue'
import EvidenceModal from '@/components/evidence/EvidenceModal.vue'
import TimerBadge from '@/components/ui/TimerBadge.vue'
import type { Evidence } from '@/types/evidence'

const router = useRouter()
const caseStore = useCaseStore()
const investigationStore = useInvestigationStore()

const currentCase = computed(() => caseStore.currentCase)
const currentScene = computed(() => caseStore.currentScene)

// State Modal Evidence
const isEvidenceModalOpen = ref(false)
const activeEvidence = ref<Evidence | null>(null)

// State Forensic UV Tool & Locked Clues
const isUvMode = ref(false)
const lockedClueMessage = ref<string | null>(null)

// State Sidebar Tab
const activeTab = ref<'brief' | 'notes' | 'scenes'>('brief')
const newNoteInput = ref('')

onMounted(() => {
  investigationStore.startTimer()
})

const handleSelectEvidence = (evidenceId: string) => {
  const found = currentCase.value.evidences.find(e => e.id === evidenceId)
  if (found) {
    activeEvidence.value = found
    isEvidenceModalOpen.value = true
  }
}

const handleLockedClue = (payload: { requiresEvidenceId: string; evidenceId?: string }) => {
  const isUnlocked = investigationStore.isEvidenceDiscovered(payload.requiresEvidenceId)
  if (isUnlocked) {
    if (payload.evidenceId) {
      handleSelectEvidence(payload.evidenceId)
    }
  } else {
    const reqEv = currentCase.value.evidences.find(e => e.id === payload.requiresEvidenceId)
    const clueName = reqEv ? reqEv.name : 'bukti otorisasi kunci'
    lockedClueMessage.value = `Objek ini terproteksi dan membutuhkan "${clueName}" untuk dapat diinspeksi. Temukan bukti tersebut di TKP terlebih dahulu!`
  }
}

const handleNavigateScene = (targetSceneId: string) => {
  caseStore.changeScene(targetSceneId)
}

const handleAddNote = () => {
  if (newNoteInput.value.trim()) {
    investigationStore.addNote(newNoteInput.value)
    newNoteInput.value = ''
  }
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-crime-950 text-gray-100 overflow-hidden select-none">
    <!-- Topbar Navigation -->
    <header class="h-16 px-4 md:px-6 bg-crime-900 border-b border-crime-700/80 flex items-center justify-between z-20 shadow-md">
      <!-- Left: Case Identification -->
      <div class="flex items-center gap-3">
        <router-link
          to="/"
          class="p-2 rounded-lg bg-crime-800 hover:bg-crime-700 text-gray-400 hover:text-white transition text-xs font-bold"
          title="Kembali ke Beranda"
        >
          ← Home
        </router-link>
        <div class="hidden sm:block">
          <div class="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">
            {{ currentCase.caseNumber }}
          </div>
          <h1 class="text-sm md:text-base font-bold text-white truncate max-w-xs md:max-w-md">
            {{ currentCase.title }}
          </h1>
        </div>
      </div>

      <!-- Center: Scene & Evidence Status -->
      <div class="flex items-center gap-2 md:gap-4">
        <!-- Scene Badge -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-crime-800/80 border border-crime-700 text-xs">
          <span class="text-blue-400">📍</span>
          <span class="font-semibold text-gray-200">{{ currentScene.name }}</span>
        </div>

        <!-- Evidence Counter -->
        <router-link
          :to="`/cases/${currentCase.id}/evidence`"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-crime-800 hover:bg-crime-700 border border-crime-700 text-xs font-bold text-gray-200 transition"
        >
          <span>🔎</span>
          <span>Evidence:</span>
          <span class="text-red-400 font-mono">
            {{ investigationStore.evidenceCount }} / {{ investigationStore.totalEvidenceCount }}
          </span>
        </router-link>

        <!-- Senter UV Toggle Button -->
        <button
          @click="isUvMode = !isUvMode"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition shadow-sm',
            isUvMode
              ? 'bg-purple-950 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] ring-1 ring-cyan-400'
              : 'bg-crime-800 hover:bg-crime-700 text-gray-300 border-crime-700'
          ]"
          title="Nyalakan Senter UV untuk mengungkap pendaran sidik jari & residu tersembunyi"
        >
          <span>🔦</span>
          <span class="hidden sm:inline">Senter UV:</span>
          <span :class="isUvMode ? 'text-cyan-300 font-mono' : 'text-gray-400 font-mono'">{{ isUvMode ? 'ON' : 'OFF' }}</span>
        </button>

        <!-- Timer -->
        <TimerBadge />
      </div>

      <!-- Right: Action Tabs -->
      <div class="flex items-center gap-2">
        <router-link
          :to="`/cases/${currentCase.id}/suspects`"
          class="px-3 py-1.5 rounded-lg bg-crime-800 hover:bg-crime-700 text-xs font-semibold text-gray-200 border border-crime-700 transition hidden lg:inline-flex items-center gap-1.5"
        >
          <span>👥</span> Suspects
        </router-link>

        <router-link
          :to="`/cases/${currentCase.id}/conclusion`"
          class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-950 flex items-center gap-1.5"
        >
          <span>⚖️</span> Kesimpulan
        </router-link>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- 360 Panorama Viewport -->
      <main class="flex-1 h-full relative bg-black">
        <PanoramaViewer
          :panorama="currentScene.panoramaPath"
          :hotspots="currentScene.hotspots"
          :is-uv-mode="isUvMode"
          @select-evidence="handleSelectEvidence"
          @navigate-scene="handleNavigateScene"
          @locked-clue="handleLockedClue"
        />

        <!-- Scene Bottom Bar Overlay -->
        <div class="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-crime-900/90 backdrop-blur-md border border-crime-700/80 px-4 py-2 rounded-xl shadow-xl">
          <span class="text-xs text-gray-400 font-mono">Lokasi:</span>
          <span class="text-xs font-bold text-white">{{ currentScene.name }}</span>
          <div class="h-3 w-px bg-crime-700 mx-1"></div>
          <span class="text-[11px] text-gray-400">Putar 360° menggunakan kursor mouse</span>
        </div>
      </main>

      <!-- Right Inspection Sidebar -->
      <aside class="w-80 md:w-96 bg-crime-900 border-l border-crime-700/80 flex flex-col h-full z-10">
        <!-- Sidebar Tabs -->
        <div class="h-12 border-b border-crime-700/80 grid grid-cols-3 text-xs font-semibold">
          <button
            @click="activeTab = 'brief'"
            :class="[
              'h-full border-b-2 transition flex items-center justify-center gap-1.5',
              activeTab === 'brief'
                ? 'border-red-500 text-white bg-crime-850'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            ]"
          >
            <span>📋</span> Kasus
          </button>
          <button
            @click="activeTab = 'notes'"
            :class="[
              'h-full border-b-2 transition flex items-center justify-center gap-1.5',
              activeTab === 'notes'
                ? 'border-red-500 text-white bg-crime-850'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            ]"
          >
            <span>📝</span> Catatan
          </button>
          <button
            @click="activeTab = 'scenes'"
            :class="[
              'h-full border-b-2 transition flex items-center justify-center gap-1.5',
              activeTab === 'scenes'
                ? 'border-red-500 text-white bg-crime-850'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            ]"
          >
            <span>🚪</span> Denah
          </button>
        </div>

        <!-- Sidebar Body -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6">
          <!-- TAB 1: BRIEF -->
          <div v-if="activeTab === 'brief'" class="space-y-4 text-xs">
            <div class="bg-crime-950 p-4 rounded-xl border border-crime-800">
              <h3 class="font-bold text-gray-200 uppercase tracking-wider mb-1.5 text-[11px] text-red-400 font-mono">
                Ringkasan Kejadian
              </h3>
              <p class="text-gray-300 leading-relaxed">{{ currentCase.description }}</p>
            </div>

            <div class="bg-crime-950 p-4 rounded-xl border border-crime-800">
              <h3 class="font-bold text-gray-200 uppercase tracking-wider mb-1.5 text-[11px] text-blue-400 font-mono">
                Target Objektif
              </h3>
              <p class="text-gray-300 leading-relaxed">{{ currentCase.objective }}</p>
            </div>

            <!-- Discovered in this session -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-gray-300">Bukti Ditemukan:</span>
                <span class="text-xs font-mono text-red-400">
                  {{ investigationStore.evidenceCount }} / {{ investigationStore.totalEvidenceCount }}
                </span>
              </div>

              <div v-if="investigationStore.discoveredEvidences.length === 0" class="p-4 rounded-xl bg-crime-950/60 border border-dashed border-crime-800 text-center text-gray-500">
                Belum ada bukti yang diambil. Klik ikon 🔎 pada panorama untuk memeriksa bukti.
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="ev in investigationStore.discoveredEvidences"
                  :key="ev.id"
                  @click="handleSelectEvidence(ev.id)"
                  class="p-2.5 rounded-lg bg-crime-800/70 border border-crime-700 hover:border-red-500/70 cursor-pointer flex items-center justify-between transition"
                >
                  <div class="flex items-center gap-2">
                    <span>📁</span>
                    <span class="font-medium text-gray-200 truncate">{{ ev.name }}</span>
                  </div>
                  <span class="text-[10px] text-gray-400 font-mono">Lihat →</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: NOTES -->
          <div v-if="activeTab === 'notes'" class="space-y-4">
            <div class="flex gap-2">
              <input
                v-model="newNoteInput"
                @keyup.enter="handleAddNote"
                type="text"
                placeholder="Tulis catatan penyelidikan..."
                class="flex-1 bg-crime-950 border border-crime-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <button
                @click="handleAddNote"
                class="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                +
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(note, idx) in investigationStore.notes"
                :key="idx"
                class="p-3 bg-crime-950 rounded-xl border border-crime-800 text-xs text-gray-300 flex items-start justify-between gap-2"
              >
                <p class="leading-relaxed">{{ note }}</p>
                <button
                  @click="investigationStore.deleteNote(idx)"
                  class="text-gray-500 hover:text-red-400 text-xs px-1"
                  title="Hapus"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 3: SCENES -->
          <div v-if="activeTab === 'scenes'" class="space-y-3">
            <p class="text-xs text-gray-400">Pilih ruangan untuk berpindah langsung:</p>
            <div
              v-for="scene in caseStore.scenes"
              :key="scene.id"
              @click="handleNavigateScene(scene.id)"
              :class="[
                'p-3 rounded-xl border cursor-pointer transition flex items-center justify-between',
                scene.id === currentScene.id
                  ? 'bg-crime-850 border-red-500 ring-1 ring-red-500/50'
                  : 'bg-crime-950 border-crime-800 hover:border-gray-600'
              ]"
            >
              <div>
                <h4 class="text-xs font-bold text-white">{{ scene.name }}</h4>
                <p class="text-[11px] text-gray-400 line-clamp-1">{{ scene.description }}</p>
              </div>
              <span v-if="scene.id === currentScene.id" class="text-xs text-red-400 font-bold">Aktif</span>
              <span v-else class="text-xs text-gray-500">Masuk →</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Evidence Inspection Modal -->
    <EvidenceModal
      :evidence="activeEvidence"
      :is-open="isEvidenceModalOpen"
      @close="isEvidenceModalOpen = false"
    />

    <!-- Forensic Locked Clue Alert Modal -->
    <div
      v-if="lockedClueMessage"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div class="bg-crime-900 border border-amber-500/80 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-500 text-2xl flex items-center justify-center mx-auto text-amber-400 animate-pulse">
          🔒
        </div>
        <div>
          <span class="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">Akses Forensik Terkunci</span>
          <h3 class="text-base font-bold text-white mt-1">
            Objek Terproteksi
          </h3>
        </div>
        <p class="text-xs text-gray-300 leading-relaxed bg-crime-950 p-4 rounded-xl border border-crime-800">
          {{ lockedClueMessage }}
        </p>
        <button
          @click="lockedClueMessage = null"
          class="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950 transition"
        >
          Saya Mengerti, Telusuri TKP Dahulu
        </button>
      </div>
    </div>
  </div>
</template>
