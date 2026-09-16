from flask import Blueprint, jsonify, request
import hashlib

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

DUMMY_USERS = [
    {
        'id': 'usr-01',
        'username': 'investigator1',
        'email': 'investigator@cid.police.go.id',
        'password_hash': hashlib.sha256('password123'.encode()).hexdigest(),
        'role': 'investigator'
    },
    {
        'id': 'usr-admin',
        'username': 'dosen_forensik',
        'email': 'lecturer@univ.ac.id',
        'password_hash': hashlib.sha256('admin123'.encode()).hexdigest(),
        'role': 'lecturer'
    }
]

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password', '')
    p_hash = hashlib.sha256(password.encode()).hexdigest()

    user = next((u for u in DUMMY_USERS if u['username'] == username and u['password_hash'] == p_hash), None)
    if not user:
        return jsonify({'error': 'Invalid username or password'}), 401

    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'role': user['role']
        },
        'token': f"mock-token-{user['id']}"
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if any(u['username'] == username for u in DUMMY_USERS):
        return jsonify({'error': 'Username already exists'}), 409

    new_user = {
        'id': f"usr-{len(DUMMY_USERS) + 1:02d}",
        'username': username,
        'email': email,
        'password_hash': hashlib.sha256(password.encode()).hexdigest(),
        'role': data.get('role', 'investigator')
    }
    DUMMY_USERS.append(new_user)

    return jsonify({
        'success': True,
        'user': {
            'id': new_user['id'],
            'username': new_user['username'],
            'email': new_user['email'],
            'role': new_user['role']
        }
    }), 201

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    # Return default user
    return jsonify({
        'id': 'usr-01',
        'username': 'investigator1',
        'role': 'investigator',
        'badgeNumber': 'CID-7749'
    })
