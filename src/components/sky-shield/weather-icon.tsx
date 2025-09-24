import { Sun, Cloud, CloudRain, Wind, Zap, Cloudy, Snowflake, CloudSun } from 'lucide-react';

interface WeatherIconProps {
  forecast: string;
  className?: string;
}

export function WeatherIcon({ forecast, className }: WeatherIconProps) {
  const lowerForecast = forecast.toLowerCase();

  if (lowerForecast.includes('thunder') || lowerForecast.includes('storm')) {
    return <Zap className={className} />;
  }
  if (lowerForecast.includes('snow') || lowerForecast.includes('freezing')) {
    return <Snowflake className={className} />;
  }
  if (lowerForecast.includes('rain') || lowerForecast.includes('showers')) {
    return <CloudRain className={className} />;
  }
  if (lowerForecast.includes('wind') || lowerForecast.includes('breezy')) {
    return <Wind className={className} />;
  }
  if (lowerForecast.includes('partly cloudy') || lowerForecast.includes('partly sunny')) {
    return <CloudSun className={className} />;
  }
  if (lowerForecast.includes('cloudy') || lowerForecast.includes('overcast')) {
    return <Cloud className={className} />;
  }
  if (lowerForecast.includes('sun') || lowerForecast.includes('clear')) {
    return <Sun className={className} />;
  }
  
  return <Cloudy className={className} />;
}
