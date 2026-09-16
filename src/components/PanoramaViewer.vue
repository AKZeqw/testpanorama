<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'

const props = defineProps<{
  panorama: string
}>()

const viewerContainer = ref<HTMLElement | null>(null)

let viewer: Viewer | null = null

onMounted(() => {
  if (!viewerContainer.value) return

  viewer = new Viewer({
    container: viewerContainer.value,
    panorama: props.panorama,
    navbar: [
      'zoom',
      'move',
      'fullscreen'
    ],
    defaultZoomLvl: 50,
  })
})

watch(() => props.panorama, (newPanorama) => {
  if (viewer && newPanorama) {
    viewer.setPanorama(newPanorama)
  }
})

onBeforeUnmount(() => {
  viewer?.destroy()
})
</script>

<template>
  <div ref="viewerContainer" class="panorama-viewer"></div>
</template>

<style scoped>
.panorama-viewer {
  width: 100%;
  height: 100%;
  min-height: 600px;
}
</style>
