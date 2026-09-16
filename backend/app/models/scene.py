class SceneModel:
    """Model Ruangan / Panorama Scene"""
    def __init__(self, id, case_id, name, panorama_path, description='', order_index=0):
        self.id = id
        self.case_id = case_id
        self.name = name
        self.panorama_path = panorama_path
        self.description = description
        self.order_index = order_index

    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'name': self.name,
            'panorama_path': self.panorama_path,
            'description': self.description,
            'order_index': self.order_index
        }

class HotspotModel:
    """Model Hotspot Interaktif (Evidence & Navigation)"""
    def __init__(self, id, scene_id, type, name, description, yaw, pitch, target_scene_id=None, evidence_id=None):
        self.id = id
        self.scene_id = scene_id
        self.type = type
        self.name = name
        self.description = description
        self.yaw = yaw
        self.pitch = pitch
        self.target_scene_id = target_scene_id
        self.evidence_id = evidence_id

    def to_dict(self):
        return {
            'id': self.id,
            'scene_id': self.scene_id,
            'type': self.type,
            'name': self.name,
            'description': self.description,
            'yaw': self.yaw,
            'pitch': self.pitch,
            'target_scene_id': self.target_scene_id,
            'evidence_id': self.evidence_id
        }
