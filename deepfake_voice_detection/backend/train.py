import os
import librosa
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# -----------------------------
# DATASET PATHS
# -----------------------------

train_audio = "dataset/train"
train_protocol = "protocol/train.txt"

extra_real = "dataset_extra/real"
extra_fake = "dataset_extra/fake"


# -----------------------------
# READ LABELS
# -----------------------------

def read_labels(file):

    labels = {}

    with open(file, "r") as f:

        for line in f:

            parts = line.strip().split()

            file_id = parts[1]

            label = parts[4]

            labels[file_id] = label

    return labels


labels = read_labels(train_protocol)


# -----------------------------
# MFCC FEATURE EXTRACTION
# -----------------------------

def extract_mfcc(file_path):

    audio, sr = librosa.load(file_path, sr=16000)

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=13
    )

    mfcc_mean = np.mean(mfcc.T, axis=0)

    return mfcc_mean


X = []
y = []

print("Starting MFCC extraction...")


# -----------------------------
# LOAD ASVSPOOF DATASET
# -----------------------------

for file in os.listdir(train_audio):

    if file.endswith(".flac"):

        file_id = file.replace(".flac", "")

        if file_id in labels:

            path = os.path.join(train_audio, file)

            features = extract_mfcc(path)

            X.append(features)

            if labels[file_id] == "bonafide":
                y.append(0)   # real
            else:
                y.append(1)   # fake


# -----------------------------
# LOAD EXTRA KAGGLE DATASET
# -----------------------------

print("Loading additional Kaggle dataset...")

# Real voices
if os.path.exists(extra_real):

    for file in os.listdir(extra_real):

        if file.endswith(".wav") or file.endswith(".flac"):

            path = os.path.join(extra_real, file)

            features = extract_mfcc(path)

            X.append(features)

            y.append(0)


# Fake voices
if os.path.exists(extra_fake):

    for file in os.listdir(extra_fake):

        if file.endswith(".wav") or file.endswith(".flac"):

            path = os.path.join(extra_fake, file)

            features = extract_mfcc(path)

            X.append(features)

            y.append(1)


# -----------------------------
# DATASET SUMMARY
# -----------------------------

print("Total audio processed:", len(X))

print("MFCC feature extraction completed.")

print("Example MFCC feature:", X[0])

print("Number of MFCC features:", len(X[0]))

print("Real voice samples:", y.count(0))

print("Fake voice samples:", y.count(1))


# -----------------------------
# SPLIT DATASET
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(

    X, y,

    test_size=0.2,

    random_state=42

)


# -----------------------------
# SVM MODEL
# -----------------------------

print("Training SVM model...")

svm_model = SVC(

    kernel="rbf",

    class_weight="balanced",

    probability=True

)

svm_model.fit(X_train, y_train)

svm_pred = svm_model.predict(X_test)

print("SVM Accuracy:", accuracy_score(y_test, svm_pred) * 100)

print("SVM Classification Report")

print(classification_report(y_test, svm_pred))


# -----------------------------
# RANDOM FOREST MODEL
# -----------------------------

print("Training Random Forest model...")

rf_model = RandomForestClassifier(

    n_estimators=100,

    class_weight="balanced",

    random_state=42

)

rf_model.fit(X_train, y_train)

rf_pred = rf_model.predict(X_test)

print("Random Forest Accuracy:", accuracy_score(y_test, rf_pred) * 100)

print("Random Forest Classification Report")

print(classification_report(y_test, rf_pred))


# -----------------------------
# SAVE MODELS
# -----------------------------

os.makedirs("model", exist_ok=True)

joblib.dump(svm_model, "model/svm_model.pkl")

joblib.dump(rf_model, "model/rf_model.pkl")

print("Models saved successfully.")