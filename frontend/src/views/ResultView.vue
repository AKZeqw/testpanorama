<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import { useInvestigationStore } from '@/stores/investigationStore'

const router = useRouter()
const caseStore = useCaseStore()
const investigationStore = useInvestigationStore()

const currentCase = computed(() => caseStore.currentCase)
const res = computed(() => investigationStore.result)

const handleRestart = () => {
  investigationStore.resetInvestigation()
  investigationStore.startTimer()
  router.push(`/cases/${currentCase.value.id}/investigate`)
}

const handleBackHome = () => {
  investigationStore.resetInvestigation()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 flex flex-col justify-between">
    <!-- Header -->
    <header class="h-20 border-b border-crime-800 bg-crime-900/80 px-6 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🏆</span>
        <div>
          <span class="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">
            Official Case Debrief
          </span>
          <h2 class="text-base font-bold text-white">
            Hasil Penyelidikan Kasus Kriminal
          </h2>
        </div>
      </div>

      <button
        @click="handleBackHome"
        class="text-xs font-semibold px-3.5 py-2 rounded-lg bg-crime-800 hover:bg-crime-700 text-gray-300 border border-crime-700 transition"
      >
        Beranda Kasus →
      </button>
    </header>

    <!-- Scorecard Body -->
    <main class="max-w-3xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
      <div class="bg-crime-900 border border-crime-700/80 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <!-- Badge Stamp -->
        <div class="text-center pb-8 border-b border-crime-800">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crime-800 text-gray-400 text-xs font-mono mb-3">
            {{ currentCase.caseNumber }} — {{ currentCase.title }}
          </div>
          <h3 class="text-3xl md:text-4xl font-black text-white tracking-wide mb-2">
            Investigation Completed
          </h3>
          <p class="text-xs text-gray-400">
            Laporan forensik Anda telah dievaluasi oleh sistem penyidik.
          </p>

          <!-- Big Score Circle -->
          <div class="mt-6 inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-red-600 bg-crime-950 shadow-xl shadow-red-950/40">
            <span class="text-xs uppercase font-mono text-gray-400">Skor Akhir</span>
            <span class="text-4xl font-black text-white font-mono">{{ res?.score ?? 0 }}</span>
            <span class="text-[10px] text-red-400 font-bold">DARI 100 POIN</span>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-center">
            <span class="text-[11px] font-mono text-gray-500 block mb-1">Bukti Ditemukan</span>
            <span class="text-base font-bold text-white">
              {{ res?.foundEvidencesCount ?? 0 }} / {{ res?.totalEvidences ?? 0 }}
            </span>
          </div>

          <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-center">
            <span class="text-[11px] font-mono text-gray-500 block mb-1">Tersangka Tepat</span>
            <span
              :class="[
                'text-base font-bold',
                res?.isSuspectCorrect ? 'text-emerald-400' : 'text-red-400'
              ]"
            >
              {{ res?.isSuspectCorrect ? '✓ Ya (Tepat)' : '✗ Salah' }}
            </span>
          </div>

          <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-center">
            <span class="text-[11px] font-mono text-gray-500 block mb-1">Analisis Logis</span>
            <span
              :class="[
                'text-base font-bold',
                res?.isExplanationValid ? 'text-emerald-400' : 'text-amber-400'
              ]"
            >
              {{ res?.isExplanationValid ? '✓ Valid' : 'Kurang Lengkap' }}
            </span>
          </div>

          <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-center">
            <span class="text-[11px] font-mono text-gray-500 block mb-1">Waktu Selesai</span>
            <span class="text-base font-bold text-red-400 font-mono">
              {{ res?.formattedTime ?? '00:00' }}
            </span>
          </div>
        </div>

        <!-- Official Case Resolution -->
        <div class="bg-crime-950 p-6 rounded-2xl border border-crime-800 space-y-4">
          <h4 class="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
            <span>🔍</span> Fakta Kasus & Pelaku Sebenarnya
          </h4>
          <p class="text-xs text-gray-300 leading-relaxed">
            Pelaku sebenarnya adalah <strong>Andi Saputra (Asisten Laboratorium)</strong>. Bukti kunci yang menjerat tersangka adalah ditemukannya <em>Kartu Akses Master #088</em> miliknya di dekat brankas, riwayat download file di <em>Laptop</em> korban pada pukul 22:07, serta catatan serah terima palsu pada <em>Buku Log Brankas</em>.
          </p>
        </div>

        <!-- Action CTAs -->
        <div class="mt-8 pt-6 border-t border-crime-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            @click="handleRestart"
            class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-crime-800 hover:bg-crime-700 text-gray-300 border border-crime-700 transition"
          >
            🔄 Ulangi Penyelidikan
          </button>
          <button
            @click="handleBackHome"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-950 transition"
          >
            Pilih Kasus Lain
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
