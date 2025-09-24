import { z } from 'zod';

export const formSchema = z.object({
  currentLocation: z.string().min(1, 'Current location is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  date: z.date({ required_error: 'Date is required.' }),
  time: z.string().min(1, 'Time is required.'),
});

export type FormSchema = z.infer<typeof formSchema>;

export type WeatherData = {
  temperature: number;
  rainProbability: number;
  windSpeed: number;
  forecast: string;
};
