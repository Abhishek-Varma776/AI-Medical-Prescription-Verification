'use server';

import {
  analyzeDrugInteractions,
  type DrugInteractionInput,
} from '@/ai/flows/drug-interaction-analysis';
import {
  getAgeSpecificDosage,
  type AgeSpecificDosageInput,
} from '@/ai/flows/age-specific-dosage';
import {
  suggestAlternativeMedication,
  type AlternativeMedicationInput,
} from '@/ai/flows/alternative-medication';
import {
  extractDrugInformation,
  type ExtractDrugInformationInput,
} from '@/ai/flows/extract-drug-information';

export async function getDrugInteractionReport(input: DrugInteractionInput) {
  try {
    const result = await analyzeDrugInteractions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to analyze drug interactions.' };
  }
}

export async function getDosageRecommendation(input: AgeSpecificDosageInput) {
  try {
    const result = await getAgeSpecificDosage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to get dosage recommendation.',
    };
  }
}

export async function getAlternativeMedication(
  input: AlternativeMedicationInput
) {
  try {
    const result = await suggestAlternativeMedication(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to suggest alternative medications.',
    };
  }
}

export async function getExtractedDrugInfo(
  input: ExtractDrugInformationInput
) {
  try {
    const result = await extractDrugInformation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to extract drug information.' };
  }
}
