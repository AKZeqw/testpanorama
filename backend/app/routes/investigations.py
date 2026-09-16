from flask import Blueprint, jsonify, request
from datetime import datetime

investigations_bp = Blueprint('investigations', __name__, url_prefix='/api')

DUMMY_INVESTIGATIONS = {}

@investigations_bp.route('/investigations', methods=['POST'])
def start_investigation():
    data = request.get_json() or {}
    case_id = data.get('case_id', 'case-001')
    user_id = data.get('user_id', 'usr-01')
    inv_id = f"inv-{int(datetime.utcnow().timestamp())}"
    
    investigation = {
        'id': inv_id,
        'case_id': case_id,
        'user_id': user_id,
        'started_at': datetime.utcnow().isoformat(),
        'completed_at': None,
        'evidence_ids': [],
        'selected_suspect_id': None,
        'explanation': '',
        'score': 0,
        'result': None
    }
    DUMMY_INVESTIGATIONS[inv_id] = investigation
    return jsonify(investigation), 201

@investigations_bp.route('/investigations/<inv_id>/evidence', methods=['POST'])
def collect_evidence(inv_id):
    inv = DUMMY_INVESTIGATIONS.get(inv_id)
    if not inv:
        return jsonify({'error': 'Investigation session not found'}), 404
    data = request.get_json() or {}
    ev_id = data.get('evidence_id')
    if ev_id and ev_id not in inv['evidence_ids']:
        inv['evidence_ids'].append(ev_id)
    return jsonify({'success': True, 'collected_evidences': inv['evidence_ids']})

@investigations_bp.route('/investigations/<inv_id>/conclusion', methods=['POST'])
def submit_conclusion(inv_id):
    inv = DUMMY_INVESTIGATIONS.get(inv_id)
    if not inv:
        return jsonify({'error': 'Investigation session not found'}), 404
    
    data = request.get_json() or {}
    suspect_id = data.get('suspect_id')
    explanation = data.get('explanation', '')
    supporting_ev_ids = data.get('supporting_evidence_ids', [])

    inv['selected_suspect_id'] = suspect_id
    inv['explanation'] = explanation
    inv['completed_at'] = datetime.utcnow().isoformat()

    # Hitung score
    is_suspect_correct = suspect_id == 'suspect-andi'
    score = 0
    # Bukti ditemukan
    score += min(40, len(inv['evidence_ids']) * 8)
    if is_suspect_correct:
        score += 40
    if len(supporting_ev_ids) >= 2:
        score += 10
    if len(explanation) > 20:
        score += 10

    res = {
        'score': min(100, score),
        'is_suspect_correct': is_suspect_correct,
        'evidence_found_count': len(inv['evidence_ids']),
        'total_evidences': 5,
        'completed_at': inv['completed_at']
    }
    inv['score'] = score
    inv['result'] = res

    return jsonify(res)

@investigations_bp.route('/investigations/<inv_id>/result', methods=['GET'])
def get_investigation_result(inv_id):
    inv = DUMMY_INVESTIGATIONS.get(inv_id)
    if not inv:
        return jsonify({'error': 'Investigation session not found'}), 404
    return jsonify(inv.get('result') or {'score': inv['score']})
