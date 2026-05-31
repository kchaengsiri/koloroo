"use client";

import { CheckCircle2, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useColorStore } from "@/store/useColorStore";
import { hslToHex, hslToRgb } from "@/utils/color";

export function ComponentPreview() {
  const { hue, saturation, lightness } = useColorStore();

  const rgb = hslToRgb(hue, saturation, lightness);
  const hex = hslToHex(hue, saturation, lightness);

  // Decide text contrast color for the solid button background
  const isLightColor = lightness > 65;
  const buttonTextColor = isLightColor
    ? "rgb(15, 23, 42)"
    : "rgb(255, 255, 255)";

  // Calculate matching shades for badges and alerts
  const badgeBg = `hsl(${hue}, ${Math.max(10, saturation - 10)}%, ${isLightColor ? 90 : 93}%)`;
  const badgeText = `hsl(${hue}, ${Math.max(30, saturation)}%, ${isLightColor ? 25 : 30}%)`;

  const glowStyle = {
    boxShadow: `0 4px 20px -2px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
  };

  return (
    <div className="flex flex-col space-y-4 select-none text-left">
      <div className="flex items-center space-x-2 text-sm px-1">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-semibold text-foreground">Component Preview</span>
      </div>

      <Card className="glass-panel p-5 space-y-5">
        {/* Row 1: Badges & Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            style={{ backgroundColor: badgeBg, color: badgeText }}
            className="border-none font-medium px-2.5 py-1 rounded-full text-xs"
          >
            Aesthetic Tag
          </Badge>
          <Badge
            variant="outline"
            style={{ borderColor: hex, color: hex }}
            className="font-mono text-[10px] px-2.5 py-0.5 rounded-full"
          >
            {hex}
          </Badge>
          <Badge
            style={{ backgroundColor: hex, color: buttonTextColor }}
            className="border-none font-semibold px-2 py-0.5 rounded-md text-[10px] uppercase"
          >
            New Release
          </Badge>
        </div>

        {/* Row 2: Standard UI Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Solid Theme Button */}
          <button
            type="button"
            style={{
              backgroundColor: hex,
              color: buttonTextColor,
              ...glowStyle,
            }}
            className="w-full h-10 rounded-xl font-medium text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-[0.98] hover:opacity-90 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Service</span>
          </button>

          {/* Outline Theme Button */}
          <button
            type="button"
            style={{
              borderColor: hex,
              color: hex,
            }}
            className="w-full h-10 rounded-xl font-medium text-xs flex items-center justify-center space-x-1.5 border hover:bg-muted/10 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Learn More</span>
          </button>
        </div>

        {/* Row 3: Aesthetic Notification Alert Box */}
        <div
          className="rounded-xl border border-l-4 p-3.5 flex items-start space-x-3 bg-muted/20 backdrop-blur-md"
          style={{
            borderLeftColor: hex,
            borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
          }}
        >
          <CheckCircle2
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: hex }}
          />
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-bold text-foreground">
              Action Success
            </span>
            <span className="text-[11px] text-muted-foreground leading-normal">
              Color changes have been compiled and mapped perfectly to your
              system UI components.
            </span>
          </div>
        </div>

        {/* Row 4: Typography Examples */}
        <div className="flex flex-col space-y-3 pt-3 border-t border-border/40">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: hex }}
          >
            Heading 1
          </h1>
          <h2
            className="text-xl font-semibold tracking-tight text-foreground border-b pb-1.5"
            style={{ borderColor: hex }}
          >
            Heading 2 with Accent Border
          </h2>
          <h3 className="text-lg font-medium text-foreground">Heading 3</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is a standard paragraph demonstrating how text flows within
            your layout. Here is an example of an{" "}
            <a
              href="#typography"
              className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-80"
              style={{ color: hex }}
            >
              interactive text link
            </a>{" "}
            that inherits the active color.
          </p>
        </div>
      </Card>
    </div>
  );
}
