"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PolylinePoint, FenceType } from "@/types";
import { Undo2, Trash2, CheckCircle2 } from "lucide-react";

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
    // Semi-transparent band
    if (points.length >= 2) {
      ctx.strokeStyle = fenceType.color + "80";
      ctx.lineWidth = 24;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(points[0].x * canvasSize.width, points[0].y * canvasSize.height);
      for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x * canvasSize.width, points[i].y * canvasSize.height);
      ctx.stroke();
    }
    // Main line
    ctx.strokeStyle = fenceType.color;
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x * canvasSize.width, points[0].y * canvasSize.height);
    for (let i = 1; i < points.length; i++)
      ctx.lineTo(points[i].x * canvasSize.width, points[i].y * canvasSize.height);
    ctx.stroke();
    // Points
    points.forEach((point, index) => {
      const px = point.x * canvasSize.width, py = point.y * canvasSize.height;
      ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fillStyle = fenceType.color; ctx.fill();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText((index + 1).toString(), px, py);
    });
  }, [points, canvasSize, fenceType]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    onPointsChange([...points, { x, y }]);
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
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-400">Dodirnite na fotografiji gde želite ogradu. Minimalno 2 tačke.</p>
        <p className="text-xs text-gray-500 mt-1">Tačke: {points.length} / min. 2</p>
      </div>
      <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden shadow-xl border border-white/10">
        {canvasSize.width > 0 && (
          <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
            onClick={handleClick} onTouchStart={handleTouch}
            className="w-full h-auto cursor-crosshair touch-none"
            aria-label="Crtanje linije ograde na fotografiji" role="img" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button onClick={() => onPointsChange(points.slice(0, -1))} disabled={points.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Poništi poslednju tačku">
            <Undo2 size={16} />Poništi
          </button>
          <button onClick={() => onPointsChange([])} disabled={points.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Obriši sve tačke">
            <Trash2 size={16} />Obriši sve
          </button>
        </div>
        <button onClick={onDone} disabled={points.length < 2}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] transition-all duration-200"
          aria-label="Potvrdite liniju ograde">
          <CheckCircle2 size={18} />Gotovo
        </button>
      </div>
    </div>
  );
}
