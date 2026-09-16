<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import { useInvestigationStore } from '@/stores/investigationStore'

const route = useRoute()
const router = useRouter()
const caseStore = useCaseStore()
const investigationStore = useInvestigationStore()

const caseId = computed(() => (route.params.id as string) || caseStore.currentCaseId)
const activeCase = computed(() => {
  return caseStore.cases.find(c => c.id === caseId.value) || caseStore.currentCase
})

const handleStartInvestigation = () => {
  investigationStore.startTimer()
  router.push(`/cases/${activeCase.value.id}/investigate`)
}
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 flex flex-col justify-between">
    <!-- Header -->
    <header class="h-20 border-b border-crime-800 bg-crime-900/80 px-6 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link
          to="/"
          class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-crime-800 hover:bg-crime-700 text-gray-300 border border-crime-700 transition"
        >
          ← Kembali
        </router-link>
        <span class="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">
          Case Briefing File
        </span>
      </div>

      <div class="text-xs font-mono text-gray-400">
        Status: <span class="text-amber-400 font-semibold uppercase">{{ activeCase.status }}</span>
      </div>
    </header>

    <!-- Main Briefing Dossier -->
    <main class="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
      <div class="bg-crime-900 border border-crime-700/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <!-- Watermark / Stamp -->
        <div class="absolute -right-6 -top-6 w-36 h-36 border-4 border-red-900/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
          <span class="text-red-900/30 font-black text-sm tracking-widest uppercase">CONFIDENTIAL</span>
        </div>

        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 rounded-md bg-red-950 text-red-400 border border-red-900 text-xs font-mono font-bold">
              {{ activeCase.caseNumber }}
            </span>
            <span class="px-3 py-1 rounded-md bg-crime-800 text-gray-300 text-xs font-medium">
              Tingkat Kesulitan: <strong class="text-amber-400">{{ activeCase.difficulty }}</strong>
            </span>
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-wide mb-4">
            {{ activeCase.title }}
          </h2>
          <p class="text-gray-300 text-base md:text-lg leading-relaxed border-l-4 border-red-600 pl-4 py-1 bg-red-950/20 rounded-r-xl">
            {{ activeCase.description }}
          </p>
        </div>

        <!-- Metadata Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-crime-950/70 p-4 rounded-xl border border-crime-800">
            <span class="text-xs font-mono text-gray-400 block mb-1">📍 Location</span>
            <span class="text-sm font-semibold text-gray-200">{{ activeCase.location }}</span>
          </div>
          <div class="bg-crime-950/70 p-4 rounded-xl border border-crime-800">
            <span class="text-xs font-mono text-gray-400 block mb-1">⏰ Estimated Time</span>
            <span class="text-sm font-semibold text-gray-200">{{ activeCase.time }}</span>
          </div>
          <div class="bg-crime-950/70 p-4 rounded-xl border border-crime-800">
            <span class="text-xs font-mono text-gray-400 block mb-1">👥 Suspects</span>
            <span class="text-sm font-semibold text-gray-200">{{ activeCase.suspects.length }} Orang Terduga</span>
          </div>
        </div>

        <!-- Objective & Initial Intel -->
        <div class="space-y-6 mb-10">
          <div>
            <h3 class="text-sm font-mono uppercase tracking-wider text-red-400 font-bold mb-2 flex items-center gap-2">
              <span>🎯</span> Objective
            </h3>
            <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-gray-300 text-sm leading-relaxed">
              {{ activeCase.objective }}
            </div>
          </div>

          <div>
            <h3 class="text-sm font-mono uppercase tracking-wider text-blue-400 font-bold mb-2 flex items-center gap-2">
              <span>ℹ️</span> Initial Information
            </h3>
            <div class="bg-crime-950 p-4 rounded-xl border border-crime-800 text-gray-400 text-sm leading-relaxed">
              {{ activeCase.initialInfo }}
            </div>
          </div>
        </div>

        <!-- Start CTA -->
        <div class="pt-6 border-t border-crime-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-gray-400 font-mono">
            Pastikan perangkat Anda mendukung mode rotasi 360° interaktif.
          </div>

          <button
            @click="handleStartInvestigation"
            class="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-xl shadow-red-950/80 transition transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            <span>🚨</span>
            <span>Start Investigation</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
