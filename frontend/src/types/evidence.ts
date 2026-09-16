export type EvidenceImportance = 'Critical' | 'Supporting' | 'Circumstantial' | 'Decoy' | 'Irrelevant'
export type EvidenceCategory = 'Digital' | 'Fisik' | 'Biometrik' | 'Dokumen' | 'Lainnya'

export interface Evidence {
  id: string
  name: string
  description: string
  detailedAnalysis?: string
  discoveredSceneId: string
  discoveredSceneName: string
  imagePath?: string
  importance: EvidenceImportance
  category?: EvidenceCategory | string
  isRedHerring?: boolean
  relatedSuspectIds?: string[]
  relatedEvidenceIds?: string[]
}

