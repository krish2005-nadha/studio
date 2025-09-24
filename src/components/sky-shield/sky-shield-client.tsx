'use client';

import { useState, useEffect } from 'react';
import type { FormSchema, WeatherData } from '@/app/schemas';
import { getSafetyAnalysis } from '@/app/actions';
import { WeatherForm } from '@/components/sky-shield/weather-form';
import { ResultSkeletons } from '@/components/sky-shield/loading-skeletons';
import { WeatherDisplay } from './weather-display';
import { SafetyAssessment } from './safety-assessment';
import { RoutePlanner } from './route-planner';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { ActionResult } from '@/app/schemas';

// This function is now defined inside the component to avoid hydration issues
// and is only called on the client side.
function getSimulatedWeatherData(): WeatherData {
  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
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

  return {
    temperature,
    rainProbability,
    windSpeed,
    forecast,
  };
}


export default function SkyShieldClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFormSubmit = async (values: FormSchema) => {
    setLoading(true);
    setResult(null);

    // Weather data is now simulated on the client side just before the API call
    const weatherData = getSimulatedWeatherData();

    try {
      const analysisResult = await getSafetyAnalysis(values, weatherData);
      setResult(analysisResult);
    } catch (error) {
      console.error("Failed to get safety analysis:", error);
      // Optionally, set an error state here to show a message to the user
    } finally {
      setLoading(false);
    }
  };
  
  if (!isMounted) {
    return <div className="container mx-auto p-4 md:p-8"><ResultSkeletons /></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
          Welcome to SkyShield
        </h2>
        <p className="mt-2 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          Planning a hike, a vacation, or a simple day out? Enter your destination and date, and our AI will analyze weather patterns to give you a personalized safety forecast. Know the likelihood of adverse conditions and travel with confidence.
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
                {result.route && <RoutePlanner data={result.route} safetyBadge={result.assessment.safetyBadge} />}
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
