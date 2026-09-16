<script setup lang="ts">
import { ref } from 'vue'
import PanoramaViewer from '../components/PanoramaViewer.vue'
import { caseData } from '../data/cases'

const currentSceneIndex = ref(0)
const currentScene = ref(caseData.scenes[currentSceneIndex.value])
const panorama = ref(currentScene.value.panorama)
const collectedEvidences = ref<string[]>([])
const isInvestigating = ref(false)

const startInvestigation = () => {
  isInvestigating.value = true
}
</script>

<template>
  <div class="investigation-page">
    <header class="topbar">
      <div class="case-info">
        <h1>Crime Investigation</h1>
        <p>Case #00{{ caseData.id }} — {{ caseData.title }}</p>
      </div>

      <div class="header-actions">
        <span class="scene-badge">{{ currentScene.name }}</span>
        <button class="evidence-button">
          🔍 Evidence ({{ collectedEvidences.length }})
        </button>
      </div>
    </header>

    <main class="main-content">
      <section class="panorama-section">
        <PanoramaViewer :panorama="panorama" />
      </section>

      <aside class="case-panel">
        <div class="panel-section">
          <h2>Case Brief</h2>
          <p>{{ caseData.description }}</p>
        </div>

        <hr class="divider" />

        <div class="panel-section">
          <h3>Objective</h3>
          <p>
            Cari petunjuk di sekitar lokasi kejadian dan kumpulkan
            bukti yang dapat membantu penyelidikan.
          </p>
        </div>

        <div class="panel-section evidence-status" v-if="currentScene.evidences?.length">
          <h4>Target Petunjuk di Lokasi:</h4>
          <ul class="clue-list">
            <li v-for="item in currentScene.evidences" :key="item.id" class="clue-item">
              <span class="clue-bullet">◈</span>
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>

        <button
          class="investigate-button"
          :class="{ active: isInvestigating }"
          @click="startInvestigation"
        >
          {{ isInvestigating ? '● Investigasi Berlangsung' : 'Mulai Investigasi' }}
        </button>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.investigation-page {
  min-height: 100vh;
  background: #0f1115;
  color: #f1f3f5;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #14171d;
  border-bottom: 1px solid #232832;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  z-index: 10;
}

.case-info h1 {
  margin: 0;
  font-size: 20px;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: #ffffff;
}

.case-info p {
  margin: 4px 0 0;
  color: #9aa0a6;
  font-size: 13px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scene-badge {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid #323846;
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.evidence-button {
  background: #1a202c;
  color: #f8fafc;
  border: 1px solid #3b4252;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.evidence-button:hover {
  background: #27303f;
  border-color: #4c566a;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  height: calc(100vh - 75px);
  overflow: hidden;
}

.panorama-section {
  min-width: 0;
  height: 100%;
  position: relative;
  background: #000;
}

.case-panel {
  padding: 24px;
  background: #14171d;
  border-left: 1px solid #232832;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-section h2 {
  margin-top: 0;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.panel-section h3 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #e2e8f0;
}

.panel-section h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.panel-section p {
  color: #94a3b8;
  line-height: 1.6;
  font-size: 14px;
  margin: 0;
}

.divider {
  border: none;
  border-top: 1px solid #242b38;
  margin: 20px 0;
}

.evidence-status {
  margin-top: 15px;
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #232832;
}

.clue-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.clue-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #cbd5e1;
}

.clue-bullet {
  color: #ef4444;
  font-size: 10px;
}

.investigate-button {
  width: 100%;
  margin-top: auto;
  padding: 13px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #991b1b, #7f1d1d);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(185, 28, 28, 0.3);
  transition: all 0.2s ease;
}

.investigate-button:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  box-shadow: 0 6px 16px rgba(185, 28, 28, 0.4);
}

.investigate-button.active {
  background: linear-gradient(135deg, #065f46, #047857);
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3);
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    height: auto;
  }
  .case-panel {
    border-left: none;
    border-top: 1px solid #232832;
  }
}
</style>
