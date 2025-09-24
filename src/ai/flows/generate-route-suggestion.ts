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
import type { GenerateSafetyAssessmentOutput } from './generate-safety-assessment';

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
  prompt: `You are an AI travel advisor providing route suggestions based on weather. Your primary task is to analyze the weather at the start and end points and infer the conditions for the area *between* them.

  **Journey Details:**
  - **Start:** {{startLocation}}
  - **End:** {{endLocation}}

  **Weather Assessments:**
  - **Start Point:** {{assessmentStart.safetyBadge}} (Reason: {{assessmentStart.reasoning}})
  - **End Point:** {{assessmentDestination.safetyBadge}} (Reason: {{assessmentDestination.reasoning}})
  - **Overall Recommendation:** {{overallSafetyBadge}}

  **Your Task:**
  Generate a helpful, high-level route suggestion. **Do not provide turn-by-turn directions.** Focus on safety and weather-related advice for the entire journey, including the areas between the start and destination. Use your geographical knowledge to infer conditions along the route. Use Markdown for emphasis.

  - If the overall recommendation is **'Postpone'**, strongly advise against travel. Clearly explain the dangers (e.g., "**Travel is not recommended.** The entire region is experiencing severe thunderstorms, and there is a high risk of flash floods along the route.").
  - If **'Risky'**, advise caution and describe what the traveler can expect. For example, "Exercise caution. You will be driving out of clear skies in {{startLocation}} and into a rainy area as you approach {{endLocation}}. **Expect wet roads** for the second half of your journey. **Drive slowly** and be prepared for potential delays."
  - If **'Safe'**, provide a positive and encouraging message about the entire trip. For example, "Conditions look great for your trip! Expect **clear skies and smooth travel** from {{startLocation}} all the way to {{endLocation}}. Enjoy the journey!"
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
