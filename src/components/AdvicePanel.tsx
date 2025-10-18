import { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AdviceResponse } from '@/types';

interface AdvicePanelProps {
  advice: AdviceResponse;
  onRequestMore: (question: string) => void;
  isLoading?: boolean;
}

export const AdvicePanel = ({ advice, onRequestMore, isLoading }: AdvicePanelProps) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    if (question.trim()) {
      onRequestMore(question.trim());
      setQuestion('');
    }
  };

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Sparkles className="w-5 h-5" />
          {advice.title}
        </CardTitle>
        <CardDescription>แนะนำโดย AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bullet points */}
        <ul className="space-y-3">
          {advice.bullets.map((bullet, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-accent font-bold mt-1">•</span>
              <span className="flex-1 text-sm">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Disclaimer */}
        <div className="p-3 bg-muted/50 rounded-md border border-muted">
          <p className="text-xs text-muted-foreground">
            ⚠️ {advice.disclaimer}
          </p>
        </div>

        {/* Follow-up question */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <label className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            ต้องการคำแนะนำเพิ่มเติม?
          </label>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="พิมพ์คำถามของคุณที่นี่..."
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            className="w-full gap-2"
            variant="outline"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'กำลังสร้างคำแนะนำ...' : 'ขอคำแนะนำเพิ่มเติม'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
