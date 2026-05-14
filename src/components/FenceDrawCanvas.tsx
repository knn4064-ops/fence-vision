"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PolylinePoint, FenceType } from "@/types";

interface FenceDrawCanvasProps {
  imageSrc: string;
  fenceType: FenceType;
  points: PolylinePoint[];
  onPointsChange: (points: PolylinePoint[]) => void;
  onDone: () => void;
}

export default function FenceDrawCanvas({
  imageSrc, fenceType, points, onPointsChange, onDone,
}: FenceDrawCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; setImageLoaded(true); };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!imageLoaded || !imgRef.current || !containerRef.current) return;
    const updateSize = () => {
      const c = containerRef.current;
      if (!c || !imgRef.current) return;
      const w = c.clientWidth;
      const h = w / (imgRef.current.naturalWidth / imgRef.current.naturalHeight);
      setCanvasSize({ width: w, height: h });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [imageLoaded]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !canvasSize.width) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);

    if (points.length === 0) return;

    // Semi-transparent cognac vertical extrusion (architectural projection)
    if (points.length >= 2) {
      ctx.strokeStyle = "rgba(139, 111, 71, 0.15)";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(points[0].x * canvasSize.width, points[0].y * canvasSize.height);
      for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x * canvasSize.width, points[i].y * canvasSize.height);
      ctx.stroke();
    }

    // Main line — thin 1.5px in ink
    ctx.strokeStyle = "#1C1917";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x * canvasSize.width, points[0].y * canvasSize.height);
    for (let i = 1; i < points.length; i++)
      ctx.lineTo(points[i].x * canvasSize.width, points[i].y * canvasSize.height);
    ctx.stroke();

    // Points — small cognac filled circles
    points.forEach((point) => {
      const px = point.x * canvasSize.width;
      const py = point.y * canvasSize.height;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#8B6F47";
      ctx.fill();
    });
  }, [points, canvasSize]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    onPointsChange([...points, { x, y }]);
    // Trigger ripple
    setRipple({ x: clientX - rect.left, y: clientY - rect.top, key: Date.now() });
  }, [points, onPointsChange]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handleCanvasInteraction(e.clientX, e.clientY);
  }, [handleCanvasInteraction]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) handleCanvasInteraction(touch.clientX, touch.clientY);
  }, [handleCanvasInteraction]);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <p className="section-number mb-4">03 — Pozicija ograde</p>
        <p className="body-m">
          Označite gde želite ogradu — kliknite tačke duž ivice
        </p>
        <p className="caption mt-2" style={{ textTransform: "none", letterSpacing: "normal", fontSize: "0.75rem" }}>
          Tačke: {points.length} / min. 2
        </p>
      </motion.div>

      {/* Canvas container with architectural frame */}
      <motion.div
        ref={containerRef}
        className="relative w-full border border-hairline"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ margin: "0 auto", maxWidth: "900px" }}
      >
        {canvasSize.width > 0 && (
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleClick}
            onTouchStart={handleTouch}
            className="w-full h-auto cursor-crosshair touch-none"
            aria-label="Crtanje linije ograde na fotografiji"
            role="img"
          />
        )}
        {/* Ripple animation */}
        {ripple && (
          <motion.div
            key={ripple.key}
            className="absolute pointer-events-none rounded-full border border-cognac"
            style={{ left: ripple.x - 4, top: ripple.y - 4 }}
            initial={{ width: 8, height: 8, opacity: 1 }}
            animate={{ width: 32, height: 32, opacity: 0, x: -12, y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            aria-hidden="true"
          />
        )}
      </motion.div>

      {/* Tool buttons — minimal outline */}
      <div className="flex items-center justify-between gap-4 mt-6 max-w-[900px] mx-auto">
        <div className="flex gap-3">
          <button
            onClick={() => onPointsChange(points.slice(0, -1))}
            disabled={points.length === 0}
            className="text-link btn-text disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Poništi poslednju tačku"
          >
            Poništi
          </button>
          <span className="text-hairline">|</span>
          <button
            onClick={() => onPointsChange([])}
            disabled={points.length === 0}
            className="text-link btn-text disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Obriši sve tačke"
          >
            Obriši sve
          </button>
        </div>
        <button
          onClick={onDone}
          disabled={points.length < 2}
          className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Potvrdite liniju ograde"
        >
          Gotovo
        </button>
      </div>
    </div>
  );
}
