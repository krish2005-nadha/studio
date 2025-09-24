// Summarize the weather forecast based on predicted weather conditions.

'use server';

/**
 * @fileOverview Summarizes a weather forecast.
 *
 * - summarizeWeatherForecast - A function that summarizes the weather forecast.
 * - SummarizeWeatherForecastInput - The input type for the summarizeWeatherForecast function.
 * - SummarizeWeatherForecastOutput - The return type for the summarizeWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location for the weather forecast.'),
  date: z.string().describe('The date for the weather forecast.'),
  time: z.string().describe('The time for the weather forecast.'),
  temperature: z.number().describe('The temperature in Celsius.'),
  rainPercentage: z.number().describe('The probability of rain (0-100).'),
  windSpeed: z.number().describe('The wind speed in km/h.'),
  forecast: z.string().describe('A detailed weather forecast description.'),
});
export type SummarizeWeatherForecastInput = z.infer<
  typeof SummarizeWeatherForecastInputSchema
>;

const SummarizeWeatherForecastOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the weather forecast.'),
});
export type SummarizeWeatherForecastOutput = z.infer<
  typeof SummarizeWeatherForecastOutputSchema
>;

export async function summarizeWeatherForecast(
  input: SummarizeWeatherForecastInput
): Promise<SummarizeWeatherForecastOutput> {
  return summarizeWeatherForecastFlow(input);
}

const summarizeWeatherForecastPrompt = ai.definePrompt({
  name: 'summarizeWeatherForecastPrompt',
  input: {schema: SummarizeWeatherForecastInputSchema},
  output: {schema: SummarizeWeatherForecastOutputSchema},
  prompt: `Summarize the weather forecast for {{location}} on {{date}} at {{time}}.\

  The temperature will be {{temperature}}°C, with a {{rainPercentage}}% chance of rain and wind speeds of {{windSpeed}} km/h.\

  Detailed forecast: {{forecast}}

  Provide a concise summary highlighting key conditions.`,
});

const summarizeWeatherForecastFlow = ai.defineFlow(
  {
    name: 'summarizeWeatherForecastFlow',
    inputSchema: SummarizeWeatherForecastInputSchema,
    outputSchema: SummarizeWeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await summarizeWeatherForecastPrompt(input);
    return output!;
  }
);
