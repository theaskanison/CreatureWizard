import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, RotateCw } from 'lucide-react';
import { Button } from './Button';

interface SketchUploaderProps {
  onUpload: (base64: string) => void;
}

export const SketchUploader: React.FC<SketchUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onUpload(preview);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-fade-in">
      <div 
        className="w-full aspect-square bg-white rounded-3xl border-4 border-dashed border-blue-300 flex flex-col items-center justify-center relative overflow-hidden shadow-inner cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => !preview && fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Sketch preview" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
              <ImageIcon className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Tap to Upload Sketch</h3>
            <p className="text-blue-600">Take a photo of your drawing!</p>
          </div>
        )}
        
        {preview && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-red-500"
          >
            <RotateCw size={24} />
          </button>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange} 
      />

      <div className="mt-8 w-full">
        {preview ? (
          <Button onClick={handleConfirm} size="lg" className="w-full">
            Yes, use this drawing!
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload className="inline mr-2" size={20} />
              Gallery
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Camera className="inline mr-2" size={20} />
              Camera
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};