import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X } from 'lucide-react';
import { validateImageFile, convertFileToBase64 } from '@/utils/imageUtils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImagePickerProps {
  onImageSelect: (base64: string, file: File) => void;
  selectedImage: string | null;
  onClearImage: () => void;
  disabled?: boolean;
}

export const ImagePicker = ({ onImageSelect, selectedImage, onClearImage, disabled }: ImagePickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      toast({
        title: "ไฟล์ไม่ถูกต้อง",
        description: error,
        variant: "destructive"
      });
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      onImageSelect(base64, file);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอ่านไฟล์ภาพได้",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openCamera = () => {
    if (!disabled && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        {selectedImage ? (
          <div className="relative group">
            <img 
              src={selectedImage} 
              alt="ภาพที่เลือก" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                onClick={onClearImage}
                variant="destructive"
                size="sm"
                className="gap-2"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
                ลบภาพ
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  เลือกภาพใบทุเรียน
                </p>
                <p className="text-sm text-muted-foreground">
                  ลากภาพมาวาง หรือคลิกเพื่อเลือกไฟล์
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  รองรับ JPG, JPEG, PNG (ขนาดไม่เกิน 5MB)
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="p-4 bg-secondary/30">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={openFileDialog}
              variant="outline"
              className="gap-2"
              disabled={disabled}
            >
              <Upload className="w-4 h-4" />
              อัปโหลดภาพ
            </Button>
            <Button
              onClick={openCamera}
              variant="outline"
              className="gap-2"
              disabled={disabled}
            >
              <Camera className="w-4 h-4" />
              ถ่ายภาพ
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
    </Card>
  );
};