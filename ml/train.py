import pandas as pd
import joblib
import os

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

os.makedirs("models", exist_ok=True)

print("📂 Loading dataset...")
df = pd.read_csv("healthcare_master_dataset.csv")
print(f"   Loaded {len(df):,} rows × {len(df.columns)} columns")

# Fill missing values
df.fillna(0, inplace=True)

# Encode gender: Male=0, Female=1
df["gender"] = df["gender"].map({"Male": 0, "Female": 1})

# Encode categorical columns and save their encoders
categorical_cols = ["weight_category", "age_group"]
label_encoders_cat = {}

for col in categorical_cols:
    le_temp = LabelEncoder()
    df[col] = le_temp.fit_transform(df[col])
    label_encoders_cat[col] = le_temp
    print(f"   Encoded '{col}': {dict(zip(le_temp.classes_, le_temp.transform(le_temp.classes_)))}")

# Encode target
label_encoder = LabelEncoder()
df["disease"] = label_encoder.fit_transform(df["disease"])
print(f"\n🎯 Disease classes: {label_encoder.classes_.tolist()}")

# Features and target
X = df.drop("disease", axis=1)
y = df["disease"]
print(f"\n📊 Features: {len(X.columns)} columns")
print(f"   Columns: {X.columns.tolist()}")

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\n✂️  Train: {len(X_train):,} | Test: {len(X_test):,}")

# Train model
print("\n🌲 Training RandomForest (300 trees, max_depth=15)...")
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Save model files
joblib.dump(model, "models/disease_model.pkl")
joblib.dump(label_encoder, "models/label_encoder.pkl")
joblib.dump(X.columns.tolist(), "models/columns.pkl")
joblib.dump(label_encoders_cat, "models/cat_encoders.pkl")

print("\n✅ Model trained and saved successfully!")
print("   models/disease_model.pkl")
print("   models/label_encoder.pkl")
print("   models/columns.pkl")
print("   models/cat_encoders.pkl")


