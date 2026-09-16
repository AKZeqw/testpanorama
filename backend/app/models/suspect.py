class SuspectModel:
    """Model Tersangka Kasus"""
    def __init__(self, id, case_id, name, role, description='', alibi='', access_level=''):
        self.id = id
        self.case_id = case_id
        self.name = name
        self.role = role
        self.description = description
        self.alibi = alibi
        self.access_level = access_level

    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'name': self.name,
            'role': self.role,
            'description': self.description,
            'alibi': self.alibi,
            'access_level': self.access_level
        }
