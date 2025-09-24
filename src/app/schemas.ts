import { z } from 'zod';

export const formSchema = z.object({
  location: z.string().min(1, 'Location is required.'),
  date: z.date({ required_error: 'Date is required.' }),
  time: z.string().min(1, 'Time is required.'),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export type WeatherData = {
  temperature: number;
  rainProbability: number;
  windSpeed: number;
  forecast: string;
};
