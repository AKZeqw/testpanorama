from flask import Blueprint, jsonify, request

cases_bp = Blueprint('cases', __name__, url_prefix='/api')

# In-memory store untuk fase awal sebelum PostgreSQL terpasang
DUMMY_CASES = [
    {
        'id': 'case-001',
        'caseNumber': 'Case #001',
        'title': 'The Missing Evidence',
        'description': 'Sebuah sampel penelitian penting dilaporkan hilang dari laboratorium riset pada pukul 22:15 malam. Sistem brankas dibuka secara paksa dan CCTV utama mendadak dinonaktifkan.',
        'difficulty': 'Medium',
        'location': 'Research Laboratory & Forensic Storage',
        'time': '22:15 WIB',
        'objective': 'Telusuri TKP laboratorium, koridor, dan ruang arsip penyimpanan untuk menemukan bukti-bukti kunci, mengidentifikasi tersangka utama, dan menyusun kesimpulan investigasi.',
        'initialInfo': 'Penjaga gedung melapor bahwa lampu lab sempat padam selama 5 menit sekitar pukul 22:10. Tidak ada tanda kerusakan pada pintu luar gedung.',
        'status': 'Available',
        'coverImage': '/panoramas/laboratory.jpg',
        'initialSceneId': 'laboratory'
    }
]

@cases_bp.route('/cases', methods=['GET'])
def get_cases():
    return jsonify(DUMMY_CASES)

@cases_bp.route('/cases/<case_id>', methods=['GET'])
def get_case(case_id):
    case = next((c for c in DUMMY_CASES if c['id'] == case_id), None)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases_bp.route('/cases', methods=['POST'])
def create_case():
    data = request.get_json() or {}
    new_id = f"case-{len(DUMMY_CASES) + 1:03d}"
    new_case = {
        'id': data.get('id', new_id),
        'caseNumber': data.get('caseNumber', f"Case #{len(DUMMY_CASES) + 1:03d}"),
        'title': data.get('title', 'Untitled Case'),
        'description': data.get('description', ''),
        'difficulty': data.get('difficulty', 'Medium'),
        'location': data.get('location', 'Unknown'),
        'time': data.get('time', '22:00 WIB'),
        'objective': data.get('objective', ''),
        'initialInfo': data.get('initialInfo', ''),
        'status': data.get('status', 'Draft'),
        'coverImage': data.get('coverImage', '/panoramas/laboratory.jpg'),
        'initialSceneId': data.get('initialSceneId', '')
    }
    DUMMY_CASES.append(new_case)
    return jsonify(new_case), 201

@cases_bp.route('/cases/<case_id>', methods=['PUT'])
def update_case(case_id):
    case = next((c for c in DUMMY_CASES if c['id'] == case_id), None)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    data = request.get_json() or {}
    for key, value in data.items():
        if key != 'id':
            case[key] = value
    return jsonify(case)

@cases_bp.route('/cases/<case_id>', methods=['DELETE'])
def delete_case(case_id):
    global DUMMY_CASES
    initial_len = len(DUMMY_CASES)
    DUMMY_CASES = [c for c in DUMMY_CASES if c['id'] != case_id]
    if len(DUMMY_CASES) == initial_len:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify({'success': True, 'message': f'Case {case_id} deleted'})

