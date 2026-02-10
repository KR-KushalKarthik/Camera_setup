from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Folder to save uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return "Flask server is running"

@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'No image found'}), 400

    img_data = data['image']

    try:
        # Decode base64 image
        header, encoded = img_data.split(',', 1)
        img_bytes = base64.b64decode(encoded)

        # Save image with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f'image_{timestamp}.png'
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        with open(file_path, 'wb') as f:
            f.write(img_bytes)

        return jsonify({'status': 'success', 'message': f'Image saved as {filename}'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
