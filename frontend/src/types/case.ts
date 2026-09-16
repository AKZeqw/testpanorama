import type { Scene } from './scene'
import type { Evidence } from './evidence'
import type { Suspect } from './suspect'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type CaseStatus = 'Available' | 'In Progress' | 'Completed' | 'Draft' | 'Published'


export interface Case {
  id: string
  caseNumber: string
  title: string
  description: string
  difficulty: Difficulty
  location: string
  time: string
  objective: string
  initialInfo: string
  status: CaseStatus
  coverImage?: string
  initialSceneId: string
  scenes: Scene[]
  evidences: Evidence[]
  suspects: Suspect[]
  solution: {
    correctSuspectId: string
    keyEvidenceIds: string[]
    explanationKeywords: string[]
  }
}
