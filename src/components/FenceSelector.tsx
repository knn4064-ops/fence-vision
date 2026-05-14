"use client";

import React from "react";
import { motion } from "framer-motion";
import { FenceType } from "@/types";
import { fenceTypes } from "@/lib/fences";

interface FenceSelectorProps {
  selectedFence: FenceType | null;
  onSelect: (fence: FenceType) => void;
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 0.8,
      ease,
    },
  }),
};

export default function FenceSelector({ selectedFence, onSelect }: FenceSelectorProps) {
  const numbers = ["01", "02", "03"];
  const heights = ["1.6 metara", "1.8 metara", "2.0 metara"];

  return (
    <div className="w-full">
      {/* Section header */}
      <motion.div
        className="mb-12 md:mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-number mb-4">02 — Odaberite materijal</p>
        <h2 className="display-l">Tri filozofije ograde.</h2>
      </motion.div>

      {/* Asymmetric card layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {fenceTypes.map((fence, i) => {
          const isSelected = selectedFence?.id === fence.id;

          // Asymmetric positioning: card 1 cols 1-4, card 2 cols 4-9 offset, card 3 cols 9-12
          const colClasses = [
            "md:col-span-4 md:col-start-1",
            "md:col-span-5 md:col-start-5 md:mt-16",
            "md:col-span-4 md:col-start-9 md:-mt-8",
          ];

          return (
            <motion.button
              key={fence.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onClick={() => onSelect(fence)}
              className={`
                ${colClasses[i]}
                group relative text-left block w-full
                transition-all duration-300
              `}
              aria-label={`Odaberite ${fence.name}`}
              aria-pressed={isSelected}
              data-cursor-hover
            >
              {/* Image */}
              <div
                className={`
                  relative overflow-hidden aspect-[4/5]
                  border transition-all duration-500
                  ${isSelected
                    ? "border-cognac shadow-[inset_0_0_0_1px_#8B6F47]"
                    : "border-hairline"
                  }
                `}
              >
                <motion.img
                  src={fence.previewImage}
                  alt={`${fence.name} pregled`}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                {isSelected && (
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="caption text-cognac" style={{ fontSize: "0.6875rem" }}>
                      Odabrano
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                <span className="section-number">{numbers[i]}</span>
                <h3 className="display-m mt-2 relative inline-block">
                  {fence.name}
                  {/* Underline animation on hover */}
                  <span
                    className={`
                      absolute bottom-0 left-0 h-[1px] bg-cognac
                      transition-all duration-500 ease-out
                      ${isSelected ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </h3>
                <p className="body-m mt-2">{fence.styleDescription}</p>
                <p className="caption mt-3" style={{ fontSize: "0.75rem" }}>
                  {heights[i]}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
