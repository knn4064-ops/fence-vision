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
  "Vizura 02 — Detalj panela",
  "Vizura 03 — Bočni ugao",
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

      {/* Image 1 — full width hero */}
      {results.images[0] && (
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="border border-hairline overflow-hidden">
            <img
              src={base64ToDataUrl(results.images[0])}
              alt={captions[0]}
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Download button on hover */}
          <motion.button
            className="absolute bottom-4 right-4 btn-outline bg-offwhite/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredIndex === 0 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => downloadImage(results.images[0], "fence-vision-wide.png")}
            aria-label={`Preuzmi ${captions[0]}`}
          >
            <Download size={14} strokeWidth={1} />
            Preuzmi
          </motion.button>
          <p className="section-number mt-3">{captions[0]}</p>
        </motion.div>
      )}

      {/* Images 2 and 3 — asymmetric pair */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {results.images[1] && (
          <motion.div
            className="md:col-span-7 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="border border-hairline overflow-hidden">
              <img
                src={base64ToDataUrl(results.images[1])}
                alt={captions[1]}
                className="w-full h-auto object-cover"
              />
            </div>
            <motion.button
              className="absolute bottom-4 right-4 btn-outline bg-offwhite/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === 1 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => downloadImage(results.images[1], "fence-vision-detail.png")}
              aria-label={`Preuzmi ${captions[1]}`}
            >
              <Download size={14} strokeWidth={1} />
              Preuzmi
            </motion.button>
            <p className="section-number mt-3">{captions[1]}</p>
          </motion.div>
        )}

        {results.images[2] && (
          <motion.div
            className="md:col-span-5 md:mt-8 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 }}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="border border-hairline overflow-hidden">
              <img
                src={base64ToDataUrl(results.images[2])}
                alt={captions[2]}
                className="w-full h-auto object-cover"
              />
            </div>
            <motion.button
              className="absolute bottom-4 right-4 btn-outline bg-offwhite/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === 2 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => downloadImage(results.images[2], "fence-vision-angle.png")}
              aria-label={`Preuzmi ${captions[2]}`}
            >
              <Download size={14} strokeWidth={1} />
              Preuzmi
            </motion.button>
            <p className="section-number mt-3">{captions[2]}</p>
          </motion.div>
        )}
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
