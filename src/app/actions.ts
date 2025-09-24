
'use server';

import type { FormSchema, WeatherData } from '@/app/schemas';
import {
  generateSafetyAssessment,
  GenerateSafetyAssessmentOutput,
} from '@/ai/flows/generate-safety-assessment';
import {
  summarizeWeatherForecast,
  SummarizeWeatherForecastOutput,
} from '@/ai/flows/summarize-weather-forecast';
import { z } from 'zod';
import { formSchema } from '@/app/schemas';


export type ActionResult = {
  weather: WeatherData;
  assessment: GenerateSafetyAssessmentOutput;
  summary: SummarizeWeatherForecastOutput;
  route?: string;
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    if (assessment.safetyBadge === 'Postpone') {
      route = `Travel from ${values.startLocation} to ${values.endLocation} is not recommended due to hazardous weather conditions.`;
    } else if (assessment.safetyBadge === 'Risky') {
      route = `Exercise caution when traveling from ${values.startLocation} to ${values.endLocation}. ${assessment.reasoning}`;
    } else {
      route = `The route from ${values.startLocation} to ${values.endLocation} looks clear. Enjoy your journey!`;
    }
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { weather: weatherData, assessment, summary, route };
}
