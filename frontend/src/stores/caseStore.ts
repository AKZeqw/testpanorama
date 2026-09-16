import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Case } from '../types/case'
import type { Scene, Hotspot } from '../types/scene'
import { dummyCases } from '../data/dummyCase'

const STORAGE_KEY = 'crime_investigation_cases_v1'

function loadStoredCases(): Case[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Gagal membaca cases dari localStorage:', err)
  }
  return dummyCases
}

export const useCaseStore = defineStore('case', () => {
  const cases = ref<Case[]>(loadStoredCases())
  const currentCaseId = ref<string>('case-001')
  const currentSceneId = ref<string>('laboratory')

  // Auto persist to localStorage
  watch(cases, (newCases) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCases))
    } catch (err) {
      console.warn('Gagal menyimpan cases ke localStorage:', err)
    }
  }, { deep: true })

  const currentCase = computed<Case>(() => {
    return cases.value.find(c => c.id === currentCaseId.value) || cases.value[0]
  })

  const scenes = computed<Scene[]>(() => {
    return currentCase.value?.scenes || []
  })

  const currentScene = computed<Scene>(() => {
    const scene = scenes.value.find(s => s.id === currentSceneId.value)
    return scene || scenes.value[0]
  })

  const evidences = computed(() => {
    return currentCase.value?.evidences || []
  })

  const suspects = computed(() => {
    return currentCase.value?.suspects || []
  })

  function loadCase(id: string) {
    const found = cases.value.find(c => c.id === id)
    if (found) {
      currentCaseId.value = found.id
      currentSceneId.value = found.initialSceneId || found.scenes[0]?.id || ''
    }
  }

  function changeScene(sceneId: string) {
    const found = scenes.value.find(s => s.id === sceneId)
    if (found) {
      currentSceneId.value = found.id
    }
  }

  // --- CRUD CASE ---
  function addCase(newCase: Case) {
    cases.value.push(newCase)
    currentCaseId.value = newCase.id
    currentSceneId.value = newCase.initialSceneId || newCase.scenes[0]?.id || ''
  }

  function updateCase(id: string, updated: Partial<Case>) {
    const idx = cases.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      cases.value[idx] = {
        ...cases.value[idx],
        ...updated
      }
    }
  }

  function deleteCase(id: string) {
    cases.value = cases.value.filter(c => c.id !== id)
    if (currentCaseId.value === id && cases.value.length > 0) {
      currentCaseId.value = cases.value[0].id
      currentSceneId.value = cases.value[0].initialSceneId
    }
  }

  function togglePublishCase(id: string) {
    const target = cases.value.find(c => c.id === id)
    if (target) {
      target.status = target.status === 'Available' ? 'Draft' : 'Available'
    }
  }

  // --- CRUD SCENE ---
  function addScene(caseId: string, newScene: Scene) {
    const targetCase = cases.value.find(c => c.id === caseId)
    if (targetCase) {
      targetCase.scenes.push(newScene)
      if (!targetCase.initialSceneId) {
        targetCase.initialSceneId = newScene.id
      }
    }
  }

  function updateScene(caseId: string, sceneId: string, updated: Partial<Scene>) {
    const targetCase = cases.value.find(c => c.id === caseId)
    if (targetCase) {
      const idx = targetCase.scenes.findIndex(s => s.id === sceneId)
      if (idx !== -1) {
        targetCase.scenes[idx] = {
          ...targetCase.scenes[idx],
          ...updated
        }
      }
    }
  }

  function deleteScene(caseId: string, sceneId: string) {
    const targetCase = cases.value.find(c => c.id === caseId)
    if (targetCase) {
      targetCase.scenes = targetCase.scenes.filter(s => s.id !== sceneId)
      if (targetCase.initialSceneId === sceneId && targetCase.scenes.length > 0) {
        targetCase.initialSceneId = targetCase.scenes[0].id
      }
    }
  }

  // --- CRUD HOTSPOT ---
  function addHotspot(caseId: string, sceneId: string, hotspot: Hotspot) {
    const targetCase = cases.value.find(c => c.id === caseId)
    if (targetCase) {
      const scene = targetCase.scenes.find(s => s.id === sceneId)
      if (scene) {
        if (!scene.hotspots) scene.hotspots = []
        scene.hotspots.push(hotspot)
      }
    }
  }

  function updateHotspot(caseId: string, sceneId: string, hotspotId: string, updated: Partial<Hotspot>) {
    const targetCase = cases.value.find(c => c.id === caseId)
    if (targetCase) {
      const scene = targetCase.scenes.find(s => s.id === sceneId)
      if (scene && scene.hotspots) {
        const idx = scene.hotspots.findIndex(h => h.id === hotspotId)
        if (idx !== -1) {
          scene.hotspots[idx] = {
            ...scene.hotspots[idx],
            ...updated
          }
        }
      }
    }
  }

  function deleteHotspot(caseId: string, sceneId: string, hotspotId: string) {
    const targetCase = cases.value.find(c => c.id === caseId)
    if (targetCase) {
      const scene = targetCase.scenes.find(s => s.id === sceneId)
      if (scene && scene.hotspots) {
        scene.hotspots = scene.hotspots.filter(h => h.id !== hotspotId)
      }
    }
  }

  function resetToDefault() {
    cases.value = JSON.parse(JSON.stringify(dummyCases))
    currentCaseId.value = 'case-001'
    currentSceneId.value = 'laboratory'
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    cases,
    currentCaseId,
    currentSceneId,
    currentCase,
    scenes,
    currentScene,
    evidences,
    suspects,
    loadCase,
    changeScene,
    addCase,
    updateCase,
    deleteCase,
    togglePublishCase,
    addScene,
    updateScene,
    deleteScene,
    addHotspot,
    updateHotspot,
    deleteHotspot,
    resetToDefault
  }
})

