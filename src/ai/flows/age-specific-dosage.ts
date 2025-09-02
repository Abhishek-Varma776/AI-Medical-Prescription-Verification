'use server';

/**
 * @fileOverview An AI agent to recommend drug dosages based on patient age, renal function, and drug safety profiles.
 *
 * - getAgeSpecificDosage - A function that handles the dosage recommendation process.
 * - AgeSpecificDosageInput - The input type for the getAgeSpecificDosage function.
 * - AgeSpecificDosageOutput - The return type for the getAgeSpecificDosage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgeSpecificDosageInputSchema = z.object({
  drugName: z.string().describe('The name of the drug.'),
  patientAge: z.number().describe('The age of the patient in years.'),
  renalFunction: z
    .string()
    .describe(
      'The patient’s renal function, described as normal, mild, moderate, or severe impairment.'
    ),
  otherConditions: z
    .string()
    .optional()
    .describe('Any other conditions the patient may have.'),
});
export type AgeSpecificDosageInput = z.infer<typeof AgeSpecificDosageInputSchema>;

const AgeSpecificDosageOutputSchema = z.object({
  recommendedDosage: z
    .string()
    .describe('The recommended dosage of the drug for the patient.'),
  dosageJustification: z
    .string()
    .describe(
      'A detailed justification for the dosage recommendation based on the patient’s age, renal function, and drug safety profile.'
    ),
  renalDosingGuidance: z
    .string()
    .optional()
    .describe(
      'Specific guidance on adjusting the dosage based on renal function, if applicable.'
    ),
});
export type AgeSpecificDosageOutput = z.infer<typeof AgeSpecificDosageOutputSchema>;

export async function getAgeSpecificDosage(
  input: AgeSpecificDosageInput
): Promise<AgeSpecificDosageOutput> {
  return ageSpecificDosageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ageSpecificDosagePrompt',
  input: {schema: AgeSpecificDosageInputSchema},
  output: {schema: AgeSpecificDosageOutputSchema},
  prompt: `You are an expert pharmacist specializing in dosage recommendations for various patient populations.

  Based on the drug name, patient age, renal function, and other conditions, provide a dosage recommendation and a detailed justification.

  Drug Name: {{{drugName}}}
  Patient Age: {{{patientAge}}} years
  Renal Function: {{{renalFunction}}}
  Other Conditions: {{{otherConditions}}}

  Please provide the recommended dosage, a detailed justification, and any specific renal dosing guidance if applicable.
  Format the dosage as a number followed by the units. E.g. "10mg".
  `,
});

const ageSpecificDosageFlow = ai.defineFlow(
  {
    name: 'ageSpecificDosageFlow',
    inputSchema: AgeSpecificDosageInputSchema,
    outputSchema: AgeSpecificDosageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
