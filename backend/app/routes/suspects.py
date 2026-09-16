from flask import Blueprint, jsonify, request

suspects_bp = Blueprint('suspects', __name__, url_prefix='/api')

DUMMY_SUSPECTS = [
    {
        'id': 'suspect-andi',
        'case_id': 'case-001',
        'name': 'Andi Saputra',
        'role': 'Asisten Laboratorium',
        'description': 'Memiliki akses langsung ke komputer riset dan mengetahui kode kombinasi awal brankas.',
        'alibi': 'Mengaku sudah meninggalkan gedung jam 21:00, namun kartu aksesnya terbukti aktif pukul 22:05.',
        'access_level': 'Laboratorium & Ruang Komputer',
        'related_evidence_ids': ['ev-laptop', 'ev-access-card', 'ev-document']
    },
    {
        'id': 'suspect-budi',
        'case_id': 'case-001',
        'name': 'Budi Santoso',
        'role': 'Petugas Keamanan Malam',
        'description': 'Bertanggung jawab atas pengawasan CCTV dan kunci cadangan lorong koridor.',
        'alibi': 'Mengklaim sedang mengecek gerbang utama saat listrik padam, tidak berada di dekat koridor lab.',
        'access_level': 'Seluruh Gedung',
        'related_evidence_ids': ['ev-cctv', 'ev-footprint']
    },
    {
        'id': 'suspect-citra',
        'case_id': 'case-001',
        'name': 'Dr. Citra Lestari',
        'role': 'Peneliti Utama (Lead Researcher)',
        'description': 'Pemilik lisensi utama sampel yang hilang. Memiliki kepentingan klaim asuransi riset.',
        'alibi': 'Bekerja lembur di ruang kantor lantai 3 hingga larut malam.',
        'access_level': 'Laboratorium & Ruang Penyimpanan',
        'related_evidence_ids': ['ev-document']
    }
]

@suspects_bp.route('/cases/<case_id>/suspects', methods=['GET'])
def get_case_suspects(case_id):
    sus = [s for s in DUMMY_SUSPECTS if s['case_id'] == case_id]
    return jsonify(sus)

@suspects_bp.route('/cases/<case_id>/suspects', methods=['POST'])
def create_suspect(case_id):
    data = request.get_json() or {}
    new_sus = {
        'id': data.get('id', f"suspect-{len(DUMMY_SUSPECTS) + 1}"),
        'case_id': case_id,
        'name': data.get('name', 'Tersangka Baru'),
        'role': data.get('role', 'Pegawai'),
        'description': data.get('description', ''),
        'alibi': data.get('alibi', ''),
        'access_level': data.get('access_level', 'Umum'),
        'related_evidence_ids': data.get('related_evidence_ids', [])
    }
    DUMMY_SUSPECTS.append(new_sus)
    return jsonify(new_sus), 201

@suspects_bp.route('/suspects/<suspect_id>', methods=['GET'])
def get_suspect(suspect_id):
    sus = next((s for s in DUMMY_SUSPECTS if s['id'] == suspect_id), None)
    if not sus:
        return jsonify({'error': 'Suspect not found'}), 404
    return jsonify(sus)

@suspects_bp.route('/suspects/<suspect_id>', methods=['PUT'])
def update_suspect(suspect_id):
    sus = next((s for s in DUMMY_SUSPECTS if s['id'] == suspect_id), None)
    if not sus:
        return jsonify({'error': 'Suspect not found'}), 404
    data = request.get_json() or {}
    for k, v in data.items():
        if k not in ('id', 'case_id'):
            sus[k] = v
    return jsonify(sus)

@suspects_bp.route('/suspects/<suspect_id>', methods=['DELETE'])
def delete_suspect(suspect_id):
    global DUMMY_SUSPECTS
    initial_len = len(DUMMY_SUSPECTS)
    DUMMY_SUSPECTS = [s for s in DUMMY_SUSPECTS if s['id'] != suspect_id]
    if len(DUMMY_SUSPECTS) == initial_len:
        return jsonify({'error': 'Suspect not found'}), 404
    return jsonify({'success': True, 'message': f'Suspect {suspect_id} deleted'})
