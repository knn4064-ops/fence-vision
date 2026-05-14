"use client";

import React, { useCallback, useRef, useState } from "react";
import { Upload, Camera, X, ImageIcon } from "lucide-react";
import { validateImage, fileToBase64 } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelected: (base64: string, file: File) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error || "Nevalidna slika.");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;
        setPreview(dataUrl);
        onImageSelected(base64, file);
      } catch {
        setError("Greška pri učitavanju slike.");
      }
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearImage = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
          <img
            src={preview}
            alt="Učitana fotografija imanja"
            className="w-full h-auto object-contain max-h-[60vh]"
          />
          <button
            onClick={clearImage}
            className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-all duration-200"
            aria-label="Ukloni sliku"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-3">
          Slika je učitana. Kliknite &quot;Dalje&quot; za nastavak.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center p-8 md:p-12
          rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300 ease-out
          ${
            isDragging
              ? "border-emerald-400 bg-emerald-500/10 scale-[1.02]"
              : "border-gray-600 bg-white/5 hover:border-blue-400 hover:bg-blue-500/5"
          }
        `}
        role="button"
        aria-label="Prevucite sliku ili kliknite za učitavanje"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <div
          className={`
            p-4 rounded-full mb-4 transition-all duration-300
            ${isDragging ? "bg-emerald-500/20" : "bg-blue-500/10"}
          `}
        >
          <Upload
            size={40}
            className={`transition-colors duration-300 ${
              isDragging ? "text-emerald-400" : "text-blue-400"
            }`}
          />
        </div>
        <p className="text-lg font-medium text-gray-200 text-center">
          Prevucite fotografiju ovde
        </p>
        <p className="text-sm text-gray-400 mt-1">
          ili kliknite za odabir iz galerije
        </p>
        <p className="text-xs text-gray-500 mt-3">
          JPG, PNG, WebP • Maksimalno 10MB
        </p>
      </div>

      {/* Camera button (mobile) */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        className="
          w-full flex items-center justify-center gap-3 py-4 px-6
          rounded-xl bg-gradient-to-r from-blue-600 to-blue-700
          text-white font-medium
          hover:from-blue-500 hover:to-blue-600
          active:scale-[0.98] transition-all duration-200
          shadow-lg shadow-blue-500/20
        "
        aria-label="Fotografišite kamerom"
      >
        <Camera size={22} />
        <span>Fotografišite kamerom</span>
      </button>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <ImageIcon size={18} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        id="file-upload"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        id="camera-upload"
      />
    </div>
  );
}
