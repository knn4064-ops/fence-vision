"use client";

import React from "react";
import { FenceType } from "@/types";
import { fenceTypes } from "@/lib/fences";
import { Check, Ruler, Columns3 } from "lucide-react";

interface FenceSelectorProps {
  selectedFence: FenceType | null;
  onSelect: (fence: FenceType) => void;
}

export default function FenceSelector({
  selectedFence,
  onSelect,
}: FenceSelectorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fenceTypes.map((fence) => {
          const isSelected = selectedFence?.id === fence.id;

          return (
            <button
              key={fence.id}
              onClick={() => onSelect(fence)}
              className={`
                group relative flex flex-col rounded-2xl overflow-hidden
                border-2 transition-all duration-300 ease-out
                text-left
                ${
                  isSelected
                    ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02] bg-blue-500/5"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/8"
                }
              `}
              aria-label={`Odaberite ${fence.name}`}
              aria-pressed={isSelected}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-blue-500 shadow-lg">
                  <Check size={16} className="text-white" />
                </div>
              )}

              {/* Preview image */}
              <div
                className="w-full h-40 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: `${fence.color}20` }}
              >
                <img
                  src={fence.previewImage}
                  alt={`${fence.name} pregled`}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${fence.color}40, transparent)`,
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-100">
                  {fence.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Ruler size={14} className="text-gray-500" />
                    {fence.height}
                  </span>
                  <span className="flex items-center gap-1">
                    <Columns3 size={14} className="text-gray-500" />
                    {fence.postSpacing}
                  </span>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mt-1">
                  {fence.styleDescription}
                </p>

                <div className="mt-auto pt-2">
                  <span className="text-xs text-gray-500">
                    Materijal stubova: {fence.postMaterial}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
