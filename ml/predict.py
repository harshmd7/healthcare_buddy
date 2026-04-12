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
