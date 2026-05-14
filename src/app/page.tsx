"use client";

import React, { useState, useCallback } from "react";
import { AppStep, FenceType, PolylinePoint, GenerationResult } from "@/types";
import ImageUploader from "@/components/ImageUploader";
import FenceSelector from "@/components/FenceSelector";
import FenceDrawCanvas from "@/components/FenceDrawCanvas";
import ResultGallery from "@/components/ResultGallery";
import LoadingState from "@/components/LoadingState";
import {
  Fence,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const stepTitles: Record<AppStep, string> = {
  1: "Učitajte fotografiju",
  2: "Odaberite tip ograde",
  3: "Nacrtajte liniju ograde",
  4: "Generisanje...",
  5: "Rezultati",
};

const stepDescriptions: Record<AppStep, string> = {
  1: "Fotografišite vaše imanje ili učitajte sliku iz galerije",
  2: "Izaberite stil ograde koji želite da vidite",
  3: "Dodirnite na slici gde želite da bude ograda",
  4: "AI generiše fotorealistične prikaze vaše ograde",
  5: "Pregledajte i preuzmite generisane slike",
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

      if (!response.ok) {
        throw new Error(data.error || "Greška pri generisanju.");
      }

      setResults(data);
      setStep(5);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Nepoznata greška.";
      setError(msg);
      setStep(3); // Go back to drawing step
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
    if (step === 3) {
      handleGenerate();
      return;
    }
    if (step < 5 && canGoNext()) {
      setStep((s) => Math.min(s + 1, 5) as AppStep);
    }
  };

  const goBack = () => {
    if (step > 1 && step !== 4) {
      setStep((s) => Math.max(s - 1, 1) as AppStep);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/20">
              <Fence size={20} className="text-blue-400" />
            </div>
            <h1 className="text-lg font-bold gradient-text">FenceVision</h1>
          </div>
          {step !== 4 && (
            <span className="text-xs text-gray-500 font-medium">
              Korak {step}/5
            </span>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Step progress dots */}
      {step !== 4 && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4 pb-2">
          <div className="flex items-center justify-center gap-2">
            {([1, 2, 3, 4, 5] as AppStep[]).map((s) => (
              <div
                key={s}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-300
                  ${s === step ? "bg-blue-500 scale-125" : s < step ? "bg-emerald-500" : "bg-white/15"}
                `}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step title */}
      <div className="max-w-4xl mx-auto w-full px-4 py-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 animate-fade-in">
          {stepTitles[step]}
        </h2>
        <p className="text-sm text-gray-400 mt-1 animate-fade-in">
          {stepDescriptions[step]}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Zatvori
            </button>
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8 animate-slide-up">
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
      </div>

      {/* Navigation bar */}
      {step !== 4 && step !== 5 && (
        <div className="sticky bottom-0 glass-card border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/5 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200"
              aria-label="Nazad"
            >
              <ChevronLeft size={18} />
              Nazad
            </button>

            {step === 3 ? (
              <button
                onClick={handleGenerate}
                disabled={points.length < 2}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] transition-all duration-200"
                aria-label="Generiši ogradu"
              >
                <RefreshCw size={16} />
                Generiši
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] transition-all duration-200"
                aria-label="Dalje"
              >
                Dalje
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
