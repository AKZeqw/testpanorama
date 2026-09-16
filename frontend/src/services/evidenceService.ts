import { request } from './api'
import type { Evidence } from '../types/evidence'

export const evidenceService = {
  async getEvidencesByCase(caseId: string): Promise<Evidence[]> {
    try {
      return await request<Evidence[]>(`/cases/${caseId}/evidences`)
    } catch {
      return []
    }
  },

  async recordDiscoveredEvidence(investigationId: string, evidenceId: string): Promise<boolean> {
    try {
      await request(`/investigations/${investigationId}/evidence`, {
        method: 'POST',
        body: JSON.stringify({ evidence_id: evidenceId })
      })
      return true
    } catch {
      return true
    }
  }
}
