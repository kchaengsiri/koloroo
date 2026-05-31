"use client";

import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useColorStore } from "@/store/useColorStore";
import { TONAL_ZONES, type TonalZoneId } from "@/utils/color";

export function TonalZoneCard() {
  const { hue, activeZone, setActiveZone } = useColorStore();

  return (
    <div className="flex flex-col space-y-3 select-none text-left">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-semibold text-muted-foreground flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1.5 opacity-70" />
          Constraint
        </span>
        <Badge
          variant="secondary"
          className="text-[9px] font-mono py-0 px-1.5 opacity-80 uppercase"
        >
          {activeZone ? `${activeZone} Active` : "Free Mode"}
        </Badge>
      </div>

      {/* Compact Responsive Horizontal Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {/* Five Predefined Tonal Zone Buttons */}
        {Object.entries(TONAL_ZONES).map(([key, zone]) => {
          const { id, name, bounds } = zone;
          const isSelected = activeZone === key;

          // Calculate center of zone to show representational color swatch matching active Hue
          const sCenter = Math.round((bounds.sMin + bounds.sMax) / 2);
          const lCenter = Math.round((bounds.lMin + bounds.lMax) / 2);
          const swatchHsl = `hsl(${hue}, ${sCenter}%, ${lCenter}%)`;

          return (
            <button
              type="button"
              key={id}
              onClick={() => setActiveZone(key as TonalZoneId)}
              className={cn(
                "group cursor-pointer p-2 rounded-xl transition-all duration-300 flex flex-col items-center select-none focus:outline-none focus:ring-1 focus:ring-primary/50",
                isSelected
                  ? "bg-primary/10 shadow-sm"
                  : "bg-card/45 hover:bg-card/85",
              )}
            >
              <div
                className="w-full h-8 rounded-lg transition-all duration-300 group-hover:scale-[1.03]"
                style={{ backgroundColor: swatchHsl }}
              />

              <div className="flex flex-col items-center mt-1.5 space-y-0.5 w-full text-center">
                <span
                  className={cn(
                    "text-xs font-bold tracking-tight transition-colors truncate max-w-full",
                    isSelected
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {name}
                </span>
              </div>
            </button>
          );
        })}

        {/* Free Selection Card */}
        <button
          type="button"
          onClick={() => setActiveZone(null)}
          className={cn(
            "group cursor-pointer p-2 rounded-xl transition-all duration-300 flex flex-col items-center select-none focus:outline-none focus:ring-1 focus:ring-primary/50",
            activeZone === null
              ? "bg-foreground/5 shadow-sm"
              : "bg-card/45 hover:bg-card/85",
          )}
        >
          <div
            className="w-full h-8 rounded-lg transition-all duration-300 group-hover:scale-[1.03]"
            style={{
              background:
                "conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)",
            }}
          />

          <div className="flex flex-col items-center mt-1.5 space-y-0.5 w-full text-center">
            <span
              className={cn(
                "text-xs font-bold tracking-tight transition-colors truncate max-w-full",
                activeZone === null
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              Free Mode
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
