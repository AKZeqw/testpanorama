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

const selectedDecoyEvidences = computed(() => {
  const ids = res.value?.selectedRedHerringIds || []
  return currentCase.value.evidences.filter(e => ids.includes(e.id))
})

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
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
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
            <span class="text-[11px] font-mono text-gray-500 block mb-1">Modus Operandi</span>
            <span
              :class="[
                'text-base font-bold',
                res?.isModusOperandiCorrect ? 'text-emerald-400' : 'text-amber-400'
              ]"
            >
              {{ res?.isModusOperandiCorrect ? '✓ Tepat (+15)' : '✗ Keliru (0)' }}
            </span>
          </div>

          <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-center">
            <span class="text-[11px] font-mono text-gray-500 block mb-1">Jebakan Red Herring</span>
            <span
              :class="[
                'text-base font-bold',
                (res?.redHerringsCount ?? 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
              ]"
            >
              {{ (res?.redHerringsCount ?? 0) > 0 ? `${res?.redHerringsCount} Terjebak (-${(res?.redHerringsCount ?? 0) * 10} pt)` : '✓ Bersih (0)' }}
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
              {{ res?.isExplanationValid ? '✓ Valid (+10)' : 'Kurang Lengkap' }}
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
            <span>🔍</span> Rekonstruksi Fakta & Kunci Forensik Kasus
          </h4>
          <div class="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p>
              Pelaku sebenarnya adalah <strong>Andi Saputra (Asisten Laboratorium)</strong>.
            </p>
            <p>
              <strong>Modus Operandi:</strong> Pelaku memanfaatkan wewenang internalnya untuk mengunduh log arsip pada pukul 22:07 sebelum sengaja memotong kabel CCTV laboratorium. Dengan <em>Kartu Akses Master #088</em> miliknya, ia membuka brankas penyimpanan arsip digital pada pukul 22:12 dan memalsukan paraf serah terima.
            </p>
            <p>
              <strong>Bukti Forensik Tak Terbantahkan:</strong> Pemeriksaan menggunakan <em>Senter UV Forensik</em> membuktikan keberadaan pendaran residu kimia pada gagang pintu koridor yang memuat sidik jari jempol kanan dengan bekas goresan luka identik milik Andi Saputra—seketika mematahkan alibinya bahwa ia sudah pulang pada pukul 21:00.
            </p>
            <p class="text-gray-500 italic text-[11px] border-t border-crime-800 pt-2">
              ⚠️ Catatan Forensik: Sarung Tangan Hitam Budi, Surat Somasi Dr. Citra, dan Kunci Berkarat adalah bukti Decoy (Red Herring) yang sengaja dirancang untuk menguji objektivitas dan logika deduksi penyidik.
            </p>
          </div>
        </div>

        <!-- Decoy Analysis Card -->
        <div class="bg-crime-950 p-6 rounded-2xl border border-crime-800 space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
            <span>🎭</span> Evaluasi Jebakan Decoy (Red Herrings)
          </h4>
          
          <div v-if="(res?.redHerringsCount ?? 0) > 0" class="space-y-3">
            <p class="text-xs text-gray-300">
              Anda menyertakan <strong class="text-rose-400">{{ res?.redHerringsCount }} bukti pengalih / decoy</strong> dalam kesimpulan yang mengakibatkan penalti skor (-{{ (res?.redHerringsCount ?? 0) * 10 }} poin):
            </p>
            <div class="space-y-2">
              <div
                v-for="decoy in selectedDecoyEvidences"
                :key="decoy.id"
                class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/60 text-xs text-gray-300"
              >
                <div class="flex items-center justify-between font-bold text-rose-300 mb-1">
                  <span>❌ {{ decoy.name }}</span>
                  <span class="font-mono text-[10px] text-rose-400 font-bold">-10 Poin</span>
                </div>
                <p class="text-[11px] text-gray-400 leading-relaxed">{{ decoy.detailedAnalysis }}</p>
              </div>
            </div>
          </div>

          <div v-else class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-3">
            <span class="text-2xl">🛡️</span>
            <div>
              <strong class="block text-emerald-400 text-sm">Ketajaman Deduktif Sempurna!</strong>
              <span class="text-[11px] text-emerald-200/80 leading-relaxed">
                Anda berhasil mengabaikan seluruh jebakan bukti Decoy (Sarung Tangan Budi, Surat Somasi Dr. Citra, Kunci Berkarat) dan hanya mengandalkan bukti dengan kausalitas murni.
              </span>
            </div>
          </div>
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
