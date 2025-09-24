'use server';

import type { LocationFormSchema, RouteFormSchema } from '@/app/schemas';
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

// --- Types for Location Analysis ---
export type LocationAnalysisResult = {
  weather: WeatherData;
  assessment: GenerateSafetyAssessmentOutput;
  summary: SummarizeWeatherForecastOutput;
};

// --- Types for Route Analysis ---
type RouteAnalysis<T> = {
  start: T;
  destination: T;
  overall: T;
};

type SingleRouteAnalysis<T> = {
  start: T;
  destination: T;
}

export type RouteAnalysisResult = {
  weather: SingleRouteAnalysis<WeatherData>;
  assessment: RouteAnalysis<GenerateSafetyAssessmentOutput>;
  summary: SingleRouteAnalysis<SummarizeWeatherForecastOutput>;
  routeSuggestion: string;
};

/**
 * Generates a safety analysis for a single location.
 */
export async function getLocationAnalysis(
  values: LocationFormSchema,
  weatherData: WeatherData
): Promise<LocationAnalysisResult> {
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

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    weather: weatherData,
    assessment: assessment,
    summary: summary,
  };
}


/**
 * Generates a safety analysis and route suggestion for a journey.
 */
export async function getRouteAnalysis(
  values: RouteFormSchema,
  weatherDataStart: WeatherData,
  weatherDataDestination: WeatherData
): Promise<RouteAnalysisResult> {
  const [assessmentStart, summaryStart, assessmentDestination, summaryDestination] = await Promise.all([
    generateSafetyAssessment({
      temperature: weatherDataStart.temperature,
      rainProbability: weatherDataStart.rainProbability,
      windSpeed: weatherDataStart.windSpeed,
      forecast: weatherDataStart.forecast,
    }),
    summarizeWeatherForecast({
      location: values.startLocation,
      date: values.date.toLocaleDateString(),
      time: values.time,
      temperature: weatherDataStart.temperature,
      rainPercentage: Math.round(weatherDataStart.rainProbability * 100),
      windSpeed: weatherDataStart.windSpeed,
      forecast: weatherDataStart.forecast,
    }),
    generateSafetyAssessment({
      temperature: weatherDataDestination.temperature,
      rainProbability: weatherDataDestination.rainProbability,
      windSpeed: weatherDataDestination.windSpeed,
      forecast: weatherDataDestination.forecast,
    }),
    summarizeWeatherForecast({
      location: values.endLocation,
      date: values.date.toLocaleDateString(),
      time: values.time,
      temperature: weatherDataDestination.temperature,
      rainPercentage: Math.round(weatherDataDestination.rainProbability * 100),
      windSpeed: weatherDataDestination.windSpeed,
      forecast: weatherDataDestination.forecast,
    }),
  ]);

  const overallAssessment = assessmentStart.probabilityScore < assessmentDestination.probabilityScore ? assessmentStart : assessmentDestination;

  const routeSuggestionOutput = await generateRouteSuggestion({
      startLocation: values.startLocation,
      endLocation: values.endLocation,
      safetyBadge: overallAssessment.safetyBadge,
      reasoning: `The overall safety is determined by the lower of the two location assessments. Start: ${assessmentStart.safetyBadge}. Destination: ${assessmentDestination.safetyBadge}. Justification: ${overallAssessment.reasoning}`,
  });
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    weather: {
      start: weatherDataStart,
      destination: weatherDataDestination,
    },
    assessment: {
      start: assessmentStart,
      destination: assessmentDestination,
      overall: overallAssessment,
    },
    summary: {
      start: summaryStart,
      destination: summaryDestination,
    },
    routeSuggestion: routeSuggestionOutput.routeSuggestion,
  };
}
