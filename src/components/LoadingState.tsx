"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function LoadingState() {
  const [elapsed, setElapsed] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: "98%",
        duration: 40,
        ease: "power1.inOut",
      }
    );
  }, []);

  let currentMessage = "Analiziramo fotografiju...";
  if (elapsed >= 40) {
    currentMessage = "Gotovo.";
  } else if (elapsed >= 35) {
    currentMessage = "Završavamo...";
  } else if (elapsed >= 15) {
    currentMessage = "Generišemo prikaz ograde...";
  }

  const formattedElapsed = `0:${elapsed.toString().padStart(2, "0")}`;

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
      {/* Rotating word */}
      <div className="text-center min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            className="display-m"
            style={{ fontStyle: "italic", fontWeight: 300, fontVariationSettings: '"opsz" 72' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Thin progress bar */}
      <div className="w-full max-w-xs mt-12">
        <div className="w-full h-[1px] bg-hairline relative overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-cognac absolute top-0 left-0"
          />
        </div>
        <p className="caption mt-4 text-center" style={{ textTransform: "none", letterSpacing: "normal", fontSize: "0.75rem" }}>
          {formattedElapsed} / ~0:40
        </p>
      </div>
    </div>
  );
}
