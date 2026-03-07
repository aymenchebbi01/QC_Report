import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { InspectionImage } from '../types';
import { cn } from '../utils/cn';

interface ImageUploadProps {
  images: InspectionImage[];
  onChange: (images: InspectionImage[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages = 10 }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remaining = maxImages - images.length;
    const filesToProcess = acceptedFiles.slice(0, remaining);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: InspectionImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          caption: '',
        };
        onChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, [images, onChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    disabled: images.length >= maxImages,
    multiple: true
  } as any);

  const removeImage = (id: string) => {
    onChange(images.filter(img => img.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(images.map(img => img.id === id ? { ...img, caption } : img));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
          isDragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-400",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-600 font-medium">
          {isDragActive ? "Drop images here" : "Drag & drop inspection images, or click to select"}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          JPG, PNG up to {maxImages} images ({images.length}/{maxImages})
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={14} />
              </button>
              <div className="aspect-video bg-slate-100 relative">
                <img src={img.url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Add caption..."
                  value={img.caption}
                  onChange={(e) => updateCaption(img.id, e.target.value)}
                  className="w-full text-xs border-none focus:ring-0 p-1 bg-slate-50 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
