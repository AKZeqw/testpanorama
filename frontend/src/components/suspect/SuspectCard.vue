<script setup lang="ts">
import type { Suspect } from '@/types/suspect'

const props = defineProps<{
  suspect: Suspect
  isSelected?: boolean
  canSelect?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', suspectId: string): void
}>()
</script>

<template>
  <div
    :class="[
      'relative bg-crime-900 border rounded-2xl p-6 shadow-xl transition-all duration-200 flex flex-col justify-between',
      isSelected
        ? 'border-red-500 ring-2 ring-red-500/40 bg-crime-850'
        : 'border-crime-700/80 hover:border-gray-500'
    ]"
  >
    <div>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-crime-800 border border-crime-700 flex items-center justify-center text-2xl shadow-inner">
            👤
          </div>
          <div>
            <h4 class="font-bold text-lg text-white">
              {{ suspect.name }}
            </h4>
            <p class="text-xs text-red-400 font-mono font-medium">
              {{ suspect.role }}
            </p>
          </div>
        </div>

        <span
          v-if="isSelected"
          class="text-xs font-bold px-2.5 py-1 rounded-full bg-red-600 text-white uppercase tracking-wider shadow"
        >
          Tertuduh Utama
        </span>
      </div>

      <div class="space-y-3 text-xs mb-5">
        <div class="bg-crime-950/70 p-3 rounded-xl border border-crime-800/80">
          <div class="text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
            <span>🔑</span> Hak Akses:
          </div>
          <p class="text-gray-300 font-mono">{{ suspect.accessLevel }}</p>
        </div>

        <div class="bg-crime-950/70 p-3 rounded-xl border border-crime-800/80">
          <div class="text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
            <span>🛡️</span> Alibi:
          </div>
          <p class="text-gray-300 italic">{{ suspect.alibi }}</p>
        </div>

        <div>
          <div class="text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
            <span>📋</span> Profil:
          </div>
          <p class="text-gray-400 leading-relaxed">{{ suspect.description }}</p>
        </div>
      </div>
    </div>

    <button
      v-if="canSelect"
      @click="emit('select', suspect.id)"
      :class="[
        'w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all',
        isSelected
          ? 'bg-red-700 text-white shadow-lg shadow-red-900/40'
          : 'bg-crime-800 hover:bg-crime-700 text-gray-300 border border-crime-700'
      ]"
    >
      {{ isSelected ? '✓ Dipilih Sebagai Pelaku' : 'Pilih Sebagai Pelaku Utama' }}
    </button>
  </div>
</template>
