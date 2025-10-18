import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Camera, Sun, Eye, Leaf } from 'lucide-react';

interface HelpDialogProps {
  children?: React.ReactNode;
}

export const HelpDialog = ({ children }: HelpDialogProps) => {
  const tips = [
    {
      icon: <Sun className="w-5 h-5 text-accent" />,
      title: "แสงสว่างเพียงพอ",
      description: "ถ่ายภาพในที่แสงสว่างธรรมชาติ หรือใต้แสงไฟที่เพียงพอ หลีกเลี่ยงการย้อนแสง"
    },
    {
      icon: <Eye className="w-5 h-5 text-accent" />,
      title: "ภาพชัดเจน",
      description: "ถือกล้องให้นิ่ง รอให้โฟกัสแล้วจึงถ่าย ภาพที่เบลอจะให้ผลลัพธ์ที่ไม่แม่นยำ"
    },
    {
      icon: <Leaf className="w-5 h-5 text-accent" />,
      title: "เห็นใบเต็มใบ",
      description: "จัดมุมกล้องให้เห็นใบทุเรียนทั้งใบชัดเจน รวมถึงขอบและลายใบ"
    },
    {
      icon: <Camera className="w-5 h-5 text-accent" />,
      title: "ระยะที่เหมาะสม",
      description: "ถ่ายให้ใกล้พอที่จะเห็นรายละเอียด แต่ไม่ใกล้เกินไปจนภาพเบลอ"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            ช่วยเหลือ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            คำแนะนำการถ่ายภาพ
          </DialogTitle>
          <DialogDescription>
            เคล็ดลับสำหรับการถ่ายภาพใบทุเรียนที่ให้ผลการวินิจฉัยที่แม่นยำ
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                {tip.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground mb-1">
                  {tip.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="font-medium text-primary mb-2">
              💡 เคล็ดลับเพิ่มเติม
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ถ่ายภาพใบที่มีอาการชัดเจนที่สุด</li>
              <li>• หลีกเลี่ยงเงาบนใบไม้</li>
              <li>• ใช้พื้นหลังที่เรียบง่าย ไม่วุ่นวาย</li>
              <li>• ถ่ายหลายมุมถ้าไม่แน่ใจ</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};