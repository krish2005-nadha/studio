
'use server';

import type { FormSchema } from '@/app/schemas';
import type { WeatherData } from '@/app/schemas';
import {
  generateSafetyAssessment,
  GenerateSafetyAssessmentOutput,
} from '@/ai/flows/generate-safety-assessment';
import {
  summarizeWeatherForecast,
  SummarizeWeatherForecastOutput,
} from '@/ai/flows/summarize-weather-forecast';
import {
  generateRouteSuggestion
} from '@/ai/flows/generate-route-suggestion';


export type ActionResult = {
  weather: WeatherData;
  assessment: GenerateSafetyAssessmentOutput;
  summary: SummarizeWeatherForecastOutput;
  route?: string;
};

export async function getSafetyAnalysis(
  values: FormSchema,
  weatherData: WeatherData
): Promise<ActionResult> {
  const [assessment, summary] = await Promise.all([
    generateSafetyAssessment({
      temperature: weatherData.temperature,
      rainProbability: weatherData.rainProbability,
      windSpeed: weatherData.windSpeed,
      forecast: weatherData.forecast,
    }),
    summarizeWeatherForecast({
      location: values.location,
      date: values.date.toLocaleDateString(),
      time: values.time,
      temperature: weatherData.temperature,
      rainPercentage: Math.round(weatherData.rainProbability * 100),
      windSpeed: weatherData.windSpeed,
      forecast: weatherData.forecast,
    }),
  ]);

  let route: string | undefined = undefined;
  if (values.startLocation && values.endLocation) {
    const routeSuggestionOutput = await generateRouteSuggestion({
        startLocation: values.startLocation,
        endLocation: values.endLocation,
        safetyBadge: assessment.safetyBadge,
        reasoning: assessment.reasoning,
    });
    route = routeSuggestionOutput.routeSuggestion;
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { weather: weatherData, assessment, summary, route };
}
