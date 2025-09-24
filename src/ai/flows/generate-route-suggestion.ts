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

const GenerateRouteSuggestionInputSchema = z.object({
  startLocation: z.string().describe('The starting location of the journey.'),
  endLocation: z.string().describe('The ending location of the journey.'),
  safetyBadge: z
    .enum(['Safe', 'Risky', 'Postpone'])
    .describe('The overall weather safety assessment.'),
  reasoning: z
    .string()
    .describe('The reasoning for the safety assessment.'),
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
  prompt: `You are an AI travel advisor providing route suggestions based on weather.

  **Journey Details:**
  - **Start:** {{startLocation}}
  - **End:** {{endLocation}}

  **Weather Assessment:**
  - **Safety Level:** {{safetyBadge}}
  - **Details:** {{reasoning}}

  **Your Task:**
  Generate a helpful, high-level route suggestion. **Do not provide turn-by-turn directions.** Focus on safety and weather-related advice. Use Markdown for emphasis.

  - If the safety level is **'Postpone'**, strongly advise against travel. Clearly explain the dangers based on the weather conditions (e.g., "**Travel is not recommended** due to a high risk of flash floods and dangerous winds.").
  - If **'Risky'**, suggest a cautious approach. Provide specific, actionable precautions (e.g., "Exercise caution. **Drive slowly** and maintain a safe following distance. Be prepared for **potential road closures** and consider packing an emergency kit with blankets and water."). Mention if alternative, safer travel times might exist.
  - If **'Safe'**, provide a positive and encouraging message. You can be creative and suggest scenic points of interest if applicable (e.g., "Conditions look great for your trip! Enjoy the clear skies. You might consider a brief stop at Vista Point for a beautiful view.").
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
