"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppStep, FenceType, PolylinePoint, GenerationResult } from "@/types";
import ImageUploader from "@/components/ImageUploader";
import FenceSelector from "@/components/FenceSelector";
import FenceDrawCanvas from "@/components/FenceDrawCanvas";
import ResultGallery from "@/components/ResultGallery";
import LoadingState from "@/components/LoadingState";
import { ChevronLeft } from "lucide-react";

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stepExit = {
  opacity: 0,
  y: -20,
  transition: { duration: 0.6, ease: customEase },
};

const stepEnter = {
  opacity: 0,
  y: 20,
};

const stepAnimate = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.8, ease: customEase, delay: 0.4 },
};

export default function Home() {
  const [step, setStep] = useState<AppStep>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFence, setSelectedFence] = useState<FenceType | null>(null);
  const [points, setPoints] = useState<PolylinePoint[]>([]);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string) => {
    setUploadedImage(base64);
  }, []);

  const handleFenceSelect = useCallback((fence: FenceType) => {
    setSelectedFence(fence);
  }, []);

  const handlePointsChange = useCallback((newPoints: PolylinePoint[]) => {
    setPoints(newPoints);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage || !selectedFence || points.length < 2) return;
    setStep(4);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          fenceTypeId: selectedFence.id,
          points: points,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška pri generisanju.");
      setResults(data);
      setStep(5);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Nepoznata greška.";
      setError(msg);
      setStep(3);
    }
  }, [uploadedImage, selectedFence, points]);

  const handleGenerateAgain = useCallback(() => {
    setResults(null);
    handleGenerate();
  }, [handleGenerate]);

  const handleStartOver = useCallback(() => {
    setStep(1);
    setUploadedImage(null);
    setSelectedFence(null);
    setPoints([]);
    setResults(null);
    setError(null);
  }, []);

  const canGoNext = (): boolean => {
    switch (step) {
      case 1: return !!uploadedImage;
      case 2: return !!selectedFence;
      case 3: return points.length >= 2;
      default: return false;
    }
  };

  const goNext = () => {
    if (step === 3) { handleGenerate(); return; }
    if (step < 5 && canGoNext()) setStep((s) => Math.min(s + 1, 5) as AppStep);
  };

  const goBack = () => {
    if (step > 1 && step !== 4) setStep((s) => Math.max(s - 1, 1) as AppStep);
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Header — minimal */}
      <header className="page-container">
        <div className="flex items-center justify-between py-6 border-b border-hairline">
          <span
            className="btn-text tracking-widest"
            style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            FenceVision
          </span>
          {step !== 4 && (
            <span className="section-number">
              {String(step).padStart(2, "0")} / 05
            </span>
          )}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="page-container mt-4">
          <div className="p-4 border border-cognac/30 bg-cognac/5 flex items-center justify-between">
            <p className="body-m" style={{ color: "#8B6F47" }}>{error}</p>
            <button onClick={() => setError(null)} className="text-link btn-text" style={{ fontSize: "0.75rem" }}>
              Zatvori
            </button>
          </div>
        </div>
      )}

      {/* Step content with AnimatePresence */}
      <div className="flex-1 page-container section-padding">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={stepEnter}
            animate={stepAnimate}
            exit={stepExit}
          >
            {step === 1 && <ImageUploader onImageSelected={handleImageSelected} />}
            {step === 2 && (
              <FenceSelector selectedFence={selectedFence} onSelect={handleFenceSelect} />
            )}
            {step === 3 && uploadedImage && selectedFence && (
              <FenceDrawCanvas
                imageSrc={`data:image/jpeg;base64,${uploadedImage}`}
                fenceType={selectedFence}
                points={points}
                onPointsChange={handlePointsChange}
                onDone={handleGenerate}
              />
            )}
            {step === 4 && <LoadingState />}
            {step === 5 && results && (
              <ResultGallery
                results={results}
                onGenerateAgain={handleGenerateAgain}
                onStartOver={handleStartOver}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation — minimal */}
      {step !== 4 && step !== 5 && (
        <footer className="page-container">
          <div className="flex items-center justify-between py-6 border-t border-hairline">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="btn-text flex items-center gap-1 text-muted hover:text-ink disabled:opacity-0 disabled:pointer-events-none transition-colors duration-300"
              aria-label="Nazad"
            >
              <ChevronLeft size={16} strokeWidth={1} />
              Nazad
            </button>

            {step === 3 ? (
              <button
                onClick={handleGenerate}
                disabled={points.length < 2}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Generiši ogradu"
              >
                Generiši
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Dalje"
              >
                Dalje
              </button>
            )}
          </div>
        </footer>
      )}
    </main>
  );
}
