from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import joblib
import numpy as np
import os

app = FastAPI(
    title="HealthBuddy API",
    description="AI-powered disease prediction system",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

try:
    model = joblib.load(os.path.join(MODEL_DIR, "disease_model.pkl"))
    label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    columns = joblib.load(os.path.join(MODEL_DIR, "columns.pkl"))
    cat_encoders = joblib.load(os.path.join(MODEL_DIR, "cat_encoders.pkl"))
    print(f"Model loaded successfully with {len(columns)} features")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    label_encoder = None
    columns = []
    cat_encoders = {}


class PatientData(BaseModel):
    age: int
    gender: int
    weight_category: int
    smoking: int
    alcohol_consumption: int
    recent_travel: int
    family_history: int
    pre_existing_diabetes: int
    pre_existing_hypertension: int
    pre_existing_heart_condition: int
    fever: int
    chills: int
    headache: int
    fatigue: int
    weakness: int
    nausea: int
    vomiting: int
    diarrhea: int
    constipation: int
    chest_pain: int
    shortness_of_breath: int
    skin_rash: int
    joint_pain: int
    muscle_pain: int
    sore_throat: int
    cough: int
    runny_nose: int
    loss_of_appetite: int
    abdominal_pain: int
    confusion: int
    memory_loss: int
    dizziness: int
    numbness: int
    vision_problems: int
    speech_problems: int
    personality_changes: int
    behavioral_problems: int
    sweating: int
    loss_of_smell_taste: int
    swollen_lymph_nodes: int
    age_group: int
    days_since_onset: Optional[int] = None
    pain_severity: Optional[int] = None
    fever_severity: Optional[int] = None
    severity_score: Optional[int] = None


class TopPrediction(BaseModel):
    disease: str
    confidence: float


class PredictionResponse(BaseModel):
    success: bool
    disease: Optional[str] = None
    confidence: Optional[str] = None
    top3: Optional[List[TopPrediction]] = None
    message: Optional[str] = None
    error: Optional[str] = None


class HealthCheckResponse(BaseModel):
    model_config = {"protected_namespaces": ()}

    status: str
    model_loaded: bool
    features_count: int
    disease_classes: List[str]


def prepare_input(data: PatientData) -> np.ndarray:
    input_dict = data.model_dump()

    for col, encoder in cat_encoders.items():
        if col in input_dict:
            try:
                input_dict[col] = int(encoder.transform([str(input_dict[col])])[0])
            except Exception:
                input_dict[col] = 0

    feature_vector = np.zeros(len(columns))

    for key, value in input_dict.items():
        if key in columns:
            idx = columns.index(key)
            feature_vector[idx] = float(value)

    return feature_vector.reshape(1, -1)


def build_top3(model_output: np.ndarray) -> List[TopPrediction]:
    if not hasattr(model, "predict_proba"):
        return []

    probabilities = model_output[0]
    top3_indices = np.argsort(probabilities)[::-1][:3]

    top3: List[TopPrediction] = []
    for idx in top3_indices:
        top3.append(
            TopPrediction(
                disease=label_encoder.inverse_transform([idx])[0],
                confidence=round(float(probabilities[idx]), 4),
            )
        )
    return top3


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to HealthBuddy API",
        "version": "2.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"], response_model=HealthCheckResponse)
def health_check():
    disease_classes = []
    if label_encoder:
        disease_classes = label_encoder.classes_.tolist()

    return {
        "status": "healthy" if model else "degraded",
        "model_loaded": model is not None,
        "features_count": len(columns),
        "disease_classes": disease_classes,
    }


@app.post("/predict", tags=["Prediction"], response_model=PredictionResponse)
def predict(data: PatientData):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        features = prepare_input(data)
        prediction = model.predict(features)[0]
        disease = label_encoder.inverse_transform([prediction])[0]
        top3: List[TopPrediction] = []

        confidence = "high"
        if hasattr(model, "predict_proba"):
            try:
                probas = model.predict_proba(features)[0]
                top3 = build_top3(np.asarray([probas]))
                max_prob = max(probas)
                if max_prob > 0.8:
                    confidence = "very high"
                elif max_prob > 0.6:
                    confidence = "high"
                elif max_prob > 0.4:
                    confidence = "moderate"
                else:
                    confidence = "low"
            except Exception:
                pass

        classic_pneumonia = [
            data.fever,
            data.chills,
            data.cough,
            data.shortness_of_breath,
            data.chest_pain,
            data.weakness,
            data.fatigue,
            data.sweating,
            data.loss_of_appetite,
        ]
        if (
            data.days_since_onset is not None and data.days_since_onset < 7
            and sum(classic_pneumonia) >= 6
        ):
            disease = "Pneumonia"
            confidence = "override (rule-based)"

        return {
            "success": True,
            "disease": disease,
            "confidence": confidence,
            "top3": top3,
            "message": "Prediction completed successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/diseases", tags=["Information"])
def get_diseases():
    if not label_encoder:
        return {"diseases": [], "error": "Model not loaded"}

    return {
        "diseases": label_encoder.classes_.tolist(),
        "count": len(label_encoder.classes_),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)