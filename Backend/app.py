from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from process_mining.process_bpmn import parse_bpmn
from process_mining.process_csv import parse_csv

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_files():
    """Handles BPMN and CSV file uploads."""
    if 'bpmn' not in request.files or 'csv' not in request.files:
        return jsonify({"error": "Both BPMN and CSV files are required"}), 400
    
    bpmn_file = request.files['bpmn']
    csv_file = request.files['csv']

    bpmn_path = os.path.join(UPLOAD_FOLDER, bpmn_file.filename)
    csv_path = os.path.join(UPLOAD_FOLDER, csv_file.filename)

    bpmn_file.save(bpmn_path)
    csv_file.save(csv_path)

    to_be_process = parse_bpmn(bpmn_path)
    as_is_process = parse_csv(csv_path)

    return jsonify({
        "to_be_process": to_be_process,
        "as_is_process": as_is_process
    })

if __name__ == '__main__':
    app.run(debug=True)
