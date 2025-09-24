import { GenerateSafetyAssessmentOutput } from '@/ai/flows/generate-safety-assessment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafetyAssessmentProps {
  data: GenerateSafetyAssessmentOutput;
}

const badgeConfig = {
  Safe: {
    variant: 'default',
    icon: ShieldCheck,
    className: 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30',
  },
  Risky: {
    variant: 'secondary',
    icon: ShieldAlert,
    className: 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-500/30',
  },
  Postpone: {
    variant: 'destructive',
    icon: ShieldQuestion,
    className: 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30',
  },
};

export function SafetyAssessment({ data }: SafetyAssessmentProps) {
  const config = badgeConfig[data.safetyBadge] || badgeConfig.Risky;
  const Icon = config.icon;
  const probabilityPercent = Math.round(data.probabilityScore * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          <span>Safety Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Badge
            className={cn(
              'text-lg px-4 py-1.5 w-fit font-bold',
              config.className
            )}
          >
            {data.safetyBadge}
          </Badge>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                Confidence Score
              </span>
              <span className="text-sm font-bold">{probabilityPercent}%</span>
            </div>
            <Progress value={probabilityPercent} className="h-2" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Reasoning:</h4>
          <p className="text-muted-foreground">{data.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
