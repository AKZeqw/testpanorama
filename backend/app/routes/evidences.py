from flask import Blueprint, jsonify, request

evidences_bp = Blueprint('evidences', __name__, url_prefix='/api')

DUMMY_EVIDENCES = [
    {
        'id': 'ev-laptop',
        'case_id': 'case-001',
        'name': 'Laptop Korban',
        'description': 'Laptop ditemukan dalam keadaan menyala. Ada file log akses brankas yang diunduh pada pukul 22:07.',
        'detailed_analysis': 'Analisis forensik digital menunjukkan upaya menghapus rekaman riwayat akses 8 menit sebelum pemadaman listrik.',
        'discovered_scene_id': 'laboratory',
        'importance': 'Critical',
        'related_suspect_ids': ['suspect-andi']
    },
    {
        'id': 'ev-cctv',
        'case_id': 'case-001',
        'name': 'Kabel Kamera CCTV',
        'description': 'Kabel daya CCTV di sudut laboratorium dipotong rapi dengan tang pemotong listrik presisi.',
        'detailed_analysis': 'Potongan kabel sangat rapi, mengindikasikan pelaku paham tata letak instalasi kabel gedung.',
        'discovered_scene_id': 'laboratory',
        'importance': 'Supporting',
        'related_suspect_ids': ['suspect-budi']
    },
    {
        'id': 'ev-access-card',
        'case_id': 'case-001',
        'name': 'Kartu Akses Master #088',
        'description': 'Kartu akses berkode ID 088 atas nama asisten lab ditemukan tertinggal dekat brankas.',
        'detailed_analysis': 'Terdapat sidik jari yang cocok dengan pemegang kartu, membuktikan kartu digunakan secara fisik pada jam kejadian.',
        'discovered_scene_id': 'laboratory',
        'importance': 'Critical',
        'related_suspect_ids': ['suspect-andi']
    },
    {
        'id': 'ev-footprint',
        'case_id': 'case-001',
        'name': 'Jejak Sepatu Basah',
        'description': 'Jejak lumpur dari sepatu boot ukuran 42 mengarah tergesa-gesa dari lab menuju ruang arsip.',
        'detailed_analysis': 'Bahan sol sepatu identik dengan sepatu dinas petugas teknis atau petugas keamanan.',
        'discovered_scene_id': 'corridor',
        'importance': 'Supporting',
        'related_suspect_ids': ['suspect-budi', 'suspect-andi']
    },
    {
        'id': 'ev-document',
        'case_id': 'case-001',
        'name': 'Buku Log Berkas Brankas',
        'description': 'Catatan serah terima spesimen menunjukkan brankas dibuka pada pukul 22:12 dengan tanda tangan palsu.',
        'detailed_analysis': 'Tinta tanda tangan masih baru dan coretan tangan tidak sesuai dengan tanda tangan kepala riset.',
        'discovered_scene_id': 'storage-room',
        'importance': 'Critical',
        'related_suspect_ids': ['suspect-andi', 'suspect-citra']
    }
]

@evidences_bp.route('/cases/<case_id>/evidences', methods=['GET'])
def get_case_evidences(case_id):
    evs = [e for e in DUMMY_EVIDENCES if e['case_id'] == case_id]
    return jsonify(evs)

@evidences_bp.route('/cases/<case_id>/evidences', methods=['POST'])
def create_evidence(case_id):
    data = request.get_json() or {}
    new_ev = {
        'id': data.get('id', f"ev-{len(DUMMY_EVIDENCES) + 1}"),
        'case_id': case_id,
        'name': data.get('name', 'Barang Bukti Baru'),
        'description': data.get('description', ''),
        'detailed_analysis': data.get('detailed_analysis', ''),
        'discovered_scene_id': data.get('discovered_scene_id', ''),
        'importance': data.get('importance', 'Supporting'),
        'related_suspect_ids': data.get('related_suspect_ids', [])
    }
    DUMMY_EVIDENCES.append(new_ev)
    return jsonify(new_ev), 201

@evidences_bp.route('/evidences/<evidence_id>', methods=['GET'])
def get_evidence(evidence_id):
    ev = next((e for e in DUMMY_EVIDENCES if e['id'] == evidence_id), None)
    if not ev:
        return jsonify({'error': 'Evidence not found'}), 404
    return jsonify(ev)

@evidences_bp.route('/evidences/<evidence_id>', methods=['PUT'])
def update_evidence(evidence_id):
    ev = next((e for e in DUMMY_EVIDENCES if e['id'] == evidence_id), None)
    if not ev:
        return jsonify({'error': 'Evidence not found'}), 404
    data = request.get_json() or {}
    for k, v in data.items():
        if k not in ('id', 'case_id'):
            ev[k] = v
    return jsonify(ev)

@evidences_bp.route('/evidences/<evidence_id>', methods=['DELETE'])
def delete_evidence(evidence_id):
    global DUMMY_EVIDENCES
    initial_len = len(DUMMY_EVIDENCES)
    DUMMY_EVIDENCES = [e for e in DUMMY_EVIDENCES if e['id'] != evidence_id]
    if len(DUMMY_EVIDENCES) == initial_len:
        return jsonify({'error': 'Evidence not found'}), 404
    return jsonify({'success': True, 'message': f'Evidence {evidence_id} deleted'})
