import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';
import { PredictionResult, DISEASE_LABELS, DiseaseLabel } from '@/types';
import { ProbabilityBars } from './ProbabilityBars';

interface ResultCardProps {
  result: PredictionResult;
  onDownloadReport?: () => void;
}

export const ResultCard = ({ result, onDownloadReport }: ResultCardProps) => {
  const thaiLabel = DISEASE_LABELS[result.label as DiseaseLabel];
  const confidence = Math.round((result.probs[result.label] || 0) * 100);
  const isHealthy = result.label === 'HEALTHY_LEAF';
  const isHighConfidence = confidence >= 80;

  const getStatusIcon = () => {
    if (isHealthy) {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <AlertTriangle className="w-5 h-5" />;
  };

  const getBadgeVariant = () => {
    if (isHealthy) return 'default';
    if (isHighConfidence) return 'destructive';
    return 'secondary';
  };

  const getBadgeStyles = () => {
    if (isHealthy) {
      return 'bg-success text-success-foreground hover:bg-success/90';
    }
    if (isHighConfidence) {
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    }
    return 'bg-warning text-warning-foreground hover:bg-warning/90';
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Leaf className="w-6 h-6 text-primary" />
          ผลการวินิจฉัย
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Result */}
        <div className="text-center space-y-3">
          <Badge 
            variant={getBadgeVariant()}
            className={`text-lg px-4 py-2 gap-2 ${getBadgeStyles()}`}
          >
            {getStatusIcon()}
            {thaiLabel}
          </Badge>
          
          <p className="text-2xl font-bold text-primary">
            ความมั่นใจ {confidence}%
          </p>
          
          {!isHealthy && confidence < 60 && (
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              💡 ความมั่นใจต่ำ แนะนำให้ถ่ายภาพใหม่ในแสงที่ดีกว่าหรือปรึกษาผู้เชี่ยวชาญ
            </p>
          )}
        </div>

        {/* Probability Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">ระดับความมั่นใจทั้งหมด</h4>
          <ProbabilityBars probs={result.probs} />
        </div>

        {/* Technical Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm text-muted-foreground">
          <div>
            <span className="font-medium">เวลาประมวลผล:</span>
            <br />
            {result.latency_ms} มิลลิวินาที
          </div>
          <div>
            <span className="font-medium">รุ่นโมเดล:</span>
            <br />
            {result.model_version}
          </div>
        </div>

        {/* Actions */}
        {onDownloadReport && (
          <Button 
            onClick={onDownloadReport}
            className="w-full gap-2 bg-gradient-primary hover:opacity-90"
            size="lg"
          >
            <Download className="w-4 h-4" />
            ดาวน์โหลดรายงาน
          </Button>
        )}
      </CardContent>
    </Card>
  );
};