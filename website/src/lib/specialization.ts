// Maps each of the model's 11 disease classes to the specialization
// that should review a case predicting that disease.
export const DISEASE_SPECIALIZATION: Record<string, string> = {
  "Brain Stroke": "Neurologist",
  "Heart Disease": "Cardiologist",
  "COVID-19": "Pulmonologist",
  "Pneumonia": "Pulmonologist",
  "Tuberculosis": "Pulmonologist",
  "Dengue": "General Physician",
  "Alzheimer's Disease": "Neurologist",
  "Typhoid": "General Physician",
  "Malaria": "General Physician",
  "Diabetes": "Endocrinologist",
  "No Disease": "General Physician",
};

export function specializationFor(disease: string): string {
  return DISEASE_SPECIALIZATION[disease] ?? "General Physician";
}
