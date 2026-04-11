import pandas as pd
import joblib
import os

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

os.makedirs("models", exist_ok=True)

# Load dataset
df = pd.read_csv("healthcare_master_dataset.csv")

# Fill missing values
df.fillna(0, inplace=True)

# Encode gender
df["gender"] = df["gender"].map({
    "Male": 0,
    "Female": 1
})

# Encode categorical columns
categorical_cols = ["bmi_category", "age_group"]

for col in categorical_cols:
    le_temp = LabelEncoder()
    df[col] = le_temp.fit_transform(df[col])

# Encode target disease
label_encoder = LabelEncoder()
df["disease"] = label_encoder.fit_transform(df["disease"])

# Features and target
X = df.drop("disease", axis=1)
y = df["disease"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    random_state=42
)
model.fit(X_train, y_train)

# Accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

# Save model files
joblib.dump(model, "models/disease_model.pkl")
joblib.dump(label_encoder, "models/label_encoder.pkl")
joblib.dump(X.columns.tolist(), "models/columns.pkl")

print("✅ Model trained and saved successfully!")