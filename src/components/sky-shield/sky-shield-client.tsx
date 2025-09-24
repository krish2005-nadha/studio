'use client';

import { useState, useEffect } from 'react';
import type { ActionResult } from '@/app/actions';
import { getSafetyAnalysis } from '@/app/actions';
import { WeatherForm } from '@/components/sky-shield/weather-form';
import { ResultSkeletons } from '@/components/sky-shield/loading-skeletons';
import { WeatherDisplay } from './weather-display';
import { SafetyAssessment } from './safety-assessment';
import { RoutePlanner } from './route-planner';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { FormSchema, WeatherData } from '@/app/schemas';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SkyShieldClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  const handleFormSubmit = async (values: FormSchema) => {
    setLoading(true);
    setResult(null);

    // Simulate weather prediction on the client
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

    const analysisResult = await getSafetyAnalysis(values, weatherData);
    setResult(analysisResult);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
          AI Weather Safety Planner
        </h2>
        <p className="mt-2 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
          Enter your event or journey details to get an instant, AI-powered weather safety assessment.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8 xl:gap-12">
        <div className="lg:col-span-2 mb-8 lg:mb-0">
          <div className="sticky top-20">
            <WeatherForm onSubmit={handleFormSubmit} isLoading={loading} />
          </div>
        </div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResultSkeletons />
              </motion.div>
            )}
            {result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="space-y-6"
              >
                <WeatherDisplay data={result.weather} summary={result.summary} />
                <SafetyAssessment data={result.assessment} />
                {result.route && <RoutePlanner data={result.route} />}
              </motion.div>
            )}
            {!loading && !result && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] bg-card border-2 border-dashed rounded-lg"
              >
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <MapPin className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Your forecast awaits</h3>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form to see your personalized weather safety report.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
