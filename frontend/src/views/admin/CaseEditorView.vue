<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCaseStore } from '@/stores/caseStore'
import type { Case } from '@/types/case'

const route = useRoute()
const router = useRouter()
const caseStore = useCaseStore()

const isEditMode = computed(() => !!route.params.id && route.params.id !== 'create')
const caseId = computed(() => route.params.id as string)

const formData = ref<Partial<Case>>({
  caseNumber: `Case #${(caseStore.cases.length + 1).toString().padStart(3, '0')}`,
  title: '',
  description: '',
  difficulty: 'Medium',
  location: '',
  time: '21:30 WIB',
  objective: '',
  initialInfo: '',
  status: 'Draft',
  coverImage: '/panoramas/laboratory.jpg',
  scenes: [],
  evidences: [],
  suspects: [],
  solution: {
    correctSuspectId: '',
    keyEvidenceIds: [],
    explanationKeywords: []
  }
})

const keywordsInput = ref('')

onMounted(() => {
  if (isEditMode.value) {
    const existing = caseStore.cases.find(c => c.id === caseId.value)
    if (existing) {
      formData.value = JSON.parse(JSON.stringify(existing))
      keywordsInput.value = (existing.solution?.explanationKeywords || []).join(', ')
    } else {
      router.push('/admin/cases')
    }
  }
})

const handleSave = () => {
  if (!formData.value.title?.trim()) {
    alert('Judul kasus wajib diisi!')
    return
  }

  // Parse keywords
  const kws = keywordsInput.value
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)

  if (isEditMode.value) {
    caseStore.updateCase(caseId.value, {
      ...formData.value,
      solution: {
        ...(formData.value.solution || { correctSuspectId: '', keyEvidenceIds: [] }),
        explanationKeywords: kws
      }
    })
    alert('Kasus berhasil diperbarui!')
    router.push('/admin/cases')
  } else {
    const newId = `case-${Date.now().toString().slice(-4)}`
    const defaultInitialScene = {
      id: `scene-${newId}-main`,
      name: 'TKP Utama',
      description: 'Area investigasi utama kasus kriminal.',
      panoramaPath: '/panoramas/laboratory.jpg',
      orderIndex: 1,
      hotspots: []
    }

    const createdCase: Case = {
      id: newId,
      caseNumber: formData.value.caseNumber || `Case #${newId}`,
      title: formData.value.title || 'Untitled Case',
      description: formData.value.description || '',
      difficulty: formData.value.difficulty || 'Medium',
      location: formData.value.location || 'Laboratorium Forensik',
      time: formData.value.time || '22:00 WIB',
      objective: formData.value.objective || 'Selidiki bukti dan temukan pelaku.',
      initialInfo: formData.value.initialInfo || 'Informasi awal sedang diverifikasi.',
      status: formData.value.status || 'Draft',
      coverImage: formData.value.coverImage || '/panoramas/laboratory.jpg',
      initialSceneId: defaultInitialScene.id,
      scenes: [defaultInitialScene],
      evidences: [],
      suspects: [],
      solution: {
        correctSuspectId: '',
        keyEvidenceIds: [],
        explanationKeywords: kws
      }
    }

    caseStore.addCase(createdCase)
    alert('Kasus baru berhasil dibuat! Anda dapat mulai mengelola ruangan 360°.')
    router.push(`/admin/cases/${newId}/scenes`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-crime-950 text-gray-100 flex flex-col">
    <!-- Header -->
    <header class="h-20 border-b border-crime-800 bg-crime-900/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between z-20">
      <div class="flex items-center gap-3">
        <router-link
          to="/admin/cases"
          class="p-2 rounded-xl bg-crime-800 hover:bg-crime-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5"
        >
          <span>←</span> Daftar Kasus
        </router-link>
        <div class="h-6 w-px bg-crime-800 hidden sm:block"></div>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">
            Case Editor
          </div>
          <h1 class="text-base md:text-lg font-black text-white">
            {{ isEditMode ? 'Edit Kasus Investigasi' : 'Buat Kasus Investigasi Baru' }}
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="handleSave"
          class="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-950 flex items-center gap-2 transition"
        >
          <span>💾</span> Simpan Kasus
        </button>
      </div>
    </header>

    <!-- Main Form Content -->
    <main class="max-w-4xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
      <div class="bg-crime-900 border border-crime-700/80 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <!-- Section: Basic Information -->
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wider text-red-400 font-mono mb-4 flex items-center gap-2">
            <span>📋</span> Informasi Dasar Kasus
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Nomor Kasus / Kode</label>
              <input
                v-model="formData.caseNumber"
                type="text"
                placeholder="Misal: Case #002"
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Tingkat Kesulitan</label>
              <select
                v-model="formData.difficulty"
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Easy">Easy (Mudah)</option>
                <option value="Medium">Medium (Sedang)</option>
                <option value="Hard">Hard (Sulit)</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Judul Kasus *</label>
              <input
                v-model="formData.title"
                type="text"
                placeholder="Misal: The Stolen Formula"
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Ringkasan Kejadian / Deskripsi</label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="Ceritakan latar belakang kasus dan insiden yang terjadi..."
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="h-px bg-crime-800"></div>

        <!-- Section: Incident Details -->
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wider text-blue-400 font-mono mb-4 flex items-center gap-2">
            <span>📍</span> Lokasi & Waktu Perkara
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Lokasi TKP</label>
              <input
                v-model="formData.location"
                type="text"
                placeholder="Misal: Research Facility Floor 4"
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Waktu Kejadian</label>
              <input
                v-model="formData.time"
                type="text"
                placeholder="Misal: 23:45 WIB"
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Target Objektif Investigasi</label>
              <textarea
                v-model="formData.objective"
                rows="2"
                placeholder="Misal: Temukan barang bukti yang menjelaskan pelaku penerobos laboratorium..."
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Informasi Awal Saksi / Polisi (Initial Info)</label>
              <textarea
                v-model="formData.initialInfo"
                rows="2"
                placeholder="Misal: Saksi melihat bayangan bergegas keluar dari pintu darurat..."
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="h-px bg-crime-800"></div>

        <!-- Section: Solution & Scoring Configuration -->
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono mb-4 flex items-center gap-2">
            <span>⚖️</span> Konfigurasi Kunci Solusi & Penilaian
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                Kata Kunci Kesimpulan (Dipisah koma)
              </label>
              <input
                v-model="keywordsInput"
                type="text"
                placeholder="misal: kartu, akses, andi, laptop, brankas"
                class="w-full bg-crime-950 border border-crime-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono"
              />
              <p class="text-[11px] text-gray-400 mt-1">
                Sistem akan memvalidasi analisis mahasiswa berdasarkan keberadaan kata kunci ini.
              </p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <label class="text-xs font-semibold text-gray-300">Status Publikasi:</label>
              <button
                type="button"
                @click="formData.status = formData.status === 'Available' ? 'Draft' : 'Available'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold border transition',
                  formData.status === 'Available'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                ]"
              >
                {{ formData.status === 'Available' ? '● Published (Bisa Dimainkan)' : '○ Draft (Hanya Dosen)' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-6 border-t border-crime-800 flex items-center justify-between">
          <router-link
            to="/admin/cases"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-300 transition"
          >
            Batal
          </router-link>

          <button
            @click="handleSave"
            class="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-950 flex items-center gap-2 transition"
          >
            <span>💾</span> Simpan Kasus
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
