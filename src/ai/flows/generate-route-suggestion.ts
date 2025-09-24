'use server';

/**
 * @fileOverview Provides AI-powered route suggestions based on weather conditions.
 *
 * - generateRouteSuggestion - A function that handles the route suggestion process.
 * - GenerateRouteSuggestionInput - The input type for the generateRouteSuggestion function.
 * - GenerateRouteSuggestionOutput - The return type for the generateRouteSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {GenerateSafetyAssessmentOutput} from './generate-safety-assessment';

const GenerateRouteSuggestionInputSchema = z.object({
  startLocation: z.string().describe('The starting location of the journey.'),
  endLocation: z.string().describe('The ending location of the journey.'),
  assessmentStart: z.custom<GenerateSafetyAssessmentOutput>(),
  assessmentDestination: z.custom<GenerateSafetyAssessmentOutput>(),
  overallSafetyBadge: z
    .enum(['Safe', 'Risky', 'Postpone'])
    .describe('The overall weather safety assessment for the entire journey.'),
});
export type GenerateRouteSuggestionInput = z.infer<
  typeof GenerateRouteSuggestionInputSchema
>;

const GenerateRouteSuggestionOutputSchema = z.object({
  routeSuggestion: z
    .string()
    .describe(
      'A detailed and helpful route suggestion considering the weather. Use Markdown for formatting, such as bolding key advice.'
    ),
});
export type GenerateRouteSuggestionOutput = z.infer<
  typeof GenerateRouteSuggestionOutputSchema
>;

export async function generateRouteSuggestion(
  input: GenerateRouteSuggestionInput
): Promise<GenerateRouteSuggestionOutput> {
  return generateRouteSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRouteSuggestionPrompt',
  input: {schema: GenerateRouteSuggestionInputSchema},
  output: {schema: GenerateRouteSuggestionOutputSchema},
  prompt: `You are an AI travel and weather expert. Your task is to provide a detailed, district-by-district route suggestion based on weather conditions. Use your geographical knowledge to identify the main districts or regions between the start and end locations.

  **Journey Details:**
  - **Start:** {{startLocation}}
  - **End:** {{endLocation}}

  **Weather Assessments:**
  - **Start Point:** {{assessmentStart.safetyBadge}} (Reason: {{assessmentStart.reasoning}})
  - **End Point:** {{assessmentDestination.safetyBadge}} (Reason: '{{assessmentDestination.reasoning}}')
  - **Overall Recommendation:** {{overallSafetyBadge}}

  **Your Task:**
  Generate a helpful, high-level route suggestion with a focus on weather safety. **Do not provide turn-by-turn directions.** Instead, break down the journey into the key districts or areas the traveler will pass through. For each district, infer the likely weather conditions based on the start and end point data.

  - If the overall recommendation is **'Postpone'**, strongly advise against travel. Explain the dangers across the entire route, mentioning specific districts if possible (e.g., "**Travel is not recommended.** You will face severe thunderstorms starting in the Chengalpattu district and continuing all the way to your destination.").
  - If **'Risky'**, advise caution and describe the changing conditions. Be specific about districts. For example, "Exercise caution. The journey starts clear in {{startLocation}}, but you will likely encounter **heavy rain as you pass through the Villupuram and Kallakurichi districts.** Roads there will be wet. Conditions should clear up again as you approach {{endLocation}}."
  - If **'Safe'**, provide an encouraging message describing the pleasant conditions across the districts. For example, "Conditions look great for your trip! Expect **clear skies and smooth travel** through the districts of Kanchipuram, Tindivanam, and beyond. Enjoy the journey!"

  Use Markdown for emphasis.
  `,
});

const generateRouteSuggestionFlow = ai.defineFlow(
  {
    name: 'generateRouteSuggestionFlow',
    inputSchema: GenerateRouteSuggestionInputSchema,
    outputSchema: GenerateRouteSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
