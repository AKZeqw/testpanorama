from datetime import datetime

class CaseModel:
    """Model Kasus Investigasi"""
    def __init__(self, id, title, description, difficulty='Medium', location='', objective='', status='Available'):
        self.id = id
        self.title = title
        self.description = description
        self.difficulty = difficulty
        self.location = location
        self.objective = objective
        self.status = status
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'location': self.location,
            'objective': self.objective,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
