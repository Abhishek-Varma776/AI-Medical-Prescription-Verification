'use server';

/**
 * @fileOverview A drug interaction analysis AI agent.
 *
 * - analyzeDrugInteractions - A function that analyzes potential harmful interactions between multiple drugs.
 * - DrugInteractionInput - The input type for the analyzeDrugInteractions function.
 * - DrugInteractionOutput - The return type for the analyzeDrugInteractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrugInteractionInputSchema = z.object({
  patientDetails: z
    .string()
    .describe('Details of the patient including age, sex, weight, and renal function.'),
  drugList: z
    .string()
    .describe('A comma separated list of drugs the patient is taking.'),
});
export type DrugInteractionInput = z.infer<typeof DrugInteractionInputSchema>;

const DrugInteractionOutputSchema = z.object({
  interactionReport: z
    .string()
    .describe('A report detailing potential harmful interactions between the listed drugs, and recommendations.'),
});
export type DrugInteractionOutput = z.infer<typeof DrugInteractionOutputSchema>;

export async function analyzeDrugInteractions(input: DrugInteractionInput): Promise<DrugInteractionOutput> {
  return drugInteractionAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugInteractionAnalysisPrompt',
  input: {schema: DrugInteractionInputSchema},
  output: {schema: DrugInteractionOutputSchema},
  prompt: `You are a clinical pharmacist expert in drug interactions.

You will receive a list of drugs that a patient is taking, along with patient details. You will use this information to identify any potential harmful interactions between the drugs, in the context of the specific patient. Provide an interaction report which includes specific, actionable recommendations.

Patient Details: {{{patientDetails}}}
Drug List: {{{drugList}}}`,
});

const drugInteractionAnalysisFlow = ai.defineFlow(
  {
    name: 'drugInteractionAnalysisFlow',
    inputSchema: DrugInteractionInputSchema,
    outputSchema: DrugInteractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
