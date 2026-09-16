class EvidenceModel:
    """Model Barang Bukti Kasus"""
    def __init__(self, id, case_id, name, description, discovered_scene_name='', importance='Critical'):
        self.id = id
        self.case_id = case_id
        self.name = name
        self.description = description
        self.discovered_scene_name = discovered_scene_name
        self.importance = importance

    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'name': self.name,
            'description': self.description,
            'discovered_scene_name': self.discovered_scene_name,
            'importance': self.importance
        }
