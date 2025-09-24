import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, AlertTriangle, ShieldCheck, TrafficCone, Map } from 'lucide-react';
import { GenerateSafetyAssessmentOutput } from '@/ai/flows/generate-safety-assessment';

interface RoutePlannerProps {
  data: string;
  safetyBadge: GenerateSafetyAssessmentOutput['safetyBadge'];
}

export function RoutePlanner({ data, safetyBadge }: RoutePlannerProps) {
  const renderIcon = () => {
    switch (safetyBadge) {
      case 'Postpone':
        return <TrafficCone className="h-6 w-6 text-red-500" />;
      case 'Risky':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'Safe':
        return <Map className="h-6 w-6 text-green-500" />;
      default:
        return <Route className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {renderIcon()}
          <span className="text-xl font-bold">AI Route Suggestion</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p 
          className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: data.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
        />
      </CardContent>
    </Card>
  );
}
