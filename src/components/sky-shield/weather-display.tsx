import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '@/app/actions';
import { WeatherIcon } from './weather-icon';
import type { SummarizeWeatherForecastOutput } from '@/ai/flows/summarize-weather-forecast';

interface WeatherDisplayProps {
  data: WeatherData;
  summary: SummarizeWeatherForecastOutput;
}

export function WeatherDisplay({ data, summary }: WeatherDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-primary" />
          <span>Weather Prediction</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 text-lg">
          <WeatherIcon forecast={data.forecast} className="h-16 w-16 text-accent" />
          <div>
            <p className="font-bold text-2xl">{summary.summary.split('.')[0]}.</p>
            <p className="text-muted-foreground">{summary.summary.split('.').slice(1).join('.').trim()}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-center items-center gap-2">
              <Thermometer className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-semibold">Temperature</h4>
            </div>
            <p className="text-2xl font-bold mt-1">{data.temperature}°C</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-center items-center gap-2">
              <Droplets className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-semibold">Rain Chance</h4>
            </div>
            <p className="text-2xl font-bold mt-1">
              {Math.round(data.rainProbability * 100)}%
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-center items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-semibold">Wind Speed</h4>
            </div>
            <p className="text-2xl font-bold mt-1">{data.windSpeed} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
