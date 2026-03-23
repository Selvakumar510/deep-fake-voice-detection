import os
import librosa
import numpy as np
import joblib
from sklearn.metrics import accuracy_score


dev_audio = "dataset/dev"
dev_protocol = "protocol/dev.txt"

model = joblib.load("model/rf_model.pkl")


def read_labels(file):
    labels = {}
    with open(file, "r") as f:
        for line in f:
            parts = line.strip().split()
            labels[parts[1]] = parts[4]
    return labels


labels = read_labels(dev_protocol)


def extract_features(file_path):

    audio, sr = librosa.load(file_path, sr=16000)

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=13
    )

    return np.mean(mfcc.T, axis=0)


X = []
y_true = []

print("Validating model...")

for file in os.listdir(dev_audio):

    if file.endswith(".flac"):

        file_id = file.replace(".flac", "")

        if file_id in labels:

            path = os.path.join(dev_audio, file)

            features = extract_features(path)

            X.append(features)

            if labels[file_id] == "bonafide":
                y_true.append(0)
            else:
                y_true.append(1)


predictions = model.predict(X)

accuracy = accuracy_score(y_true, predictions)

print("Validation Accuracy:", accuracy * 100)