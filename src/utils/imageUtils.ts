const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'กรุณาเลือกไฟล์ภาพ JPG, JPEG หรือ PNG เท่านั้น';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'ขนาดไฟล์ต้องไม่เกิน 5MB';
  }
  
  return null;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
    };
    
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => reject(new Error('ไม่สามารถประมวลผลภาพได้'));
    img.src = URL.createObjectURL(file);
  });
};