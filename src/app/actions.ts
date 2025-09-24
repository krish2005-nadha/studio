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

type AnalysisResult<T> = {
  current: T;
  destination: T;
  overall: T;
};

type SingleAnalysisResult<T> = {
  current: T;
  destination: T;
}

export type ActionResult = {
  weather: SingleAnalysisResult<WeatherData>;
  assessment: AnalysisResult<GenerateSafetyAssessmentOutput>;
  summary: SingleAnalysisResult<SummarizeWeatherForecastOutput>;
  route?: string;
};

// Helper function to create a default/empty safety assessment
const createDefaultAssessment = (): GenerateSafetyAssessmentOutput => ({
  safetyBadge: 'Safe',
  probabilityScore: 1,
  reasoning: 'Default safe assessment.',
});


export async function getSafetyAnalysis(
  values: FormSchema,
  weatherDataCurrent: WeatherData,
  weatherDataDestination: WeatherData
): Promise<ActionResult> {
  const [assessmentCurrent, summaryCurrent, assessmentDestination, summaryDestination] = await Promise.all([
    generateSafetyAssessment({
      temperature: weatherDataCurrent.temperature,
      rainProbability: weatherDataCurrent.rainProbability,
      windSpeed: weatherDataCurrent.windSpeed,
      forecast: weatherDataCurrent.forecast,
    }),
    summarizeWeatherForecast({
      location: values.currentLocation,
      date: values.date.toLocaleDateString(),
      time: values.time,
      temperature: weatherDataCurrent.temperature,
      rainPercentage: Math.round(weatherDataCurrent.rainProbability * 100),
      windSpeed: weatherDataCurrent.windSpeed,
      forecast: weatherDataCurrent.forecast,
    }),
    generateSafetyAssessment({
      temperature: weatherDataDestination.temperature,
      rainProbability: weatherDataDestination.rainProbability,
      windSpeed: weatherDataDestination.windSpeed,
      forecast: weatherDataDestination.forecast,
    }),
    summarizeWeatherForecast({
      location: values.destination,
      date: values.date.toLocaleDateString(),
      time: values.time,
      temperature: weatherDataDestination.temperature,
      rainPercentage: Math.round(weatherDataDestination.rainProbability * 100),
      windSpeed: weatherDataDestination.windSpeed,
      forecast: weatherDataDestination.forecast,
    }),
  ]);

  const overallAssessment = assessmentCurrent.probabilityScore < assessmentDestination.probabilityScore ? assessmentCurrent : assessmentDestination;

  const routeSuggestionOutput = await generateRouteSuggestion({
      startLocation: values.currentLocation,
      endLocation: values.destination,
      safetyBadge: overallAssessment.safetyBadge,
      reasoning: `The overall safety is determined by the lower of the two location assessments. Current location: ${assessmentCurrent.safetyBadge}. Destination: ${assessmentDestination.safetyBadge}. Justification: ${overallAssessment.reasoning}`,
  });
  const route = routeSuggestionOutput.routeSuggestion;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    weather: {
      current: weatherDataCurrent,
      destination: weatherDataDestination,
    },
    assessment: {
      current: assessmentCurrent,
      destination: assessmentDestination,
      overall: overallAssessment,
    },
    summary: {
      current: summaryCurrent,
      destination: summaryDestination,
    },
    route,
  };
}
