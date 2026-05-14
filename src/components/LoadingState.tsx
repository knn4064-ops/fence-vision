"use client";

import React, { useEffect, useState } from "react";
import { Fence } from "lucide-react";

const messages = [
  "Analiziranje fotografije...",
  "Prepoznavanje scene...",
  "Generisanje ograde...",
  "Uklapanje u okruženje...",
  "Podešavanje osvetljenja...",
  "Finalizacija rendera...",
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 3;
      });
    }, 500);
    return () => clearInterval(progInterval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-16 space-y-8">
      {/* Animated icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10">
          <Fence size={48} className="text-blue-400 animate-bounce" style={{ animationDuration: "2s" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full space-y-2">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-right">{Math.min(Math.round(progress), 95)}%</p>
      </div>

      {/* Status message */}
      <div className="text-center space-y-2 min-h-[60px] flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-gray-200 transition-all duration-500">
          {messages[messageIndex]}
        </p>
        <p className="text-sm text-gray-500">
          Ovo može potrajati do 30 sekundi
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-blue-400"
            style={{
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
