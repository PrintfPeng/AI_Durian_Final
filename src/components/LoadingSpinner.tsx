import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ 
  message = "กำลังประมวลผล… อาจใช้เวลา ~1–3 วินาที" 
}: LoadingSpinnerProps) => {
  return (
    <Card className="shadow-card">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              AI กำลังวิเคราะห์ภาพ
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {message}
            </p>
          </div>
          
          {/* Progress bar animation */}
          <div className="w-full max-w-xs">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary animate-loading-progress rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};