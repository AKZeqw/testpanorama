export type HotspotType = 'evidence' | 'navigation' | 'info' | 'information' | 'secret' | 'decoy'


export interface Hotspot {
  id: string
  type: HotspotType
  name: string
  description: string
  yaw: number | string
  pitch: number | string
  targetSceneId?: string
  evidenceId?: string
  requiresEvidenceId?: string
}

export interface Scene {
  id: string
  name: string
  description: string
  panoramaPath: string
  orderIndex: number
  hotspots: Hotspot[]
}
