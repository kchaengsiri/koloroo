"use client";

import { Check, Code, Copy, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useColorStore } from "@/store/useColorStore";
import {
  getCssVariables,
  getTailwindConfig,
  hslToRgb,
  rgbToHex,
} from "@/utils/color";

export function ColorOutput() {
  const {
    hue,
    saturation,
    lightness,
    setColorFromHex,
    setColorFromRgb,
    setColorFromHsl,
  } = useColorStore();

  // Local input state to prevent typing lag
  const [hexInput, setHexInput] = useState("");
  const [rgbInput, setRgbInput] = useState({ r: 0, g: 0, b: 0 });
  const [hslInput, setHslInput] = useState({ h: 0, s: 0, l: 0 });

  // Clipboard copy feedback states
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Derive final values
  const rgb = hslToRgb(hue, saturation, lightness);
  const { r, g, b } = rgb;
  const hex = rgbToHex(rgb);
  const hslString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  // Sync inputs with global state
  useEffect(() => {
    setHexInput(hex);
    setRgbInput({ r, g, b });
    setHslInput({ h: hue, s: saturation, l: lightness });
  }, [hue, saturation, lightness, hex, r, g, b]);

  // Handle Clipboard Copy
  const copyToClipboard = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    setTimeout(() => {
      setCopiedFormat(null);
    }, 2000);
  };

  // Input Change Handlers
  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (
      /^#[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{3}$/.test(val) ||
      /^[0-9A-Fa-f]{6}$/.test(val)
    ) {
      setColorFromHex(val);
    }
  };

  const handleRgbFieldChange = (field: "r" | "g" | "b", val: string) => {
    const num = parseInt(val, 10) || 0;
    const clamped = Math.max(0, Math.min(255, num));
    const newRgb = { ...rgbInput, [field]: clamped };
    setRgbInput(newRgb);
    setColorFromRgb(newRgb.r, newRgb.g, newRgb.b);
  };

  const handleHslFieldChange = (field: "h" | "s" | "l", val: string) => {
    const num = parseInt(val, 10) || 0;
    const maxVal = field === "h" ? 360 : 100;
    const clamped = Math.max(0, Math.min(maxVal, num));
    const newHsl = { ...hslInput, [field]: clamped };
    setHslInput(newHsl);
    setColorFromHsl(newHsl.h, newHsl.s, newHsl.l);
  };

  return (
    <div className="flex flex-col space-y-5 select-none">
      {/* Visual Color Showcase Bar */}
      <div className="flex items-center space-x-4">
        {/* Large Swatch Display */}
        <div
          className="w-16 h-16 rounded-2xl shadow-xl shadow-black/10 border border-white/20 transition-all duration-300 relative overflow-hidden flex-shrink-0"
          style={{ backgroundColor: hex }}
        >
          {/* subtle lighting glaze */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10" />
        </div>

        <div className="flex flex-col space-y-1 items-start text-left">
          <span className="font-semibold text-foreground text-base font-mono">
            {hex}
          </span>
          <span className="text-xs text-muted-foreground font-mono leading-none">
            {hslString}
          </span>
          <span className="text-xs text-muted-foreground font-mono leading-none">
            {rgbString}
          </span>
        </div>
      </div>

      {/* Copyable Color Formats Panel */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* HEX Output Row */}
        <div className="flex flex-col space-y-1.5 text-left">
          <span className="text-xs font-semibold text-muted-foreground">
            HEX Color
          </span>
          <div className="flex space-x-2">
            <Input
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              className="font-mono text-sm uppercase glass-panel focus-visible:ring-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(hex, "HEX")}
              className="glass-panel glass-panel-hover aspect-square"
            >
              {copiedFormat === "HEX" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* HSL Fields Row */}
        <div className="flex flex-col space-y-1.5 text-left">
          <span className="text-xs font-semibold text-muted-foreground">
            HSL Channels
          </span>
          <div className="flex space-x-2">
            <div className="grid grid-cols-3 gap-2 flex-grow">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground font-mono">
                  H
                </span>
                <Input
                  type="number"
                  value={hslInput.h}
                  onChange={(e) => handleHslFieldChange("h", e.target.value)}
                  className="pl-6 font-mono text-xs glass-panel focus-visible:ring-1"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground font-mono">
                  S
                </span>
                <Input
                  type="number"
                  value={hslInput.s}
                  onChange={(e) => handleHslFieldChange("s", e.target.value)}
                  className="pl-6 font-mono text-xs glass-panel focus-visible:ring-1"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground font-mono">
                  L
                </span>
                <Input
                  type="number"
                  value={hslInput.l}
                  onChange={(e) => handleHslFieldChange("l", e.target.value)}
                  className="pl-6 font-mono text-xs glass-panel focus-visible:ring-1"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(hslString, "HSL")}
              className="glass-panel glass-panel-hover aspect-square"
            >
              {copiedFormat === "HSL" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* RGB Fields Row */}
        <div className="flex flex-col space-y-1.5 text-left">
          <span className="text-xs font-semibold text-muted-foreground">
            RGB Channels
          </span>
          <div className="flex space-x-2">
            <div className="grid grid-cols-3 gap-2 flex-grow">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground font-mono">
                  R
                </span>
                <Input
                  type="number"
                  value={rgbInput.r}
                  onChange={(e) => handleRgbFieldChange("r", e.target.value)}
                  className="pl-6 font-mono text-xs glass-panel focus-visible:ring-1"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground font-mono">
                  G
                </span>
                <Input
                  type="number"
                  value={rgbInput.g}
                  onChange={(e) => handleRgbFieldChange("g", e.target.value)}
                  className="pl-6 font-mono text-xs glass-panel focus-visible:ring-1"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground font-mono">
                  B
                </span>
                <Input
                  type="number"
                  value={rgbInput.b}
                  onChange={(e) => handleRgbFieldChange("b", e.target.value)}
                  className="pl-6 font-mono text-xs glass-panel focus-visible:ring-1"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(rgbString, "RGB")}
              className="glass-panel glass-panel-hover aspect-square"
            >
              {copiedFormat === "RGB" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Developer Copy Presets */}
      <div className="flex flex-col space-y-2.5 text-left border-t border-border/40 pt-4">
        <span className="text-xs font-semibold text-foreground flex items-center">
          <Terminal className="w-3.5 h-3.5 mr-1.5 opacity-70" /> Developer
          Exports
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* CSS Variables */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                getCssVariables(hue, saturation, lightness),
                "CSS_VARS",
              )
            }
            className="glass-panel glass-panel-hover flex items-center justify-center space-x-1.5 text-xs h-9 py-0 cursor-pointer"
          >
            {copiedFormat === "CSS_VARS" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 animate-in fade-in" />
                <span>Copied CSS</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>CSS Variables</span>
              </>
            )}
          </Button>

          {/* Tailwind Color Extension */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                getTailwindConfig(hue, saturation, lightness),
                "TW_CONFIG",
              )
            }
            className="glass-panel glass-panel-hover flex items-center justify-center space-x-1.5 text-xs h-9 py-0 cursor-pointer"
          >
            {copiedFormat === "TW_CONFIG" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 animate-in fade-in" />
                <span>Copied Config</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>Tailwind Config</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
