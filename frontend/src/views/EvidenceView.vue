<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import { useInvestigationStore } from '@/stores/investigationStore'
import EvidenceCard from '@/components/evidence/EvidenceCard.vue'
import EvidenceModal from '@/components/evidence/EvidenceModal.vue'
import type { Evidence } from '@/types/evidence'

const router = useRouter()
const caseStore = useCaseStore()
const investigationStore = useInvestigationStore()

const currentCase = computed(() => caseStore.currentCase)
const discoveredEvidences = computed(() => investigationStore.discoveredEvidences)

const isModalOpen = ref(false)
const selectedEvidence = ref<Evidence | null>(null)

const handleInspect = (ev: Evidence) => {
  selectedEvidence.value = ev
  isModalOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 flex flex-col justify-between">
    <!-- Header -->
    <header class="h-20 border-b border-crime-800 bg-crime-900/80 px-6 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="router.back()"
          class="text-xs font-semibold px-3.5 py-2 rounded-lg bg-crime-800 hover:bg-crime-700 text-gray-300 border border-crime-700 transition"
        >
          ← Kembali ke TKP
        </button>
        <div>
          <span class="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">
            Evidence Board
          </span>
          <h2 class="text-base font-bold text-white">
            Papan Barang Bukti — {{ currentCase.title }}
          </h2>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-gray-400 bg-crime-850 px-3 py-1.5 rounded-lg border border-crime-700">
          Terkumpul:
          <strong class="text-red-400">{{ investigationStore.evidenceCount }}</strong> / {{ investigationStore.totalEvidenceCount }}
        </span>
      </div>
    </header>

    <!-- Main Board -->
    <main class="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
      <div class="mb-8">
        <h3 class="text-2xl font-black text-white tracking-wide mb-2 flex items-center gap-2">
          <span>📁</span> Barang Bukti Kasus
        </h3>
        <p class="text-xs text-gray-400">
          Daftar seluruh petunjuk forensik yang telah diamankan dari seluruh lokasi TKP.
        </p>
      </div>

      <!-- Discovered Evidences Grid -->
      <div v-if="discoveredEvidences.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <EvidenceCard
          v-for="ev in discoveredEvidences"
          :key="ev.id"
          :evidence="ev"
          :is-discovered="true"
          @inspect="handleInspect"
        />
      </div>

      <!-- Empty state if none found yet -->
      <div v-else class="p-12 text-center rounded-2xl bg-crime-900 border border-dashed border-crime-800 mb-12">
        <span class="text-4xl block mb-3">🔍</span>
        <h4 class="text-base font-bold text-gray-300 mb-1">Belum Ada Bukti yang Disimpan</h4>
        <p class="text-xs text-gray-500 max-w-md mx-auto mb-5">
          Masuk ke area panorama 360°, cari objek berlabel 🔎, lalu klik <strong>"Add to Evidence"</strong> untuk menyimpannya di sini.
        </p>
        <button
          @click="router.push(`/cases/${currentCase.id}/investigate`)"
          class="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white transition"
        >
          Masuk ke Ruangan TKP
        </button>
      </div>

      <!-- Undiscovered Evidence Placeholders -->
      <div v-if="investigationStore.evidenceCount < investigationStore.totalEvidenceCount" class="border-t border-crime-800/80 pt-8">
        <h4 class="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold mb-4">
          Petunjuk Belum Terungkap ({{ investigationStore.totalEvidenceCount - investigationStore.evidenceCount }} tersisa)
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="n in (investigationStore.totalEvidenceCount - investigationStore.evidenceCount)"
            :key="n"
            class="p-4 rounded-xl bg-crime-900/40 border border-crime-800/60 border-dashed flex items-center gap-3 text-gray-600 select-none"
          >
            <span class="text-xl opacity-40">❓</span>
            <div>
              <span class="text-xs font-mono block">Petunjuk Rahasia #{{ n }}</span>
              <span class="text-[11px] text-gray-600">Belum ditemukan di TKP</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detail Evidence -->
    <EvidenceModal
      :evidence="selectedEvidence"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>
