from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_disease

app = FastAPI(title="HealthBuddy ML API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    # Basic demographics
    age: int
    gender: int                         # 0=Male, 1=Female

    # Weight / lifestyle
    weight_category: int                # 0=normal,1=obese,2=overweight,3=underweight
    smoking: int
    alcohol_consumption: int
    recent_travel: int
    high_risk_lifestyle: int

    # Pre-existing conditions
    family_history: int
    pre_existing_diabetes: int
    pre_existing_hypertension: int
    pre_existing_heart_condition: int

    # Severity & onset
    days_since_onset: int
    pain_severity: int                  # 0-8
    fever_severity: int                 # 0-4
    severity_score: int                 # 1-10

    # --- Binary symptoms ---
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

    # --- Computed / derived scores ---
    symptom_count: int
    neurological_score: int
    infection_score: int
    respiratory_score: int
    gi_score: int
    pain_score: int
    comorbidity_count: int
    age_group: int                      # encoded: adult=0,child=1,middle_aged=2,senior=3,teen=4,young_adult=5
    is_chronic: int
    is_acute: int

@app.post("/predict")
def predict(data: PatientData):
    input_data = data.dict()
    disease = predict_disease(input_data)
    return {"disease": disease}

@app.get("/health")
def health():
    return {"status": "ok", "model": "RandomForest v2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
