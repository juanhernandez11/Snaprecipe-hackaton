"use client";

import { useRef, useState } from "react";

interface Props {
  onImageCaptured: (base64: string) => void;
}

function compressImage(file: File, maxWidth: number = 1024, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo crear contexto canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG with compression
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error("Error al cargar imagen"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Error al leer archivo"));
    reader.readAsDataURL(file);
  });
}

export default function ImageCapture({ onImageCaptured }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!originalFile) return;

    try {
      // Compress image before sending (max 1024px wide, 70% quality JPEG)
      const compressedBase64 = await compressImage(originalFile, 1024, 0.7);
      // Remove the data:image/...;base64, prefix
      const base64Data = compressedBase64.split(",")[1];
      onImageCaptured(base64Data);
    } catch (err) {
      console.error("Error compressing image:", err);
      // Fallback: send original
      if (preview) {
        const base64Data = preview.split(",")[1];
        onImageCaptured(base64Data);
      }
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          📷 Fotografía tus ingredientes
        </h2>
        <p className="text-gray-600">
          Toma una foto de tu nevera o de los ingredientes que tengas disponibles
        </p>
      </div>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-orange-300 rounded-2xl p-12 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <div className="space-y-4">
            <div className="text-6xl group-hover:scale-110 transition-transform">
              🥕
            </div>
            <p className="text-gray-500 font-medium">
              Toca para tomar una foto o seleccionar imagen
            </p>
            <p className="text-sm text-gray-400">
              Soporta JPG, PNG • Se comprime automáticamente
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src={preview}
              alt="Vista previa de ingredientes"
              className="w-full max-h-80 object-cover"
            />
            <button
              onClick={() => {
                setPreview("");
                setOriginalFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🔍 Analizar ingredientes
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
