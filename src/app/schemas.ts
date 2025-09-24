import { z } from 'zod';

export const locationFormSchema = z.object({
  location: z.string().min(1, 'Location is required.'),
  date: z.date({ required_error: 'Date is required.' }),
  time: z.string().min(1, 'Time is required.'),
});

export type LocationFormSchema = z.infer<typeof locationFormSchema>;

export const routeFormSchema = z.object({
  startLocation: z.string().min(1, 'Start location is required.'),
  endLocation: z.string().min(1, 'Destination is required.'),
  date: z.date({ required_error: 'Date is required.' }),
  time: z.string().min(1, 'Time is required.'),
});

export type RouteFormSchema = z.infer<typeof routeFormSchema>;


export type WeatherData = {
  temperature: number;
  rainProbability: number;
  windSpeed: number;
  forecast: string;
};
