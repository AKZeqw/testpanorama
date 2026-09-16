<script setup lang="ts">
import { useInvestigationStore } from '@/stores/investigationStore'

const investigationStore = useInvestigationStore()
</script>

<template>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-crime-900/90 border border-crime-700/60 shadow-inner">
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
    <span class="text-xs uppercase tracking-wider text-gray-400 font-medium">Timer</span>
    <span class="font-mono text-sm font-bold text-red-400 tracking-wider">
      {{ investigationStore.formattedTime }}
    </span>
  </div>
</template>
