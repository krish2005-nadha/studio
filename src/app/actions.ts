
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
  values: FormSchema
): Promise<ActionResult> {
  // Simulate weather prediction
  const temperature = getRandomInt(-5, 35);
  const rainProbability = Math.random();
  const windSpeed = getRandomInt(0, 100);

  let forecast = 'Clear skies.';
  if (rainProbability > 0.7) {
    forecast = 'Heavy rain and thunderstorms expected.';
  } else if (rainProbability > 0.3) {
    forecast = 'Chance of scattered showers.';
  }
  if (windSpeed > 50) {
    forecast += ' Strong winds are likely.';
  } else if (windSpeed > 20) {
    forecast += ' A bit breezy.';
  }
  if (temperature < 0) {
    forecast += ' Freezing temperatures.';
  } else if (temperature > 30) {
    forecast += ' Very hot day.';
  }

  const weatherData: WeatherData = {
    temperature,
    rainProbability,
    windSpeed,
    forecast,
  };

  const [assessment, summary] = await Promise.all([
    generateSafetyAssessment({
      temperature,
      rainProbability,
      windSpeed,
      forecast,
    }),
    summarizeWeatherForecast({
      location: values.location,
      date: values.date.toLocaleDateString(),
      time: values.time,
      temperature,
      rainPercentage: Math.round(rainProbability * 100),
      windSpeed,
      forecast,
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
