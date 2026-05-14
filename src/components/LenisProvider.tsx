"use client";

import { useEffect } from "react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    async function initLenis() {
      try {
        const Lenis = (await import("lenis")).default;
        lenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
        });

        function raf(time: number) {
          lenis?.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch {
        // Lenis not available, graceful fallback
      }
    }

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
