<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'

const router = useRouter()
const caseStore = useCaseStore()

const cases = computed(() => caseStore.cases)
const totalScenes = computed(() => cases.value.reduce((acc, c) => acc + (c.scenes?.length || 0), 0))
const totalEvidences = computed(() => cases.value.reduce((acc, c) => acc + (c.evidences?.length || 0), 0))
const totalSuspects = computed(() => cases.value.reduce((acc, c) => acc + (c.suspects?.length || 0), 0))
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 p-6 md:p-10 flex flex-col">
    <div class="max-w-6xl mx-auto w-full space-y-8">
      <!-- Admin Header -->
      <div class="flex items-center justify-between pb-6 border-b border-crime-800">
        <div>
          <div class="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
            Portal Pengajar & Administrator
          </div>
          <h1 class="text-2xl md:text-3xl font-black text-white tracking-wide">
            Dashboard Dosen / Admin
          </h1>
          <p class="text-xs text-gray-400 mt-1">
            Kelola skenario kasus kriminal, ruangan panorama 360°, dan koordinat hotspot barang bukti.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="router.push('/')"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-crime-850 hover:bg-crime-800 border border-crime-700 text-gray-300 transition"
          >
            ← Kembali ke Game
          </button>
          <router-link
            to="/admin/cases/create"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-950 flex items-center gap-1.5 transition"
          >
            <span>+</span> Buat Kasus Baru
          </router-link>
        </div>
      </div>

      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-crime-900 border border-crime-800 rounded-2xl p-5 shadow-lg">
          <span class="text-[11px] font-mono text-gray-400 uppercase">Total Skenario Kasus</span>
          <div class="text-3xl font-black text-white mt-1">{{ cases.length }}</div>
          <span class="text-[10px] text-emerald-400 font-mono mt-2 block">
            ● {{ cases.filter(c => c.status === 'Available').length }} Published
          </span>
        </div>

        <div class="bg-crime-900 border border-crime-800 rounded-2xl p-5 shadow-lg">
          <span class="text-[11px] font-mono text-gray-400 uppercase">Ruangan 360° (Scenes)</span>
          <div class="text-3xl font-black text-blue-400 mt-1">{{ totalScenes }}</div>
          <span class="text-[10px] text-gray-400 font-mono mt-2 block">Lokasi TKP Virtual</span>
        </div>

        <div class="bg-crime-900 border border-crime-800 rounded-2xl p-5 shadow-lg">
          <span class="text-[11px] font-mono text-gray-400 uppercase">Barang Bukti (Hotspot)</span>
          <div class="text-3xl font-black text-amber-400 mt-1">{{ totalEvidences }}</div>
          <span class="text-[10px] text-gray-400 font-mono mt-2 block">Objek Teridentifikasi</span>
        </div>

        <div class="bg-crime-900 border border-crime-800 rounded-2xl p-5 shadow-lg">
          <span class="text-[11px] font-mono text-gray-400 uppercase">Profil Tersangka</span>
          <div class="text-3xl font-black text-purple-400 mt-1">{{ totalSuspects }}</div>
          <span class="text-[10px] text-gray-400 font-mono mt-2 block">Kandidat Pelaku</span>
        </div>
      </div>

      <!-- Quick Action Panels -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Panel 1: Case Management -->
        <div class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-lg mb-3">
              📁
            </div>
            <h3 class="text-lg font-bold text-white mb-1">Kelola Kasus Investigasi</h3>
            <p class="text-xs text-gray-400 leading-relaxed mb-6">
              Buat skenario baru, ubah deskripsi kejadian, target objektif, tingkat kesulitan, serta status publikasi.
            </p>
          </div>
          <router-link
            to="/admin/cases"
            class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-crime-800 hover:bg-crime-700 border border-crime-700 text-center text-white transition flex items-center justify-center gap-2"
          >
            <span>Buka Manajemen Kasus</span>
            <span>→</span>
          </router-link>
        </div>

        <!-- Panel 2: Scene & Hotspot 360 Editor -->
        <div class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-lg mb-3">
              🌐
            </div>
            <h3 class="text-lg font-bold text-white mb-1">Editor Ruangan & Hotspot 360°</h3>
            <p class="text-xs text-gray-400 leading-relaxed mb-6">
              Atur posisi hotspot secara interaktif dengan mengklik panorama equirectangular untuk menangkap koordinat yaw dan pitch.
            </p>
          </div>
          <router-link
            :to="cases.length > 0 ? `/admin/cases/${cases[0].id}/scenes` : '/admin/cases'"
            class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-900/70 hover:bg-blue-800 border border-blue-700 text-center text-blue-100 transition flex items-center justify-center gap-2"
          >
            <span>Buka Hotspot Editor (Kasus #001)</span>
            <span>→</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Cases Table Summary -->
      <div class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-gray-200 font-mono">
            Ringkasan Kasus Terdaftar
          </h2>
          <router-link
            to="/admin/cases"
            class="text-xs text-red-400 hover:underline font-mono"
          >
            Lihat Semua Kasus →
          </router-link>
        </div>

        <div class="divide-y divide-crime-800">
          <div
            v-for="c in cases.slice(0, 3)"
            :key="c.id"
            class="py-3 flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-red-400">{{ c.caseNumber }}</span>
                <span class="text-xs font-bold text-white">{{ c.title }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {{ c.status }}
                </span>
              </div>
              <p class="text-[11px] text-gray-400 mt-0.5">
                {{ c.scenes?.length || 0 }} Scene • {{ c.evidences?.length || 0 }} Bukti • {{ c.location }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <router-link
                :to="`/admin/cases/${c.id}/scenes`"
                class="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-900/50 hover:bg-blue-800 text-blue-200 border border-blue-800 transition"
              >
                Hotspot Editor
              </router-link>
              <router-link
                :to="`/admin/cases/${c.id}/edit`"
                class="px-3 py-1 rounded-lg text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-200 transition"
              >
                Edit
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

