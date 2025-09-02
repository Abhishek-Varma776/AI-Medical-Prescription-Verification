export type PatientProfile = {
  age?: number;
  sex?: 'male' | 'female' | 'other';
  weight?: number; // in kg
  renalFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
  otherConditions?: string;
};
