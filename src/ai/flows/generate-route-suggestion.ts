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
      'A detailed and helpful route suggestion considering the weather.'
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
  prompt: `You are an AI assistant providing travel advice. Based on the start and end locations, and the weather safety assessment, generate a helpful route suggestion.

  Journey Details:
  - Start: {{startLocation}}
  - End: {{endLocation}}

  Weather Assessment:
  - Safety Level: {{safetyBadge}}
  - Details: {{reasoning}}

  Your Suggestion:
  - If the safety level is 'Postpone', strongly advise against travel and explain why, referencing the hazardous conditions.
  - If 'Risky', suggest specific precautions (e.g., "drive slowly", "check for road closures", "pack an emergency kit") and mention safer alternative times if possible.
  - If 'Safe', provide a cheerful and encouraging message, perhaps suggesting scenic spots if applicable (be creative).
  - Do not provide turn-by-turn directions. Focus on high-level advice.
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
