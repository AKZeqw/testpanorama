from datetime import datetime

class InvestigationModel:
    """Model Sesi Investigasi Pemain"""
    def __init__(self, id, user_id, case_id, score=0):
        self.id = id
        self.user_id = user_id
        self.case_id = case_id
        self.started_at = datetime.utcnow()
        self.completed_at = None
        self.score = score
        self.evidences = []

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'case_id': self.case_id,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'score': self.score,
            'evidences': self.evidences
        }

class ConclusionModel:
    """Model Kesimpulan Akhir Kasus"""
    def __init__(self, id, investigation_id, suspect_id, explanation, supporting_evidence_ids=None):
        self.id = id
        self.investigation_id = investigation_id
        self.suspect_id = suspect_id
        self.explanation = explanation
        self.supporting_evidence_ids = supporting_evidence_ids or []
        self.submitted_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'investigation_id': self.investigation_id,
            'suspect_id': self.suspect_id,
            'explanation': self.explanation,
            'supporting_evidence_ids': self.supporting_evidence_ids,
            'submitted_at': self.submitted_at.isoformat()
        }
