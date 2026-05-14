"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { GenerationResult } from "@/types";
import { base64ToDataUrl, downloadImage } from "@/lib/utils";

interface ResultGalleryProps {
  results: GenerationResult;
  onGenerateAgain: () => void;
  onStartOver: () => void;
}

const captions = [
  "Vizura 01 — Široki kadar",
  "Vizura 02 — Bočni ugao",
];

export default function ResultGallery({ results, onGenerateAgain, onStartOver }: ResultGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-number mb-4">05 — Vaš plac</p>
      </motion.div>

      {/* 2 images side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {results.images.map((image, index) => (
          <motion.div
            key={index}
            className={`relative ${index === 1 ? "md:mt-16" : ""}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 + index * 0.2 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="border border-hairline overflow-hidden">
              <img
                src={base64ToDataUrl(image)}
                alt={captions[index]}
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            <motion.button
              className="absolute bottom-4 right-4 btn-outline bg-offwhite/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => downloadImage(image, `fence-vision-${index + 1}.png`)}
              aria-label={`Preuzmi ${captions[index]}`}
            >
              <Download size={14} strokeWidth={1} />
              Preuzmi
            </motion.button>
            <p className="section-number mt-3">{captions[index]}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="divider my-16" />
      <div className="text-center">
        <h3 className="display-m mb-8" style={{ fontStyle: "italic", fontWeight: 300 }}>
          Generisati ponovo?
        </h3>
        <div className="flex items-center justify-center gap-8">
          <button onClick={onGenerateAgain} className="text-link btn-text" aria-label="Generiši ponovo">
            Da
          </button>
          <span className="text-hairline">|</span>
          <button onClick={onStartOver} className="text-link btn-text" aria-label="Počni ispočetka">
            Krenite ispočetka
          </button>
        </div>
      </div>
    </div>
  );
}
