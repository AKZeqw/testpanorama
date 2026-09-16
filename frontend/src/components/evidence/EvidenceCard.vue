<script setup lang="ts">
import type { Evidence } from '@/types/evidence'

defineProps<{
  evidence: Evidence
  isDiscovered?: boolean
}>()

const emit = defineEmits<{
  (e: 'inspect', evidence: Evidence): void
}>()
</script>

<template>
  <div
    class="group relative bg-crime-900 border border-crime-700/80 hover:border-red-600/70 rounded-xl p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
  >
    <div>
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">📁</span>
          <h4 class="font-bold text-gray-100 text-base group-hover:text-red-400 transition">
            {{ evidence.name }}
          </h4>
        </div>
        <span
          :class="[
            'text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider',
            evidence.importance === 'Critical'
              ? 'bg-red-950/90 text-red-400 border border-red-800'
              : 'bg-amber-950/90 text-amber-400 border border-amber-800'
          ]"
        >
          {{ evidence.importance }}
        </span>
      </div>

      <p class="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3">
        {{ evidence.description }}
      </p>

      <div class="text-[11px] text-gray-500 font-mono flex items-center gap-1.5 mb-4">
        <span>📍 Lokasi:</span>
        <span class="text-gray-300">{{ evidence.discoveredSceneName }}</span>
      </div>
    </div>

    <button
      @click="emit('inspect', evidence)"
      class="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-crime-800 hover:bg-crime-700 text-gray-200 border border-crime-700 hover:border-gray-500 transition flex items-center justify-center gap-1.5"
    >
      <span>🔎</span> Periksa Detail Bukti
    </button>
  </div>
</template>
