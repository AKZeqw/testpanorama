<script setup lang="ts">
import type { Evidence } from '@/types/evidence'
import { useInvestigationStore } from '@/stores/investigationStore'

const props = defineProps<{
  evidence: Evidence | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'collected', evidenceId: string): void
}>()

const investigationStore = useInvestigationStore()

const handleAddEvidence = () => {
  if (!props.evidence) return
  investigationStore.addEvidence(props.evidence.id)
  emit('collected', props.evidence.id)
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen && evidence"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    @click.self="emit('close')"
  >
    <div class="relative w-full max-w-lg bg-crime-900 border border-crime-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-gray-100">
      <!-- Header with Crime Tape Style -->
      <div class="flex items-center justify-between pb-4 border-b border-crime-700/60 mb-5">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🔎</span>
          <div>
            <div class="text-xs uppercase font-mono tracking-widest text-red-500 font-bold">
              Evidence Found
            </div>
            <h3 class="text-xl font-bold text-white tracking-wide">
              {{ evidence.name }}
            </h3>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-crime-800 transition"
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs">
          <span class="px-2.5 py-1 rounded-md bg-crime-800 border border-crime-700 text-gray-300">
            📍 {{ evidence.discoveredSceneName }}
          </span>
          <span
            :class="[
              'px-2.5 py-1 rounded-md font-semibold text-xs',
              evidence.importance === 'Critical'
                ? 'bg-red-950/80 text-red-300 border border-red-800'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800'
            ]"
          >
            {{ evidence.importance }} Clue
          </span>
        </div>

        <div class="bg-crime-950/80 p-4 rounded-xl border border-crime-800/80 text-gray-300 text-sm leading-relaxed">
          <p class="font-medium text-white mb-1">Keterangan Awal:</p>
          <p>{{ evidence.description }}</p>
        </div>

        <div v-if="evidence.detailedAnalysis" class="bg-crime-850 p-4 rounded-xl border border-crime-700/60 text-gray-300 text-sm leading-relaxed">
          <p class="font-medium text-blue-400 flex items-center gap-1 mb-1">
            <span>🔬</span> Analisis Forensik:
          </p>
          <p class="text-gray-300 text-xs leading-relaxed">{{ evidence.detailedAnalysis }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 pt-4 border-t border-crime-700/60 flex items-center justify-end gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-crime-800 transition"
        >
          Tutup
        </button>

        <button
          v-if="!investigationStore.isEvidenceDiscovered(evidence.id)"
          @click="handleAddEvidence"
          class="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/40 transition flex items-center gap-2"
        >
          <span>📥</span> Add to Evidence
        </button>

        <span
          v-else
          class="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1.5"
        >
          <span>✓</span> Tersimpan di Evidence Board
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.18s ease-out forwards;
}
</style>
