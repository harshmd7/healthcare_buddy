import pandas as pd
import numpy as np
import os
import joblib

from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score
)
from sklearn.metrics import (
    accuracy_score,
    classification_report
)
from sklearn.feature_selection import VarianceThreshold
from sklearn.utils import shuffle

os.makedirs("models", exist_ok=True)

print("Loading dataset...")

df = pd.read_csv("healthcare_master_dataset.csv")

print(f"Original Shape: {df.shape}")

df.drop_duplicates(inplace=True)

df = shuffle(df, random_state=42)

df.fillna(0, inplace=True)

leakage_cols = [
    "symptom_count",
    "neurological_score",
    "infection_score",
    "respiratory_score",
    "gi_score",
    "pain_score",
    "comorbidity_count",
    "severity_score",
    "days_since_onset",
    "is_chronic",
    "is_acute",
    "fever_severity",
    "pain_severity",
    "high_risk_lifestyle"
]

existing_cols = [col for col in leakage_cols if col in df.columns]

df.drop(columns=existing_cols, inplace=True)

disease_counts = df["disease"].value_counts()

valid_diseases = disease_counts[disease_counts >= 500].index

df = df[df["disease"].isin(valid_diseases)]

if df["gender"].dtype == object:
    df["gender"] = df["gender"].map({
        "Male": 0,
        "Female": 1
    })

categorical_cols = []

for col in ["weight_category", "age_group"]:
    if col in df.columns:
        categorical_cols.append(col)

cat_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()

    df[col] = le.fit_transform(df[col].astype(str))

    cat_encoders[col] = le

target_encoder = LabelEncoder()

df["disease"] = target_encoder.fit_transform(df["disease"])

X = df.drop("disease", axis=1)

y = df["disease"]

selector = VarianceThreshold(threshold=0.02)

X_selected = selector.fit_transform(X)

selected_columns = X.columns[selector.get_support()]

X = pd.DataFrame(
    X_selected,
    columns=selected_columns
)

X = X.reset_index(drop=True)

y = y.reset_index(drop=True)

numeric_cols = X.select_dtypes(include=np.number).columns

noise_strength = 0.05

for col in numeric_cols:
    X[col] = X[col] + np.random.normal(
        0,
        noise_strength,
        size=len(X)
    )

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.30,
    stratify=y,
    random_state=42
)

print(f"Train Size: {len(X_train):,}")
print(f"Test Size : {len(X_test):,}")

model = HistGradientBoostingClassifier(
    learning_rate=0.03,
    max_depth=4,
    max_iter=80,
    min_samples_leaf=30,
    l2_regularization=2.0,
    max_bins=128,
    random_state=42
)

print("\nRunning Cross Validation...")

sample_size = min(120000, len(X))

sample_idx = np.random.choice(
    len(X),
    sample_size,
    replace=False
)

X_cv = X.iloc[sample_idx]

y_cv = y.iloc[sample_idx]

cv = StratifiedKFold(
    n_splits=3,
    shuffle=True,
    random_state=42
)

cv_scores = cross_val_score(
    model,
    X_cv,
    y_cv,
    cv=cv,
    scoring="accuracy",
    n_jobs=1
)

print("\nCV Scores:")
print(cv_scores)

print(f"\nMean CV Accuracy: {cv_scores.mean()*100:.2f}%")

print("\nTraining model...")

model.fit(X_train, y_train)

print("\nEvaluating model...")

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print(f"\nTest Accuracy: {accuracy*100:.2f}%")

print("\nClassification Report:\n")

print(classification_report(
    y_test,
    y_pred,
    target_names=target_encoder.classes_
))

joblib.dump(
    model,
    "models/disease_model.pkl"
)

joblib.dump(
    target_encoder,
    "models/label_encoder.pkl"
)

joblib.dump(
    selected_columns.tolist(),
    "models/columns.pkl"
)

joblib.dump(
    cat_encoders,
    "models/cat_encoders.pkl"
)

joblib.dump(
    selector,
    "models/variance_selector.pkl"
)

print("\nModel saved successfully!")