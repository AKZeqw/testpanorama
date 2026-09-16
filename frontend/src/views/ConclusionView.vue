<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import { useInvestigationStore } from '@/stores/investigationStore'

const router = useRouter()
const caseStore = useCaseStore()
const investigationStore = useInvestigationStore()

const currentCase = computed(() => caseStore.currentCase)
const suspects = computed(() => caseStore.suspects)
const discoveredEvidences = computed(() => investigationStore.discoveredEvidences)

const selectedSuspectId = ref<string>(investigationStore.selectedSuspectId || '')
const explanation = ref<string>(investigationStore.conclusionExplanation || '')
const selectedEvidenceIds = ref<string[]>(
  investigationStore.supportingEvidenceIds.length > 0
    ? [...investigationStore.supportingEvidenceIds]
    : [...investigationStore.discoveredEvidenceIds]
)

const toggleEvidence = (id: string) => {
  if (selectedEvidenceIds.value.includes(id)) {
    selectedEvidenceIds.value = selectedEvidenceIds.value.filter(item => item !== id)
  } else {
    selectedEvidenceIds.value.push(id)
  }
}

const handleSubmit = () => {
  if (!selectedSuspectId.value) {
    alert('Silakan pilih salah satu tersangka yang Anda duga paling bertanggung jawab.')
    return
  }

  investigationStore.submitConclusion(
    selectedSuspectId.value,
    explanation.value,
    selectedEvidenceIds.value
  )

  router.push(`/cases/${currentCase.value.id}/result`)
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
          ← Kembali ke Penyelidikan
        </button>
        <div>
          <span class="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">
            Final Forensic Report
          </span>
          <h2 class="text-base font-bold text-white">
            Kesimpulan Investigasi Kasus
          </h2>
        </div>
      </div>

      <div class="text-xs font-mono text-gray-400">
        Waktu: <strong class="text-red-400">{{ investigationStore.formattedTime }}</strong>
      </div>
    </header>

    <!-- Main Conclusion Form -->
    <main class="max-w-4xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
      <!-- Section 1: WHO IS RESPONSIBLE -->
      <section class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 shadow-xl">
        <h3 class="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>1.</span> SIAPA PELAKU YANG PALING BERTANGGUNG JAWAB?
        </h3>
        <p class="text-xs text-gray-400 mb-5">
          Tentukan siapa tersangka utama berdasarkan alibi dan bukti fisik yang ditemukan di TKP.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="suspect in suspects"
            :key="suspect.id"
            @click="selectedSuspectId = suspect.id"
            :class="[
              'p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between',
              selectedSuspectId === suspect.id
                ? 'bg-crime-850 border-red-500 ring-2 ring-red-500/30'
                : 'bg-crime-950 border-crime-800 hover:border-gray-600'
            ]"
          >
            <div>
              <div class="text-2xl mb-2">👤</div>
              <h4 class="font-bold text-sm text-white">{{ suspect.name }}</h4>
              <p class="text-xs text-red-400 font-mono mb-2">{{ suspect.role }}</p>
              <p class="text-[11px] text-gray-400 line-clamp-2">{{ suspect.alibi }}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-crime-800 flex items-center justify-between text-xs">
              <span :class="selectedSuspectId === suspect.id ? 'text-red-400 font-bold' : 'text-gray-500'">
                {{ selectedSuspectId === suspect.id ? '● Dipilih' : '○ Klik untuk memilih' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: WHAT HAPPENED -->
      <section class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 shadow-xl">
        <h3 class="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>2.</span> BAGAIMANA REKONSTRUKSI KRONOLOGI KEJADIAN?
        </h3>
        <p class="text-xs text-gray-400 mb-4">
          Jelaskan secara singkat alur pelaku saat mengambil barang bukti dan mematikan pengawasan.
        </p>

        <textarea
          v-model="explanation"
          rows="4"
          placeholder="Contoh: Pelaku menggunakan kartu akses master untuk membuka lab, memotong kabel CCTV, lalu mengakses laptop untuk menghapus rekaman log sebelum membawa lari sampel..."
          class="w-full bg-crime-950 border border-crime-700 rounded-xl p-4 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500 transition leading-relaxed"
        ></textarea>
      </section>

      <!-- Section 3: SUPPORTING EVIDENCE -->
      <section class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 shadow-xl">
        <h3 class="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>3.</span> BUKTI MANA SAJA YANG MENDUKUNG KESIMPULAN ANDA?
        </h3>
        <p class="text-xs text-gray-400 mb-4">
          Centang bukti yang paling krusial membuktikan keterlibatan tersangka.
        </p>

        <div v-if="discoveredEvidences.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            v-for="ev in discoveredEvidences"
            :key="ev.id"
            :class="[
              'p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between',
              selectedEvidenceIds.includes(ev.id)
                ? 'bg-crime-850 border-red-500/80 text-white'
                : 'bg-crime-950 border-crime-800 text-gray-400 hover:border-gray-700'
            ]"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="selectedEvidenceIds.includes(ev.id)"
                @change="toggleEvidence(ev.id)"
                class="rounded border-crime-700 bg-crime-800 text-red-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span class="text-xs font-semibold">{{ ev.name }}</span>
            </div>
            <span class="text-[10px] font-mono text-gray-500">{{ ev.importance }}</span>
          </label>
        </div>

        <div v-else class="p-6 bg-crime-950 border border-dashed border-crime-800 rounded-xl text-center text-xs text-gray-500">
          Anda belum mengumpulkan bukti apa pun dari TKP. Anda tetap dapat submit, namun nilai akurasi akan lebih rendah.
        </div>
      </section>

      <!-- Submit CTA -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          @click="handleSubmit"
          class="px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-xl shadow-red-950/70 transition flex items-center gap-2 uppercase tracking-wider"
        >
          <span>⚖️</span>
          <span>Submit Kesimpulan Investigasi</span>
        </button>
      </div>
    </main>
  </div>
</template>
