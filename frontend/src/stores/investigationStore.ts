import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCaseStore } from './caseStore'

export interface InvestigationResult {
  score: number
  totalEvidences: number
  foundEvidencesCount: number
  isSuspectCorrect: boolean
  isExplanationValid: boolean
  formattedTime: string
  selectedSuspectName: string
  supportingEvidencesCount: number
}

export const useInvestigationStore = defineStore('investigation', () => {
  const caseStore = useCaseStore()

  const discoveredEvidenceIds = ref<string[]>([])
  const notes = ref<string[]>([
    'Jam 22:10 listrik sempat padam selama 5 menit.',
    'Pintu luar gedung tidak ada bekas congkelan.'
  ])

  // Timer
  const secondsElapsed = ref<number>(0)
  const isTimerRunning = ref<boolean>(false)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  // Conclusion
  const selectedSuspectId = ref<string | null>(null)
  const conclusionExplanation = ref<string>('')
  const supportingEvidenceIds = ref<string[]>([])
  const result = ref<InvestigationResult | null>(null)

  const discoveredEvidences = computed(() => {
    return caseStore.evidences.filter(e => discoveredEvidenceIds.value.includes(e.id))
  })

  const evidenceCount = computed(() => discoveredEvidenceIds.value.length)
  const totalEvidenceCount = computed(() => caseStore.evidences.length)

  const formattedTime = computed(() => {
    const mins = Math.floor(secondsElapsed.value / 60)
    const secs = secondsElapsed.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  function startTimer() {
    if (isTimerRunning.value) return
    isTimerRunning.value = true
    timerInterval = setInterval(() => {
      secondsElapsed.value++
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    isTimerRunning.value = false
  }

  function addEvidence(id: string): boolean {
    if (!discoveredEvidenceIds.value.includes(id)) {
      discoveredEvidenceIds.value.push(id)
      return true
    }
    return false
  }

  function isEvidenceDiscovered(id: string): boolean {
    return discoveredEvidenceIds.value.includes(id)
  }

  function addNote(text: string) {
    if (text.trim()) {
      notes.value.unshift(text.trim())
    }
  }

  function deleteNote(index: number) {
    notes.value.splice(index, 1)
  }

  function submitConclusion(suspectId: string, explanation: string, evidenceIds: string[]): InvestigationResult {
    stopTimer()
    selectedSuspectId.value = suspectId
    conclusionExplanation.value = explanation
    supportingEvidenceIds.value = evidenceIds

    const currentCase = caseStore.currentCase
    const isSuspectCorrect = suspectId === currentCase.solution.correctSuspectId

    // Cek kata kunci dalam penjelasan
    const lowerExp = explanation.toLowerCase()
    const matches = currentCase.solution.explanationKeywords.filter(k => lowerExp.includes(k.toLowerCase()))
    const isExplanationValid = matches.length >= 2 || explanation.length > 30

    // Hitung score
    let score = 0
    // Bukti ditemukan (maksimal 40 poin)
    const evidencePcnt = discoveredEvidenceIds.value.length / (totalEvidenceCount.value || 1)
    score += Math.round(evidencePcnt * 40)

    // Tersangka tepat (40 poin)
    if (isSuspectCorrect) {
      score += 40
    }

    // Bukti pendukung tepat (maksimal 10 poin)
    const correctEvIds = currentCase.solution.keyEvidenceIds
    const matchedEvs = evidenceIds.filter(id => correctEvIds.includes(id))
    score += Math.round((matchedEvs.length / (correctEvIds.length || 1)) * 10)

    // Bonus penjelasan logis (10 poin)
    if (isExplanationValid) {
      score += 10
    }

    const suspectObj = caseStore.suspects.find(s => s.id === suspectId)

    const res: InvestigationResult = {
      score: Math.min(100, score),
      totalEvidences: totalEvidenceCount.value,
      foundEvidencesCount: discoveredEvidenceIds.value.length,
      isSuspectCorrect,
      isExplanationValid,
      formattedTime: formattedTime.value,
      selectedSuspectName: suspectObj?.name || 'Belum dipilih',
      supportingEvidencesCount: evidenceIds.length
    }

    result.value = res
    return res
  }

  function resetInvestigation() {
    stopTimer()
    secondsElapsed.value = 0
    discoveredEvidenceIds.value = []
    selectedSuspectId.value = null
    conclusionExplanation.value = ''
    supportingEvidenceIds.value = []
    result.value = null
  }

  return {
    discoveredEvidenceIds,
    notes,
    secondsElapsed,
    isTimerRunning,
    selectedSuspectId,
    conclusionExplanation,
    supportingEvidenceIds,
    result,
    discoveredEvidences,
    evidenceCount,
    totalEvidenceCount,
    formattedTime,
    startTimer,
    stopTimer,
    addEvidence,
    isEvidenceDiscovered,
    addNote,
    deleteNote,
    submitConclusion,
    resetInvestigation
  }
})
