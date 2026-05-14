"use client";

import React from "react";
import { Download, RefreshCw, RotateCcw } from "lucide-react";
import { GenerationResult } from "@/types";
import { base64ToDataUrl, downloadImage } from "@/lib/utils";

interface ResultGalleryProps {
  results: GenerationResult;
  onGenerateAgain: () => void;
  onStartOver: () => void;
}

export default function ResultGallery({ results, onGenerateAgain, onStartOver }: ResultGalleryProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.images.map((img, i) => (
          <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={base64ToDataUrl(img)}
                alt={results.labels[i] || `Generisana slika ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">{results.labels[i]}</span>
              <button
                onClick={() => downloadImage(img, `fence-vision-${i + 1}.png`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-all duration-200"
                aria-label={`Preuzmi ${results.labels[i]}`}
              >
                <Download size={14} />
                Preuzmi
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button onClick={onGenerateAgain}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200"
          aria-label="Generiši ponovo">
          <RefreshCw size={18} />
          Generiši ponovo
        </button>
        <button onClick={onStartOver}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
          aria-label="Počni ispočetka">
          <RotateCcw size={18} />
          Počni ispočetka
        </button>
      </div>
    </div>
  );
}
