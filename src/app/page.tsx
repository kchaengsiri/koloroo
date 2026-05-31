"use client";

import { Moon, Palette, Sliders, Sun, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { ColorCanvas } from "@/components/color-picker/ColorCanvas";
import { ColorOutput } from "@/components/color-picker/ColorOutput";
import { ComponentPreview } from "@/components/color-picker/ComponentPreview";
import { HueSlider } from "@/components/color-picker/HueSlider";
import { TonalZoneCard } from "@/components/color-picker/TonalZoneCard";
import { useColorStore } from "@/store/useColorStore";
import { hslToHex } from "@/utils/color";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { hue, saturation, lightness, activeZone } = useColorStore();
  const activeColorHex = hslToHex(hue, saturation, lightness);

  // Initialize and keep track of theme mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between space-y-8">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between select-none">
        <div className="flex items-center space-x-3 text-left">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg transition-transform duration-300 hover:rotate-12"
            style={{
              backgroundColor: activeColorHex,
              boxShadow: `0 8px 24px -4px ${activeColorHex}40`,
            }}
          >
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
              Koloroo
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Leap over the guesswork.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="glass-panel glass-panel-hover p-2.5 rounded-xl cursor-pointer"
            title="Toggle Light/Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 animate-in spin-in-45" />
            )}
          </button>
        </div>
      </header>

      {/* Main Core Dashboard Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Constraints, Canvas, Hue Control */}
        <section className="lg:col-span-7 flex flex-col space-y-8">
          {/* Aesthetic Constraining Zones */}
          <div className="glass-panel rounded-3xl p-6">
            <TonalZoneCard />
          </div>

          {/* 2D Canvas Container */}
          <div className="glass-panel rounded-3xl p-6 relative">
            {/* Ambient background glow linked to active color */}
            <div
              className="absolute -inset-1 rounded-3xl opacity-10 blur-2xl -z-10 transition-colors duration-500"
              style={{ backgroundColor: activeColorHex }}
            />

            <div className="flex flex-col space-y-5">
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center space-x-2 text-sm font-semibold">
                  <Sliders className="w-4 h-4 text-muted-foreground" />
                  <span>Color</span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground opacity-60 uppercase">
                  {activeZone ? `${activeZone} CONSTRAINT` : "FREE MODE"}
                </div>
              </div>

              {/* Hue control */}
              <HueSlider />

              {/* Core interactive canvas */}
              <ColorCanvas />
            </div>
          </div>
        </section>

        {/* Right Column: Previews & Exports */}
        <section className="lg:col-span-5 flex flex-col space-y-8">
          {/* Outputs and generators */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center space-x-2 text-sm font-semibold mb-4 text-left">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span>Export</span>
            </div>
            <ColorOutput />
          </div>

          {/* Interactive UI Component Previews */}
          <ComponentPreview />
        </section>
      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-border/40 pt-6 select-none flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
        <span className="font-mono text-[10px] opacity-75">V1.0.0</span>
        <span className="font-mono text-[10px] opacity-75">
          copyright &copy; 2026
        </span>
      </footer>
    </div>
  );
}
