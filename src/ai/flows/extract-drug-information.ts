'use server';

/**
 * @fileOverview An AI agent for extracting drug information from unstructured medical text.
 *
 * - extractDrugInformation - A function that handles the drug information extraction process.
 * - ExtractDrugInformationInput - The input type for the extractDrugInformation function.
 * - ExtractDrugInformationOutput - The return type for the extractDrugInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExtractDrugInformationInputSchema = z.object({
  medicalText: z
    .string()
    .describe('Unstructured medical text containing drug information.'),
});
export type ExtractDrugInformationInput = z.infer<typeof ExtractDrugInformationInputSchema>;

const ExtractDrugInformationOutputSchema = z.array(z.object({
  drugName: z.string().describe('The name of the drug.'),
  dosage: z.string().describe('The dosage of the drug.'),
  frequency: z.string().describe('The frequency of administration.'),
}));
export type ExtractDrugInformationOutput = z.infer<typeof ExtractDrugInformationOutputSchema>;

export async function extractDrugInformation(input: ExtractDrugInformationInput): Promise<ExtractDrugInformationOutput> {
  return extractDrugInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDrugInformationPrompt',
  input: {schema: ExtractDrugInformationInputSchema},
  output: {schema: ExtractDrugInformationOutputSchema},
  prompt: `You are an expert medical assistant. Your task is to extract drug name, dosage, and frequency from the given medical text. Return a JSON array of objects, where each object contains the drugName, dosage, and frequency.

Medical Text: {{{medicalText}}}`,
});

const extractDrugInformationFlow = ai.defineFlow(
  {
    name: 'extractDrugInformationFlow',
    inputSchema: ExtractDrugInformationInputSchema,
    outputSchema: ExtractDrugInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
