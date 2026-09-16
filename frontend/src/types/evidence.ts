export type EvidenceImportance = 'Critical' | 'Supporting' | 'Circumstantial'

export interface Evidence {
  id: string
  name: string
  description: string
  detailedAnalysis?: string
  discoveredSceneId: string
  discoveredSceneName: string
  imagePath?: string
  importance: EvidenceImportance
  relatedSuspectIds?: string[]
  relatedEvidenceIds?: string[]
}
