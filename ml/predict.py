import joblib
import numpy as np

model = joblib.load("models/disease_model.pkl")
label_encoder = joblib.load("models/label_encoder.pkl")
columns = joblib.load("models/columns.pkl")
cat_encoders = joblib.load("models/cat_encoders.pkl")


def _encode_input(input_data: dict) -> np.ndarray:
    for col, encoder in cat_encoders.items():
        if col in input_data:
            try:
                input_data[col] = int(encoder.transform([str(input_data[col])])[0])
            except Exception:
                input_data[col] = 0

    data = np.zeros(len(columns))

    for key, value in input_data.items():
        if key in columns:
            idx = columns.index(key)
            data[idx] = float(value)

    return data.reshape(1, -1)


def predict_disease(input_data: dict) -> str:
    data = _encode_input(dict(input_data))
    pred = model.predict(data)[0]
    return label_encoder.inverse_transform([pred])[0]


def predict_disease_top3(input_data: dict):
    data = _encode_input(dict(input_data))

    if not hasattr(model, "predict_proba"):
        disease = predict_disease(input_data)
        return [{"disease": disease, "confidence": 1.0}]

    probs = model.predict_proba(data)[0]
    top3_idx = np.argsort(probs)[::-1][:3]

    results = []
    for idx in top3_idx:
        disease_name = label_encoder.inverse_transform([idx])[0]
        results.append(
            {
                "disease": disease_name,
                "confidence": round(float(probs[idx]), 4),
            }
        )
    return results