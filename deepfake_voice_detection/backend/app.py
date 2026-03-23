from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import joblib
import os

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, supports_credentials=True, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

# Load trained Random Forest model
try:
    model = joblib.load("model/rf_model.pkl")
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None


# Add after_request handler for CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


# Handle preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 204


# Test endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend server is running", "model": "loaded" if model else "failed"}), 200


# MFCC FEATURE EXTRACTION
def extract_features(file_path):
    try:
        # load audio (supports wav, flac, mp3)
        audio, sr = librosa.load(file_path, sr=16000)

        # extract MFCC features
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sr,
            n_mfcc=13
        )

        # mean of MFCC features
        mfcc_mean = np.mean(mfcc.T, axis=0)
        return mfcc_mean
    except Exception as e:
        print(f"Feature extraction error: {e}")
        raise


# PREDICTION API
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    try:
        print(f"Received request: {request.method}")
        
        if request.method == "OPTIONS":
            return "", 204

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        if "audio" not in request.files:
            print("No audio file in request")
            return jsonify({"error": "No audio file uploaded"}), 400

        file = request.files["audio"]

        if file.filename == "":
            print("Empty filename")
            return jsonify({"error": "No file selected"}), 400

        print(f"Processing file: {file.filename}")

        # keep original extension
        filename = file.filename
        temp_path = "temp_" + filename

        try:
            # save uploaded file
            file.save(temp_path)
            print(f"File saved to {temp_path}")

            # extract MFCC
            features = extract_features(temp_path)
            print(f"Features extracted: shape={features.shape}")

            features = features.reshape(1, -1)

            # model prediction
            prediction = model.predict(features)
            prob = model.predict_proba(features)
            confidence = np.max(prob) * 100

            if prediction[0] == 0:
                result = "Real Voice"
            else:
                result = "Fake Voice"

            response_data = {
                "prediction": result,
                "model": "Random Forest",
                "accuracy": f"{confidence:.2f}%",
                "confidence": float(confidence)
            }
            
            print(f"Prediction complete: {response_data}")
            return jsonify(response_data), 200

        except Exception as e:
            error_msg = str(e)
            print(f"Error processing file: {error_msg}")
            return jsonify({"error": f"Processing error: {error_msg}"}), 500

        finally:
            # remove temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                print(f"Temp file removed: {temp_path}")

    except Exception as e:
        error_msg = str(e)
        print(f"Unexpected error: {error_msg}")
        return jsonify({"error": f"Server error: {error_msg}"}), 500


if __name__ == "__main__":
    print("=" * 60)
    print("Starting Deepfake Voice Detection API...")
    print("Server running on http://localhost:5000")
    print("=" * 60)
    app.run(debug=False, port=5000, host="0.0.0.0", threaded=True)