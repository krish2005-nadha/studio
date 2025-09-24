'use server';

/**
 * @fileOverview Analyzes predicted weather conditions and provides a safety assessment for an event or journey.
 *
 * - generateSafetyAssessment - A function that handles the safety assessment process.
 * - GenerateSafetyAssessmentInput - The input type for the generateSafetyAssessment function.
 * - GenerateSafetyAssessmentOutput - The return type for the generateSafetyAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSafetyAssessmentInputSchema = z.object({
  temperature: z.number().describe('The temperature in Celsius.'),
  rainProbability: z.number().describe('The probability of rain (0-1).'),
  windSpeed: z.number().describe('The wind speed in km/h.'),
  forecast: z.string().describe('A textual weather forecast description.'),
});
export type GenerateSafetyAssessmentInput = z.infer<
  typeof GenerateSafetyAssessmentInputSchema
>;

const GenerateSafetyAssessmentOutputSchema = z.object({
  safetyBadge: z
    .enum(['Safe', 'Risky', 'Postpone'])
    .describe('The safety assessment badge.'),
  probabilityScore: z
    .number()
    .describe('The probability score of the safety assessment (0-1).'),
  reasoning: z.string().describe('The reasoning behind the safety assessment.'),
});
export type GenerateSafetyAssessmentOutput = z.infer<
  typeof GenerateSafetyAssessmentOutputSchema
>;

export async function generateSafetyAssessment(
  input: GenerateSafetyAssessmentInput
): Promise<GenerateSafetyAssessmentOutput> {
  return generateSafetyAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSafetyAssessmentPrompt',
  input: {schema: GenerateSafetyAssessmentInputSchema},
  output: {schema: GenerateSafetyAssessmentOutputSchema},
  prompt: `You are an AI safety assistant that analyzes weather conditions and provides a safety assessment for events or journeys.

  Based on the provided weather data, determine the safety of proceeding with the event or journey.
  Provide a safety badge (Safe, Risky, or Postpone) and a probability score (0-1) indicating the confidence level of the assessment.
  Also, provide a brief reasoning for the assessment.

  Weather Data:
  - Temperature: {{temperature}} Celsius
  - Rain Probability: {{rainProbability}}
  - Wind Speed: {{windSpeed}} km/h
  - Forecast: {{forecast}}

  Consider the following guidelines:
  - Safe: Low risk, weather conditions are favorable.
  - Risky: Moderate risk, weather conditions may pose some challenges.
  - Postpone: High risk, weather conditions are unfavorable and potentially dangerous.

  Ensure that the reasoning is clear and concise, explaining the factors that influenced the safety assessment and set the safetyBadge and probabilityScore output fields appropriately.
  `,
});

const generateSafetyAssessmentFlow = ai.defineFlow(
  {
    name: 'generateSafetyAssessmentFlow',
    inputSchema: GenerateSafetyAssessmentInputSchema,
    outputSchema: GenerateSafetyAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
