import librosa
import numpy as np
import joblib
import os

# Load trained model
model = joblib.load("model/rf_model.pkl")


# MFCC feature extraction
def extract_features(file_path):

    audio, sr = librosa.load(file_path, sr=16000)

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=13
    )

    return np.mean(mfcc.T, axis=0)


# Folder containing test audio
test_folder = "test_audio"

print("Testing all audio files...\n")


# Loop through all files
for file in os.listdir(test_folder):

    if file.endswith(".wav") or file.endswith(".flac") or file.endswith(".mp3"):

        file_path = os.path.join(test_folder, file)

        try:

            features = extract_features(file_path)

            features = features.reshape(1, -1)

            prediction = model.predict(features)

            prob = model.predict_proba(features)

            confidence = np.max(prob) * 100


            if prediction[0] == 0:
                result = "Real Voice"
            else:
                result = "Fake Voice"


            print("File:", file)
            print("Prediction:", result)
            print("Confidence:", round(confidence,2), "%")
            print("----------------------------------")

        except Exception as e:

            print("Error processing", file)
            print(e)
            print("----------------------------------")