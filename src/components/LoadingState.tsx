"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const messages = [
  "Analiziramo prostor.",
  "Postavljamo stubove.",
  "Renderujemo materijal.",
  "Završavamo prikaz.",
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // GSAP progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: "95%",
        duration: 25,
        ease: "power1.out",
      }
    );
  }, []);

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
      {/* Rotating word */}
      <div className="text-center min-h-[80px] flex items-center justify-center">
        <motion.p
          key={messageIndex}
          className="display-m"
          style={{ fontStyle: "italic", fontWeight: 300, fontVariationSettings: '"opsz" 72' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {messages[messageIndex]}
        </motion.p>
      </div>

      {/* Thin progress bar */}
      <div className="w-full max-w-xs mt-12">
        <div className="w-full h-[1px] bg-hairline relative overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-cognac absolute top-0 left-0"
          />
        </div>
      </div>
    </div>
  );
}
