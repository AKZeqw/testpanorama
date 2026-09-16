from flask import Blueprint, jsonify, request

scenes_bp = Blueprint('scenes', __name__, url_prefix='/api')

# Initial in-memory scenes database
DUMMY_SCENES = [
    {
        'id': 'laboratory',
        'case_id': 'case-001',
        'name': 'Laboratory (TKP Utama)',
        'description': 'Ruang kerja penelitian tempat sampel utama disimpan dan diamati.',
        'panorama_path': '/panoramas/laboratory.jpg',
        'order_index': 1,
        'hotspots': [
            {
                'id': 'hs-laptop',
                'scene_id': 'laboratory',
                'type': 'evidence',
                'name': 'Laptop Menyala',
                'description': 'Laptop di atas meja kerja masih menyala dengan dokumen rahasia terbuka.',
                'yaw': '40deg',
                'pitch': '-8deg',
                'evidence_id': 'ev-laptop'
            },
            {
                'id': 'hs-cctv',
                'scene_id': 'laboratory',
                'type': 'evidence',
                'name': 'Kamera Pengawas CCTV',
                'description': 'Kamera di sudut dinding tampak mati dan lampu indikatornya padam.',
                'yaw': '135deg',
                'pitch': '10deg',
                'evidence_id': 'ev-cctv'
            },
            {
                'id': 'hs-access-card',
                'scene_id': 'laboratory',
                'type': 'evidence',
                'name': 'Kartu Akses Master',
                'description': 'Kartu identitas pegawai terjatuh di bawah laci meja berkas.',
                'yaw': '-40deg',
                'pitch': '-22deg',
                'evidence_id': 'ev-access-card'
            },
            {
                'id': 'hs-door-to-corridor',
                'scene_id': 'laboratory',
                'type': 'navigation',
                'name': 'Pintu Koridor',
                'description': 'Pintu keluar menuju lorong koridor laboratorium.',
                'yaw': '-155deg',
                'pitch': '-3deg',
                'target_scene_id': 'corridor'
            }
        ]
    },
    {
        'id': 'corridor',
        'case_id': 'case-001',
        'name': 'Corridor (Lorong Gedung)',
        'description': 'Lorong penghubung antar laboratorium dan ruang penyimpanan barang bukti.',
        'panorama_path': '/panoramas/corridor.jpg',
        'order_index': 2,
        'hotspots': [
            {
                'id': 'hs-footprint',
                'scene_id': 'corridor',
                'type': 'evidence',
                'name': 'Jejak Sepatu Basah',
                'description': 'Terdapat bekas jejak lumpur basah berukuran sepatu boot pria nomor 42.',
                'yaw': '55deg',
                'pitch': '-26deg',
                'evidence_id': 'ev-footprint'
            },
            {
                'id': 'hs-door-to-lab',
                'scene_id': 'corridor',
                'type': 'navigation',
                'name': 'Masuk Laboratorium',
                'description': 'Pintu menuju ruang laboratorium penelitian.',
                'yaw': '-95deg',
                'pitch': '-2deg',
                'target_scene_id': 'laboratory'
            },
            {
                'id': 'hs-door-to-storage',
                'scene_id': 'corridor',
                'type': 'navigation',
                'name': 'Ruang Penyimpanan (Storage)',
                'description': 'Pintu besi menuju ruang arsip dan brankas penyimpanan barang bukti.',
                'yaw': '95deg',
                'pitch': '-2deg',
                'target_scene_id': 'storage-room'
            }
        ]
    },
    {
        'id': 'storage-room',
        'case_id': 'case-001',
        'name': 'Storage Room (Ruang Penyimpanan)',
        'description': 'Ruang arsip dokumen dan brankas tempat penyimpanan bukti kasus lama.',
        'panorama_path': '/panoramas/storage-room.jpg',
        'order_index': 3,
        'hotspots': [
            {
                'id': 'hs-document',
                'scene_id': 'storage-room',
                'type': 'evidence',
                'name': 'Buku Log Berkas',
                'description': 'Buku catatan serah terima kunci brankas dengan tanda tangan mencurigakan.',
                'yaw': '-65deg',
                'pitch': '-18deg',
                'evidence_id': 'ev-document'
            },
            {
                'id': 'hs-door-to-corridor-from-storage',
                'scene_id': 'storage-room',
                'type': 'navigation',
                'name': 'Kembali ke Koridor',
                'description': 'Pintu keluar kembali ke lorong koridor gedung.',
                'yaw': '175deg',
                'pitch': '-2deg',
                'target_scene_id': 'corridor'
            }
        ]
    }
]

# --- SCENE ROUTES ---

