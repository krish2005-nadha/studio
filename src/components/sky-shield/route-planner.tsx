import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route } from 'lucide-react';

interface RoutePlannerProps {
  data: string;
}

export function RoutePlanner({ data }: RoutePlannerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-6 w-6 text-primary" />
          <span>Route Suggestion</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{data}</p>
      </CardContent>
    </Card>
  );
}
