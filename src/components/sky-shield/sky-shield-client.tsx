'use client';

import { useState, useEffect } from 'react';
import type { LocationFormSchema, RouteFormSchema, WeatherData } from '@/app/schemas';
import { getLocationAnalysis, getRouteAnalysis } from '@/app/actions';
import { WeatherForm } from '@/components/sky-shield/weather-form';
import { ResultSkeletons } from '@/components/sky-shield/loading-skeletons';
import { WeatherDisplay } from './weather-display';
import { SafetyAssessment } from './safety-assessment';
import { RoutePlanner } from './route-planner';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { LocationAnalysisResult, RouteAnalysisResult } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// This function simulates weather data and is called on the client side.
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
  const [locationResult, setLocationResult] = useState<LocationAnalysisResult | null>(null);
  const [routeResult, setRouteResult] = useState<RouteAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('location');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLocationSubmit = async (values: LocationFormSchema) => {
    setLoading(true);
    setLocationResult(null);

    const weatherData = getSimulatedWeatherData();

    try {
      const analysisResult = await getLocationAnalysis(values, weatherData);
      setLocationResult(analysisResult);
    } catch (error) {
      console.error("Failed to get location analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (values: RouteFormSchema) => {
    setLoading(true);
    setRouteResult(null);

    const weatherDataStart = getSimulatedWeatherData();
    const weatherDataDestination = getSimulatedWeatherData();

    try {
      const analysisResult = await getRouteAnalysis(values, weatherDataStart, weatherDataDestination);
      setRouteResult(analysisResult);
    } catch (error) {
      console.error("Failed to get route analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const onTabChange = (value: string) => {
    setActiveTab(value);
    // Clear results when switching tabs
    setLocationResult(null);
    setRouteResult(null);
  }
  
  if (!isMounted) {
    return <div className="container mx-auto p-4 md:p-8"><ResultSkeletons /></div>;
  }

  const renderPlaceholder = () => (
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
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
          Welcome to "Will It Rain On My Pride?"
        </h2>
        <p className="mt-2 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
         Whether you're marching, celebrating, or just enjoying the day, get a personalized AI weather forecast for your Pride event. Choose "Location" for a single spot, or "Route" to plan your journey between two points.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="location">Location Analysis</TabsTrigger>
          <TabsTrigger value="route">Route Planner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="location">
          <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              <div className="sticky top-20">
                <WeatherForm 
                  formType="location"
                  onSubmit={handleLocationSubmit} 
                  isLoading={loading} 
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {loading && <motion.div key="loader-loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><ResultSkeletons /></motion.div>}
                {locationResult && (
                  <motion.div key="results-loc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="space-y-6">
                    <WeatherDisplay title="Location Analysis" data={locationResult.weather} summary={locationResult.summary} />
                    <SafetyAssessment data={locationResult.assessment} />
                  </motion.div>
                )}
                {!loading && !locationResult && renderPlaceholder()}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="route">
           <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              <div className="sticky top-20">
                <WeatherForm 
                  formType="route"
                  onSubmit={handleRouteSubmit} 
                  isLoading={loading} 
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {loading && <motion.div key="loader-route" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><ResultSkeletons /></motion.div>}
                {routeResult && (
                  <motion.div key="results-route" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="space-y-6">
                    <WeatherDisplay title="Start Location" data={routeResult.weather.start} summary={routeResult.summary.start} />
                    <SafetyAssessment data={routeResult.assessment.start} />

                    <div className="py-4">
                      <div className="w-full border-t border-dashed border-border"></div>
                    </div>

                    <WeatherDisplay title="Destination" data={routeResult.weather.destination} summary={routeResult.summary.destination} />
                    <SafetyAssessment data={routeResult.assessment.destination} />

                    <RoutePlanner data={routeResult.routeSuggestion} safetyBadge={routeResult.assessment.overall.safetyBadge} />
                  </motion.div>
                )}
                {!loading && !routeResult && renderPlaceholder()}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