@scenes_bp.route('/cases/<case_id>/scenes', methods=['GET'])
def get_case_scenes(case_id):
    scenes = [s for s in DUMMY_SCENES if s['case_id'] == case_id]
    return jsonify(scenes)

@scenes_bp.route('/cases/<case_id>/scenes', methods=['POST'])
def create_case_scene(case_id):
    data = request.get_json() or {}
    new_scene = {
        'id': data.get('id', f"scene-{len(DUMMY_SCENES) + 1}"),
        'case_id': case_id,
        'name': data.get('name', 'Ruangan Baru'),
        'description': data.get('description', ''),
        'panorama_path': data.get('panorama_path', '/panoramas/laboratory.jpg'),
        'order_index': data.get('order_index', len(DUMMY_SCENES) + 1),
        'hotspots': data.get('hotspots', [])
    }
    DUMMY_SCENES.append(new_scene)
    return jsonify(new_scene), 201

@scenes_bp.route('/scenes/<scene_id>', methods=['GET'])
def get_scene(scene_id):
    scene = next((s for s in DUMMY_SCENES if s['id'] == scene_id), None)
    if not scene:
        return jsonify({'error': 'Scene not found'}), 404
    return jsonify(scene)

@scenes_bp.route('/scenes/<scene_id>', methods=['PUT'])
def update_scene(scene_id):
    scene = next((s for s in DUMMY_SCENES if s['id'] == scene_id), None)
    if not scene:
        return jsonify({'error': 'Scene not found'}), 404
    data = request.get_json() or {}
    for k, v in data.items():
        if k not in ('id', 'case_id'):
            scene[k] = v
    return jsonify(scene)

@scenes_bp.route('/scenes/<scene_id>', methods=['DELETE'])
def delete_scene(scene_id):
    global DUMMY_SCENES
    initial_len = len(DUMMY_SCENES)
    DUMMY_SCENES = [s for s in DUMMY_SCENES if s['id'] != scene_id]
    if len(DUMMY_SCENES) == initial_len:
        return jsonify({'error': 'Scene not found'}), 404
    return jsonify({'success': True, 'message': f'Scene {scene_id} deleted'})

# --- HOTSPOT ROUTES ---

@scenes_bp.route('/scenes/<scene_id>/hotspots', methods=['GET'])
def get_scene_hotspots(scene_id):
    scene = next((s for s in DUMMY_SCENES if s['id'] == scene_id), None)
    if not scene:
        return jsonify({'error': 'Scene not found'}), 404
    return jsonify(scene.get('hotspots', []))

@scenes_bp.route('/scenes/<scene_id>/hotspots', methods=['POST'])
def create_hotspot(scene_id):
    scene = next((s for s in DUMMY_SCENES if s['id'] == scene_id), None)
    if not scene:
        return jsonify({'error': 'Scene not found'}), 404
    data = request.get_json() or {}
    new_hs = {
        'id': data.get('id', f"hs-{Date_now_id()}"),
        'scene_id': scene_id,
        'type': data.get('type', 'evidence'),
        'name': data.get('name', 'Hotspot Baru'),
        'description': data.get('description', ''),
        'yaw': data.get('yaw', '0deg'),
        'pitch': data.get('pitch', '0deg'),
        'target_scene_id': data.get('target_scene_id'),
        'evidence_id': data.get('evidence_id')
    }
    if 'hotspots' not in scene:
        scene['hotspots'] = []
    scene['hotspots'].append(new_hs)
    return jsonify(new_hs), 201

@scenes_bp.route('/hotspots/<hotspot_id>', methods=['PUT'])
def update_hotspot(hotspot_id):
    for scene in DUMMY_SCENES:
        for hs in scene.get('hotspots', []):
            if hs['id'] == hotspot_id:
                data = request.get_json() or {}
                for k, v in data.items():
                    if k != 'id':
                        hs[k] = v
                return jsonify(hs)
    return jsonify({'error': 'Hotspot not found'}), 404

@scenes_bp.route('/hotspots/<hotspot_id>', methods=['DELETE'])
def delete_hotspot(hotspot_id):
    found = False
    for scene in DUMMY_SCENES:
        if 'hotspots' in scene:
            initial_count = len(scene['hotspots'])
            scene['hotspots'] = [h for h in scene['hotspots'] if h['id'] != hotspot_id]
            if len(scene['hotspots']) < initial_count:
                found = True
                break
    if not found:
        return jsonify({'error': 'Hotspot not found'}), 404
    return jsonify({'success': True, 'message': f'Hotspot {hotspot_id} deleted'})

def Date_now_id():
    import time
    return int(time.time() * 1000) % 100000
