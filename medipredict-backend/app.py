from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import shap
import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
app = Flask(__name__)
CORS(app)
db = None
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate("key.json")  # Ensure correct path
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    print("Firebase Connected Successfully")

except Exception as e:
    print("Firebase Init Error:", e)

MODEL_PATH = os.path.join("models", "model.pkl")
SCALER_PATH = os.path.join("models", "scaler.pkl")
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
explainer = shap.TreeExplainer(model)
feature_names = ["Pregnancies", "Glucose", "Diastolic", "Triceps", "Insulin", "BMI", "DPF", "Age"]
feature_keys = ["pregnancies", "glucose", "diastolic", "triceps", "insulin", "bmi", "dpf", "age"]

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "API Online",
        "service": "MediPredict AI"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        input_values = []
        for key in feature_keys:
            val = data.get(key)

            if val == "" or val is None:
                val = 0

            input_values.append(float(val))

        features = np.array([input_values])
        scaled = scaler.transform(features)
        prediction = int(model.predict(scaled)[0])
        probabilities = model.predict_proba(scaled)[0]
        confidence = round(float(probabilities[prediction]) * 100, 2)

        result_label = "Diabetic" if prediction == 1 else "Non-Diabetic"

        shap_values = explainer.shap_values(scaled)

        if isinstance(shap_values, list):
            shap_impact = shap_values[1][0]
        elif len(shap_values.shape) == 3:
            shap_impact = shap_values[0, :, 1]
        else:
            shap_impact = shap_values[0]

        explanation = {
            feature_names[i]: round(float(shap_impact[i]), 4)
            for i in range(len(feature_names))
        }

        sorted_explanation = dict(
            sorted(explanation.items(), key=lambda x: abs(x[1]), reverse=True)
        )

        if db:
            try:
                doc_id = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")

                db.collection("predictions").document(doc_id).set({
                    "input": data,
                    "prediction": result_label,
                    "confidence": confidence,
                    "explanation": sorted_explanation,
                    "timestamp": datetime.utcnow()
                })

                print(f" Stored in Firebase with ID: {doc_id}")

            except Exception as fb_err:
                print(f" Firebase Write Error: {fb_err}")
        else:
            print("Firebase not initialized")

        return jsonify({
            "prediction": result_label,
            "confidence": confidence,
            "explanation": sorted_explanation
        })

    except Exception as e:
        print(f" INTERNAL SERVER ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True, port=5000)