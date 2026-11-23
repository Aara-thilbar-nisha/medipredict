
import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Get the backend folder location automatically
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Dataset path
DATA_PATH = os.path.join(BASE_DIR, "data", "diabetes.csv")

# Model output folder
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
df = pd.read_csv(DATA_PATH)

df.columns = df.columns.str.lower()

# Replace invalid zero values with NaN
columns_with_zero_invalid = [
    'glucose', 'diastolic', 'triceps', 'insulin', 'bmi'
]

df[columns_with_zero_invalid] = df[columns_with_zero_invalid].replace(0, np.nan)

# Fill missing values using median
df.fillna(df.median(), inplace=True)

# Separate features and target
X = df.drop("diabetes", axis=1)
y = df["diabetes"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Feature scaling
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    min_samples_split=5,
    random_state=42
)

model.fit(X_train_scaled, y_train)

# Evaluate model
y_pred = model.predict(X_test_scaled)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save trained model and scaler
joblib.dump(model, os.path.join(MODEL_DIR, "model.pkl"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

print("Model & Scaler Saved Successfully!")
