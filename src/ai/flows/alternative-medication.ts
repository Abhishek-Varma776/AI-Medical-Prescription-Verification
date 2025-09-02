'use server';

/**
 * @fileOverview Suggests alternative medications based on potential interactions or contraindications for a given patient profile.
 *
 * - suggestAlternativeMedication - A function that suggests alternative medications.
 * - AlternativeMedicationInput - The input type for the suggestAlternativeMedication function.
 * - AlternativeMedicationOutput - The return type for the suggestAlternativeMedication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlternativeMedicationInputSchema = z.object({
  patientProfile: z
    .string()
    .describe('The patient profile including age, renal function, and other relevant medical history.'),
  medications: z.array(z.string()).describe('A list of medications the patient is currently taking.'),
  interactionDetails: z
    .string()
    .describe(
      'Details of the potential harmful interactions or contraindications identified for the medications.'
    ),
});
export type AlternativeMedicationInput = z.infer<typeof AlternativeMedicationInputSchema>;

const AlternativeMedicationOutputSchema = z.object({
  suggestedAlternatives: z
    .array(z.string())
    .describe(
      'A list of suggested alternative medications that are safer given the patient profile and interaction details.'
    ),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested alternatives, explaining why they are safer.'),
});
export type AlternativeMedicationOutput = z.infer<typeof AlternativeMedicationOutputSchema>;

export async function suggestAlternativeMedication(
  input: AlternativeMedicationInput
): Promise<AlternativeMedicationOutput> {
  return suggestAlternativeMedicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'alternativeMedicationPrompt',
  input: {schema: AlternativeMedicationInputSchema},
  output: {schema: AlternativeMedicationOutputSchema},
  prompt: `You are an expert pharmacist providing alternative medication suggestions.

  Based on the patient's profile: {{{patientProfile}}},
  current medications: {{#each medications}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}},
  and the following interaction details: {{{interactionDetails}}},

  suggest alternative medications that are safer for the patient. Explain your reasoning.

  Format your response as:
  {
    "suggestedAlternatives": ["Alternative 1", "Alternative 2"],
    "reasoning": "Explanation of why these alternatives are safer."
  }`,
});

const suggestAlternativeMedicationFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeMedicationFlow',
    inputSchema: AlternativeMedicationInputSchema,
    outputSchema: AlternativeMedicationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
