"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useColorStore } from "@/store/useColorStore";
import { TONAL_ZONES, type TonalZoneId } from "@/utils/color";

export function ColorCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    hue,
    saturation,
    lightness,
    activeZone,
    setSaturationAndLightness,
    setActiveZone,
  } = useColorStore();

  // High-performance canvas drawing using a 64x64 grid upscaled by the browser.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const s = (x / (width - 1)) * 100;
        const l = 100 - (y / (height - 1)) * 100; // Inverted Y axis

        // HSL to RGB conversion inline for max speed in canvas loops
        const sNorm = s / 100;
        const lNorm = l / 100;
        const k = (n: number) => (n + hue / 30) % 12;
        const a = sNorm * Math.min(lNorm, 1 - lNorm);
        const f = (n: number) => {
          const kVal = k(n);
          return lNorm - a * Math.max(-1, Math.min(kVal - 3, 9 - kVal, 1));
        };

        const r = Math.round(f(0) * 255);
        const g = Math.round(f(8) * 255);
        const b = Math.round(f(4) * 255);

        const pixelIndex = (y * width + x) * 4;
        imgData.data[pixelIndex] = r;
        imgData.data[pixelIndex + 1] = g;
        imgData.data[pixelIndex + 2] = b;
        imgData.data[pixelIndex + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [hue]);

  // Handle pointer down / move / up gestures
  const handlePointerGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage coordinates
    const s = clamp((x / rect.width) * 100, 0, 100);
    const l = clamp(100 - (y / rect.height) * 100, 0, 100);

    setSaturationAndLightness(s, l);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerGesture(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handlePointerGesture(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  return (
    <div className="flex flex-col space-y-4">
      {/* 2D Interactive Canvas Frame */}
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden cursor-crosshair border border-border/60 bg-muted select-none touch-none shadow-inner"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Render Canvas (low resolution upscaled for performance) */}
        <canvas
          ref={canvasRef}
          width={64}
          height={64}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{ imageRendering: "auto" }}
        />

        {/* 3x3 Grid Overlay (visual transition guide) */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 select-none pointer-events-none z-10 opacity-30">
          <div className="border-r border-b border-white/40 border-dashed" />
          <div className="border-r border-b border-white/40 border-dashed" />
          <div className="border-b border-white/40 border-dashed" />
          <div className="border-r border-b border-white/40 border-dashed" />
          <div className="border-r border-b border-white/40 border-dashed" />
          <div className="border-b border-white/40 border-dashed" />
          <div className="border-r border-white/40 border-dashed" />
          <div className="border-r border-white/40 border-dashed" />
          <div />
        </div>

        {/* 5 Predefined Tonal Zone Bounding Boxes */}
        {Object.entries(TONAL_ZONES).map(([key, zone]) => {
          const { bounds, name } = zone;
          const isSelected = activeZone === key;

          // CSS percentages for absolute positioning
          const style = {
            left: `${bounds.sMin}%`,
            width: `${bounds.sMax - bounds.sMin}%`,
            top: `${100 - bounds.lMax}%`,
            height: `${bounds.lMax - bounds.lMin}%`,
          };

          return (
            <button
              type="button"
              key={key}
              style={style}
              onClick={(e) => {
                e.stopPropagation(); // Prevent canvas click from relocating pointer instantly
                setActiveZone(key as TonalZoneId);
              }}
              className={cn(
                "absolute cursor-pointer transition-all duration-300 z-10 flex items-center justify-center border group overflow-hidden select-none",
                isSelected
                  ? "border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "border-white/20 bg-black/5 hover:border-white/40 hover:bg-white/5",
              )}
            >
              {/* Compact Aesthetic Label */}
              <span
                className={cn(
                  "text-[9px] tracking-widest font-mono uppercase font-bold select-none transition-colors pointer-events-none rotate-90 sm:rotate-0",
                  isSelected
                    ? "text-white opacity-100"
                    : "text-white/30 group-hover:text-white/60",
                )}
              >
                {name}
              </span>
            </button>
          );
        })}

        {/* Drag Selection Node (Constrained Color Pointer) */}
        <div
          className={cn(
            "absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-20 pointer-events-none flex items-center justify-center",
            isDragging
              ? "transition-none"
              : "transition-all duration-300 ease-out",
          )}
          style={{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
          }}
        >
          {/* Inner pulsating ring */}
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
