import joblib
import numpy as np

model = joblib.load("models/disease_model.pkl")
le = joblib.load("models/label_encoder.pkl")
columns = joblib.load("models/columns.pkl")
cat_encoders = joblib.load("models/cat_encoders.pkl")

def predict_disease(input_data: dict) -> str:
    """
    Takes a dict of feature values and returns predicted disease string.
    Handles categorical encoding for weight_category and age_group.
    """
    # Encode categorical fields using saved encoders
    for col, encoder in cat_encoders.items():
        if col in input_data:
            val = input_data[col]
            if isinstance(val, str):
                try:
                    input_data[col] = int(encoder.transform([val])[0])
                except Exception:
                    input_data[col] = 0

    # Build feature vector aligned to trained column order
    data = np.zeros(len(columns))
    for key, value in input_data.items():
        if key in columns:
            idx = columns.index(key)
            data[idx] = float(value)

    data = data.reshape(1, -1)
    pred = model.predict(data)[0]
    disease = le.inverse_transform([pred])[0]
    return disease


def predict_disease_top3(input_data: dict):
    """
    Same encoding/vector-building as predict_disease, but returns the
    top 3 most likely diseases with their confidence (probability), e.g.:
    [{"disease": "Dengue", "confidence": 0.72}, ...]
    """
    for col, encoder in cat_encoders.items():
        if col in input_data:
            val = input_data[col]
            if isinstance(val, str):
                try:
                    input_data[col] = int(encoder.transform([val])[0])
                except Exception:
                    input_data[col] = 0

    data = np.zeros(len(columns))
    for key, value in input_data.items():
        if key in columns:
            idx = columns.index(key)
            data[idx] = float(value)

    data = data.reshape(1, -1)
    probs = model.predict_proba(data)[0]

    top3_idx = np.argsort(probs)[::-1][:3]
    results = []
    for idx in top3_idx:
        disease_name = le.inverse_transform([idx])[0]
        results.append({
            "disease": disease_name,
            "confidence": round(float(probs[idx]), 4)
        })
    return results
