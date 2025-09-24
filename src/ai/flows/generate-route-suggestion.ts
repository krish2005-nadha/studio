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
  prompt: `You are an AI travel and weather expert. Your task is to provide a detailed, district-by-district route suggestion based on weather conditions.

  **Context:** The route between major cities often follows primary national highways. For example, the journey from Chennai to Coimbatore primarily uses NH 48 and NH 544, passing through key cities like Vellore, Krishnagiri, and Salem. Weather can vary significantly; Krishnagiri and Salem are often hot, while areas near Coimbatore can be rainy.

  **Journey Details:**
  - **Start:** {{startLocation}}
  - **End:** {{endLocation}}

  **Weather Assessments:**
  - **Start Point:** {{assessmentStart.safetyBadge}} (Reason: {{assessmentStart.reasoning}})
  - **End Point:** {{assessmentDestination.safetyBadge}} (Reason: '{{assessmentDestination.reasoning}}')
  - **Overall Recommendation:** {{overallSafetyBadge}}

  **Your Task:**
  Generate a helpful, high-level route suggestion with a focus on weather safety. Use your geographical knowledge to identify the main districts and cities the traveler will pass through along major highways. **Do not provide turn-by-turn directions.**

  - If the overall recommendation is **'Postpone'**, strongly advise against travel. Explain the dangers across the entire route, referencing specific districts. (e.g., "**Travel is not recommended.** You will face severe thunderstorms starting in the Vellore district and continuing past Salem.").
  - If **'Risky'**, advise caution and describe the changing conditions by district. Be specific. (e.g., "Exercise caution. The journey starts clear in {{startLocation}}, but you will likely encounter **heavy rain as you pass through Salem and Erode districts.** Roads there will be wet. Conditions should clear up as you approach {{endLocation}}.").
  - If **'Safe'**, provide an encouraging message describing the pleasant conditions across the key districts on the route. (e.g., "Conditions look great for your trip! Expect **clear skies and smooth travel** through Vellore, Krishnagiri, and Salem. Enjoy the journey!").

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
