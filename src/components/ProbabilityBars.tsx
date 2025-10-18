import { Progress } from '@/components/ui/progress';
import { DISEASE_LABELS, DiseaseLabel } from '@/types';

interface ProbabilityBarsProps {
  probs: Record<string, number>;
}

export const ProbabilityBars = ({ probs }: ProbabilityBarsProps) => {
  // Sort by probability (highest first)
  const sortedProbs = Object.entries(probs)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4); // Show top 4

  const getBarColor = (label: string, probability: number) => {
    if (label === 'HEALTHY_LEAF') {
      return 'bg-success';
    }
    if (probability >= 0.6) {
      return 'bg-destructive';
    }
    if (probability >= 0.3) {
      return 'bg-warning';
    }
    return 'bg-muted';
  };

  return (
    <div className="space-y-3">
      {sortedProbs.map(([label, prob]) => {
        const thaiLabel = DISEASE_LABELS[label as DiseaseLabel] || label;
        const percentage = Math.round(prob * 100);
        
        return (
          <div key={label} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground">{thaiLabel}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={percentage} 
                className="h-2"
              />
              {/* Custom colored fill */}
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all ${getBarColor(label, prob)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};