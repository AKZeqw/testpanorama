import { request } from './api'
import type { Case } from '../types/case'
import type { Scene, Hotspot } from '../types/scene'
import { dummyCases } from '../data/dummyCase'

export const caseService = {
  async getAllCases(): Promise<Case[]> {
    try {
      return await request<Case[]>('/cases')
    } catch {
      return dummyCases
    }
  },

  async getCaseById(id: string): Promise<Case | undefined> {
    try {
      return await request<Case>(`/cases/${id}`)
    } catch {
      return dummyCases.find(c => c.id === id)
    }
  },

  async createCase(caseData: Partial<Case>): Promise<Case> {
    try {
      return await request<Case>('/cases', {
        method: 'POST',
        body: JSON.stringify(caseData)
      })
    } catch {
      const newId = `case-${Date.now().toString().slice(-4)}`
      return {
        id: newId,
        caseNumber: caseData.caseNumber || `Case #${newId}`,
        title: caseData.title || 'Untitled Case',
        description: caseData.description || '',
        difficulty: caseData.difficulty || 'Medium',
        location: caseData.location || 'Unknown',
        time: caseData.time || '20:00 WIB',
        objective: caseData.objective || '',
        initialInfo: caseData.initialInfo || '',
        status: caseData.status || 'Draft',
        coverImage: caseData.coverImage || '/panoramas/laboratory.jpg',
        initialSceneId: caseData.initialSceneId || '',
        scenes: caseData.scenes || [],
        evidences: caseData.evidences || [],
        suspects: caseData.suspects || [],
        solution: caseData.solution || {
          correctSuspectId: '',
          keyEvidenceIds: [],
          explanationKeywords: []
        }
      } as Case
    }
  },

  async updateCase(id: string, caseData: Partial<Case>): Promise<Case | null> {
    try {
      return await request<Case>(`/cases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(caseData)
      })
    } catch {
      return null
    }
  },

  async deleteCase(id: string): Promise<boolean> {
    try {
      await request(`/cases/${id}`, { method: 'DELETE' })
      return true
    } catch {
      return true
    }
  },

  async saveHotspot(caseId: string, sceneId: string, hotspot: Hotspot): Promise<Hotspot> {
    try {
      return await request<Hotspot>(`/scenes/${sceneId}/hotspots`, {
        method: 'POST',
        body: JSON.stringify(hotspot)
      })
    } catch {
      return hotspot
    }
  },

  async deleteHotspot(hotspotId: string): Promise<boolean> {
    try {
      await request(`/hotspots/${hotspotId}`, { method: 'DELETE' })
      return true
    } catch {
      return true
    }
  }
}

