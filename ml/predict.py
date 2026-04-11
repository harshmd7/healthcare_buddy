import joblib
import numpy as np

model = joblib.load("models/disease_model.pkl")
le = joblib.load("models/label_encoder.pkl")
columns = joblib.load("models/columns.pkl")

def predict_disease(input_data):
    data = np.zeros(len(columns))

    for key, value in input_data.items():
        if key in columns:
            idx = columns.index(key)
            data[idx] = value

    data = data.reshape(1, -1)

    pred = model.predict(data)[0]
    disease = le.inverse_transform([pred])[0]

    return disease