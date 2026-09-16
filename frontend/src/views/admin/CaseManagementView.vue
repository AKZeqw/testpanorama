<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'

const router = useRouter()
const caseStore = useCaseStore()

const searchQuery = ref('')
const selectedDifficulty = ref<string>('all')

const filteredCases = computed(() => {
  return caseStore.cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          c.caseNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDiff = selectedDifficulty.value === 'all' || c.difficulty === selectedDifficulty.value
    return matchesSearch && matchesDiff
  })
})

const publishedCount = computed(() => caseStore.cases.filter(c => c.status === 'Available').length)
const draftCount = computed(() => caseStore.cases.filter(c => c.status !== 'Available').length)

const handleDelete = (id: string, title: string) => {
  if (confirm(`Apakah Anda yakin ingin menghapus kasus "${title}"?`)) {
    caseStore.deleteCase(id)
  }
}

const handleReset = () => {
  if (confirm('Kembalikan seluruh data kasus ke pengaturan default awal?')) {
    caseStore.resetToDefault()
  }
}
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 flex flex-col">
    <!-- Admin Header -->
    <header class="h-20 border-b border-crime-800 bg-crime-900/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between z-20">
      <div class="flex items-center gap-3">
        <router-link
          to="/"
          class="p-2 rounded-xl bg-crime-800 hover:bg-crime-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5"
        >
          <span>←</span> Kembali ke Game
        </router-link>
        <div class="h-6 w-px bg-crime-800 hidden sm:block"></div>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">
            Lecturer & Admin Portal
          </div>
          <h1 class="text-base md:text-lg font-black text-white">
            Manajemen Kasus Investigasi
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="handleReset"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-crime-800/80 hover:bg-crime-700 text-gray-400 border border-crime-700 transition"
          title="Reset ke kasus default"
        >
          🔄 Reset Default
        </button>
        <router-link
          to="/admin/cases/create"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-950 flex items-center gap-2 transition"
        >
          <span>+</span> Buat Kasus Baru
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
      <!-- Stats Overview Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-crime-900 border border-crime-800 shadow-md">
          <span class="text-[11px] font-mono text-gray-400 uppercase">Total Kasus</span>
          <div class="text-2xl font-black text-white mt-1">{{ caseStore.cases.length }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-crime-900 border border-crime-800 shadow-md">
          <span class="text-[11px] font-mono text-emerald-400 uppercase">Dipublikasikan</span>
          <div class="text-2xl font-black text-emerald-400 mt-1">{{ publishedCount }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-crime-900 border border-crime-800 shadow-md">
          <span class="text-[11px] font-mono text-amber-400 uppercase">Draft</span>
          <div class="text-2xl font-black text-amber-400 mt-1">{{ draftCount }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-crime-900 border border-crime-800 shadow-md">
          <span class="text-[11px] font-mono text-blue-400 uppercase">Total Ruangan (Scene)</span>
          <div class="text-2xl font-black text-blue-400 mt-1">
            {{ caseStore.cases.reduce((acc, c) => acc + (c.scenes?.length || 0), 0) }}
          </div>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="bg-crime-900/90 border border-crime-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        <div class="w-full md:w-80 relative">
          <span class="absolute left-3.5 top-2.5 text-gray-500 text-xs">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul, nomor kasus, lokasi..."
            class="w-full pl-9 pr-4 py-2 bg-crime-950 border border-crime-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto justify-end">
          <span class="text-xs text-gray-400">Tingkat Kesulitan:</span>
          <select
            v-model="selectedDifficulty"
            class="bg-crime-950 border border-crime-700 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-red-500"
          >
            <option value="all">Semua</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <!-- Case List -->
      <div class="space-y-4">
        <div
          v-for="c in filteredCases"
          :key="c.id"
          class="bg-crime-900 border border-crime-700/80 hover:border-crime-600 rounded-2xl p-5 shadow-xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
        >
          <!-- Left Info -->
          <div class="flex items-start gap-4 flex-1">
            <div class="w-20 h-20 rounded-xl bg-crime-950 overflow-hidden border border-crime-800 flex-shrink-0 relative">
              <img
                :src="c.coverImage || '/panoramas/laboratory.jpg'"
                :alt="c.title"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800">
                  {{ c.caseNumber }}
                </span>
                <h3 class="text-base font-bold text-white">{{ c.title }}</h3>
                <button
                  @click="caseStore.togglePublishCase(c.id)"
                  :class="[
                    'text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider transition border',
                    c.status === 'Available'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                      : 'bg-amber-950 text-amber-400 border-amber-800 hover:bg-amber-900'
                  ]"
                >
                  {{ c.status === 'Available' ? '● Published' : '○ Draft' }}
                </button>
                <span class="text-[10px] px-2 py-0.5 rounded bg-crime-800 text-gray-300 border border-crime-700">
                  {{ c.difficulty }}
                </span>
              </div>

              <p class="text-xs text-gray-400 line-clamp-2">{{ c.description }}</p>

              <div class="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono pt-1">
                <span class="flex items-center gap-1">
                  <span>📍</span> {{ c.location }}
                </span>
                <span class="flex items-center gap-1">
                  <span>🚪</span> {{ c.scenes?.length || 0 }} Ruangan
                </span>
                <span class="flex items-center gap-1">
                  <span>🔎</span> {{ c.evidences?.length || 0 }} Bukti
                </span>
                <span class="flex items-center gap-1">
                  <span>👥</span> {{ c.suspects?.length || 0 }} Tersangka
                </span>
              </div>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex flex-wrap items-center gap-2 self-end md:self-center">
            <button
              @click="router.push(`/cases/${c.id}`)"
              class="px-3 py-2 rounded-xl text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-200 border border-crime-700 transition flex items-center gap-1"
            >
              <span>🎮</span> Tes Main
            </button>

            <router-link
              :to="`/admin/cases/${c.id}/scenes`"
              class="px-3 py-2 rounded-xl text-xs font-bold bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 transition flex items-center gap-1.5"
            >
              <span>🌐</span> Kelola Ruangan 360°
            </router-link>

            <router-link
              :to="`/admin/cases/${c.id}/edit`"
              class="px-3 py-2 rounded-xl text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-200 border border-crime-700 transition"
            >
              Edit Detail
            </router-link>

            <button
              @click="handleDelete(c.id, c.title)"
              class="px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900 transition"
            >
              Hapus
            </button>
          </div>
        </div>

        <div v-if="filteredCases.length === 0" class="p-12 text-center bg-crime-900/40 rounded-2xl border border-crime-800 text-gray-500 text-sm">
          Tidak ada kasus yang cocok dengan pencarian Anda.
        </div>
      </div>
    </main>
  </div>
</template>
