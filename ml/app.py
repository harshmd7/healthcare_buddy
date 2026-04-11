

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_disease

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    age: int
    gender: int
    bmi: float
    hypertension: int
    heart_disease: int
    smoking: int
    glucose_level: float
    blood_pressure: float
    chest_pain: int
    fatigue: int
    confusion: int
    memory_loss: int
    headache: int
    fever: int
    nausea: int
    dizziness: int
    weakness: int
    numbness: int
    vision_problems: int
    speech_problems: int
    personality_changes: int
    behavioral_problems: int
    skin_rash: int
    diarrhea: int
    constipation: int
    family_history: int
    symptom_count: int
    neurological_score: float
    infection_score: float
    cardiovascular_score: float
    bmi_category: int
    age_group: int
    high_glucose: int
    high_bp: int
    risk_score: float
    bmi_age_interaction: float
    glucose_bp_ratio: float
    is_elderly: int
    is_young: int
    obese: int
    underweight: int
    multi_comorbidity: int

@app.post("/predict")
def predict(data: PatientData):
    input_data = data.dict()
    disease = predict_disease(input_data)
    return {"disease": disease}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)