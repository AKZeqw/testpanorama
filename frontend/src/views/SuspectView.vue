<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import { useInvestigationStore } from '@/stores/investigationStore'
import SuspectCard from '@/components/suspect/SuspectCard.vue'

const router = useRouter()
const caseStore = useCaseStore()
const investigationStore = useInvestigationStore()

const currentCase = computed(() => caseStore.currentCase)
const suspects = computed(() => caseStore.suspects)

const handleSelectSuspect = (suspectId: string) => {
  investigationStore.selectedSuspectId = suspectId
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
            Suspect Board
          </span>
          <h2 class="text-base font-bold text-white">
            Daftar Terduga Pelaku — {{ currentCase.title }}
          </h2>
        </div>
      </div>

      <router-link
        :to="`/cases/${currentCase.id}/conclusion`"
        class="px-4 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white transition flex items-center gap-2"
      >
        <span>⚖️</span> Susun Kesimpulan
      </router-link>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
      <div class="mb-8">
        <h3 class="text-2xl font-black text-white tracking-wide mb-2 flex items-center gap-2">
          <span>👥</span> Profil Tersangka
        </h3>
        <p class="text-xs text-gray-400">
          Analisis latar belakang, alibi, dan akses ruangan masing-masing orang yang berada di sekitar lokasi pada saat kejadian.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SuspectCard
          v-for="suspect in suspects"
          :key="suspect.id"
          :suspect="suspect"
          :is-selected="investigationStore.selectedSuspectId === suspect.id"
          :can-select="true"
          @select="handleSelectSuspect"
        />
      </div>

      <!-- Evidence vs Suspect Relationship Insight -->
      <div class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6">
        <h4 class="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2 font-mono uppercase text-red-400">
          <span>🔍</span> Catatan Hubungan Bukti & Tersangka
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-3 bg-crime-950 rounded-xl border border-crime-800">
            <span class="font-bold text-gray-200 block mb-1">Andi (Asisten Lab)</span>
            <span class="text-gray-400">Memiliki sidik jari di kartu master ID 088 & tercatat mengakses laptop.</span>
          </div>
          <div class="p-3 bg-crime-950 rounded-xl border border-crime-800">
            <span class="font-bold text-gray-200 block mb-1">Budi (Security)</span>
            <span class="text-gray-400">Sepatu dinas bertipe boot dan memiliki otoritas kontrol rekaman CCTV.</span>
          </div>
          <div class="p-3 bg-crime-950 rounded-xl border border-crime-800">
            <span class="font-bold text-gray-200 block mb-1">Dr. Citra (Lead Researcher)</span>
            <span class="text-gray-400">Tanda tangan dipalsukan pada buku serah terima kunci spesimen.</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
