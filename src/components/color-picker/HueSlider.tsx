"use client";

import type React from "react";
import { useRef, useState } from "react";
import { useColorStore } from "@/store/useColorStore";

export function HueSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { hue, setHue } = useColorStore();

  const handlePointerGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    // Map to 0-360 degrees
    setHue(percentage * 360);
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

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between text-sm px-1 select-none">
        <span className="font-semibold text-foreground">Hue</span>
        <span className="font-mono text-muted-foreground text-xs">
          {Math.round(hue)}°
        </span>
      </div>

      {/* Hue Gradient Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-6 w-full rounded-full cursor-pointer shadow-inner touch-none select-none border border-border/20"
        style={{
          background:
            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
        }}
      >
        {/* Drag Bezel Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 -ml-3 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.4)] border border-black/10 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-transform duration-100 z-10"
          style={{
            left: `${(hue / 360) * 100}%`,
          }}
        >
          {/* Inner colored preview dot */}
          <div
            className="w-3.5 h-3.5 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
            style={{
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
