import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, AlertCircle, RefreshCw } from 'lucide-react';

interface LeafScannerUploadProps {
  onImageReady: (base64: string, mimeType: 'image/jpeg' | 'image/png' | 'image/webp') => void;
  previewUrl: string | null;
  onClear: () => void;
  isProcessing?: boolean;
}

export const LeafScannerUpload: React.FC<LeafScannerUploadProps> = ({
  onImageReady,
  previewUrl,
  onClear,
  isProcessing = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Compress image client-side via HTML Canvas to ensure payload < 2MB (max limit 10MB)
  const processAndCompressFile = useCallback((file: File) => {
    setErrorMsg(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Unsupported format. Please upload JPEG, PNG, or WEBP images.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Canvas compression
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setErrorMsg('Failed to initialize canvas context');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export compressed JPEG at 85% quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onImageReady(compressedDataUrl, 'image/jpeg');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onImageReady]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndCompressFile(e.dataTransfer.files[0]);
    }
  };

  // Live Camera Capture Handling
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setErrorMsg('Camera access is not permitted or device is unavailable. Please upload a photo file.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      onImageReady(dataUrl, 'image/jpeg');
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Camera Viewport if Active */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-500/40 p-2">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            className="w-full h-80 object-cover rounded-xl bg-black"
          />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/40 flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <span>Capture Specimen</span>
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : previewUrl ? (
        /* Image Preview Viewport */
        <div className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-500/30 p-2 group">
          <img
            src={previewUrl}
            alt="Plant specimen to triage"
            className="w-full h-80 object-cover rounded-xl bg-slate-950"
          />
          
          {!isProcessing && (
            <button
              type="button"
              onClick={() => {
                onClear();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-rose-500 text-slate-200 hover:text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-all duration-200 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <ImageIcon className="w-4 h-4" />
              <span className="font-semibold text-slate-200">Specimen Loaded</span>
              <span className="text-slate-400 text-[11px]">(Canvas Compressed)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Ready for Multimodal Triage</span>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 scale-[0.99]'
              : 'border-slate-700/80 hover:border-emerald-500/40 bg-slate-900/30 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processAndCompressFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-glow-green">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-base font-semibold text-slate-100 mb-1">
            Drop plant foliage photo or browse
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            High-resolution visual triage of leaf spots, stem blights, powdery lesions, or insect vectors via Gemini 2.5 Flash Vision.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Select File
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Use Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
