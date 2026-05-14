"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { validateImage, fileToBase64 } from "@/lib/utils";
import { ArrowUpRight, X } from "lucide-react";

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

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

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
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          <div className="md:col-span-5 md:col-start-2">
            <p className="section-number mb-6">01 — Fotografija</p>
            <h2 className="display-m mb-4">Vaša fotografija</h2>
            <p className="body-m mb-8">
              Fotografija je učitana. Nastavite dalje da odaberete tip ograde.
            </p>
            <button
              onClick={clearImage}
              className="btn-outline"
              aria-label="Ukloni sliku"
            >
              <X size={16} strokeWidth={1} />
              Ukloni i ponovo odaberi
            </button>
          </div>
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="border border-hairline">
              <img
                src={preview}
                alt="Učitana fotografija imanja"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center min-h-[60vh]">
        {/* Left — text */}
        <div className="md:col-span-5 md:col-start-2">
          <motion.p
            className="section-number mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            01 — Fotografija
          </motion.p>
          <motion.h2
            className="display-l mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
          >
            Vaša nova ograda.
          </motion.h2>
          <motion.p
            className="caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Renderovanje ograde podržano veštačkom inteligencijom
          </motion.p>
        </div>

        {/* Right — upload zone */}
        <motion.div
          className="md:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 }}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center
              aspect-[4/5] w-full
              transition-all duration-500 cursor-pointer
              ${isDragging
                ? "border-2 border-dashed border-cognac bg-cream/50"
                : "border border-hairline"
              }
            `}
            role="button"
            aria-label="Prevucite sliku ili kliknite za učitavanje"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
          >
            <div className="text-center px-8">
              <p
                className="display-m mb-6"
                style={{ fontVariationSettings: '"opsz" 72' }}
              >
                Učitajte fotografiju
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="text-link btn-text"
              >
                Odaberite fajl
              </button>
              <p className="caption mt-6" style={{ textTransform: "none", letterSpacing: "normal", fontSize: "0.75rem" }}>
                JPG, PNG, WebP — max 10MB
              </p>
            </div>
          </div>

          {/* Camera button — mobile */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="btn-outline w-full mt-4 justify-center md:hidden"
            aria-label="Fotografišite kamerom"
          >
            Fotografišite kamerom
            <ArrowUpRight size={16} strokeWidth={1} />
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 border border-cognac/30 bg-cognac/5">
              <p className="body-m" style={{ color: "#8B6F47" }}>{error}</p>
            </div>
          )}

          {/* Hidden inputs */}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange} className="hidden" aria-hidden="true" id="file-upload" />
          <input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp"
            capture="environment" onChange={handleFileChange} className="hidden" aria-hidden="true" id="camera-upload" />
        </motion.div>
      </div>
    </div>
  );
}
