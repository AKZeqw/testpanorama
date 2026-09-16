<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'

const router = useRouter()
const caseStore = useCaseStore()

const handleStartCase = (caseId: string) => {
  caseStore.loadCase(caseId)
  router.push(`/cases/${caseId}`)
}
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 flex flex-col justify-between">
    <!-- Navbar -->
    <header class="h-20 border-b border-crime-800 bg-crime-900/80 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🚨</span>
        <div>
          <h1 class="font-black text-lg md:text-xl tracking-wider uppercase text-white">
            Crime Investigation
          </h1>
          <p class="text-xs text-red-500 font-mono tracking-widest uppercase">
            Panorama 360° Forensic Game
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/admin"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 transition flex items-center gap-1.5"
        >
          <span>⚙️</span> Portal Dosen / Admin
        </router-link>
        <span class="text-xs font-mono text-gray-400 bg-crime-800/80 px-3 py-1.5 rounded-lg border border-crime-700 hidden sm:inline-block">
          Agent: <strong class="text-gray-200">CID-7749</strong>
        </span>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800 text-red-400 text-xs font-semibold mb-4 tracking-wider uppercase">
          <span>●</span> Interactive Virtual Crime Scene
        </div>
        <h2 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          "Every clue tells a story."
        </h2>
        <p class="text-gray-400 text-base md:text-lg leading-relaxed">
          Masuki tempat kejadian perkara melalui panorama 360° interaktif. Telusuri ruangan, temukan barang bukti tersembunyi, dan pecahkan misteri kasus kriminal.
        </p>
      </div>

      <!-- Case List -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-crime-800">
          <h3 class="text-xl font-bold text-gray-100 flex items-center gap-2">
            <span>📁</span> Available Cases
          </h3>
          <span class="text-xs text-gray-400 font-mono">
            {{ caseStore.cases.length }} Kasus Aktif
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="c in caseStore.cases"
            :key="c.id"
            class="group relative bg-crime-900 border border-crime-700/80 hover:border-red-600/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
          >
            <!-- Image / Cover -->
            <div class="relative h-44 bg-crime-950 overflow-hidden">
              <img
                :src="c.coverImage || '/panoramas/laboratory.jpg'"
                :alt="c.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-crime-900 via-crime-900/30 to-transparent"></div>
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-red-400 border border-red-900/60">
                  {{ c.caseNumber }}
                </span>
                <span class="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-semibold uppercase tracking-wider">
                  {{ c.difficulty }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="text-xl font-bold text-white group-hover:text-red-400 transition mb-2">
                  {{ c.title }}
                </h4>
                <p class="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                  {{ c.description }}
                </p>

                <div class="space-y-1.5 text-xs text-gray-400 mb-6 font-mono">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">📍 Lokasi:</span>
                    <span class="text-gray-300">{{ c.location }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">⏰ Waktu:</span>
                    <span class="text-gray-300">{{ c.time }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">🔎 Bukti:</span>
                    <span class="text-gray-300">{{ c.evidences.length }} Target Petunjuk</span>
                  </div>
                </div>
              </div>

              <button
                @click="handleStartCase(c.id)"
                class="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition"
              >
                <span>Investigate</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-crime-800/80 bg-crime-900/50 py-6 text-center text-xs text-gray-500 font-mono">
      Crime Investigation 360° — Forensic Education Platform
    </footer>
  </div>
</template>
