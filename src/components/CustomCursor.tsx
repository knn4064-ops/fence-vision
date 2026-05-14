"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Detect touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const addHover = () => setIsHovering(true);
    const removeHover = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);

    // Watch for interactive elements
    const observer = new MutationObserver(() => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    const interactives = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        aria-hidden="true"
      >
        <motion.div
          animate={{
            width: isHovering ? 32 : 8,
            height: isHovering ? 32 : 8,
            backgroundColor: isHovering ? "rgba(28,25,23,0)" : "rgba(28,25,23,1)",
            borderWidth: isHovering ? 1.5 : 0,
            borderColor: "#1C1917",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="rounded-full"
          style={{ mixBlendMode: isHovering ? "difference" : "normal", borderStyle: "solid" }}
        />
      </motion.div>
    </>
  );
}
