import os
import librosa
import numpy as np
import joblib
from sklearn.metrics import accuracy_score, classification_report


# paths
eval_audio = "dataset/eval"
eval_protocol = "protocol/eval.txt"
model_path = "model/rf_model.pkl"


# load model
model = joblib.load(model_path)


# read labels
def read_labels(file):

    labels = {}

    with open(file, "r") as f:

        for line in f:

            parts = line.strip().split()

            file_id = parts[1]
            label = parts[4]

            labels[file_id] = label

    return labels


labels = read_labels(eval_protocol)


# MFCC extraction
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

print("Evaluating model...")


for file in os.listdir(eval_audio):

    if file.endswith(".flac"):

        file_id = file.replace(".flac", "")

        if file_id in labels:

            path = os.path.join(eval_audio, file)

            features = extract_features(path)

            X.append(features)

            if labels[file_id] == "bonafide":
                y_true.append(0)
            else:
                y_true.append(1)


predictions = model.predict(X)

accuracy = accuracy_score(y_true, predictions)

print("\nEvaluation Accuracy:", accuracy * 100)

print("\nClassification Report:\n")
print(classification_report(y_true, predictions))