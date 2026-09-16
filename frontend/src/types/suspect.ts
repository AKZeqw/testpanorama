export interface Suspect {
  id: string
  name: string
  role: string
  description: string
  photoPath?: string
  alibi: string
  accessLevel: string
  relatedEvidenceIds: string[]
}
