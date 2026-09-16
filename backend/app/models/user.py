from datetime import datetime

class User:
    """Model Pengguna / Investigator / Dosen Admin"""
    def __init__(self, id, username, email, password_hash, role='investigator'):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }
