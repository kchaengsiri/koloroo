import { create } from "zustand";
import {
  clamp,
  constrainToZone,
  getZoneForColor,
  hexToHsl,
  rgbToHsl,
  TONAL_ZONES,
  type TonalZoneId,
} from "@/utils/color";

interface ColorState {
  // Coordinates
  hue: number; // 0-360
  saturation: number; // 0-100
  lightness: number; // 0-100

  // App state
  activeZone: TonalZoneId | null; // null represents Free Selection / Unconstrained mode
  colorMode: "HSL" | "RGB" | "HEX";

  // Actions
  setHue: (h: number) => void;
  setSaturation: (s: number) => void;
  setLightness: (l: number) => void;
  setSaturationAndLightness: (s: number, l: number) => void;
  setActiveZone: (zoneId: TonalZoneId | null) => void;
  setColorMode: (mode: "HSL" | "RGB" | "HEX") => void;

  // Direct inputs
  setColorFromHex: (hex: string) => boolean;
  setColorFromRgb: (r: number, g: number, b: number) => boolean;
  setColorFromHsl: (h: number, s: number, l: number) => boolean;
}

export const useColorStore = create<ColorState>((set, get) => ({
  // Defaults
  hue: 55,
  saturation: 77,
  lightness: 50,
  activeZone: null, // Start in Free Mode to accommodate specific exact color
  colorMode: "HSL",

  setHue: (h) => {
    const clampedH = clamp(Math.round(h), 0, 360);
    set({ hue: clampedH });
  },

  setSaturation: (s) => {
    const { activeZone, lightness } = get();
    let targetS = clamp(s, 0, 100);

    if (activeZone) {
      const bounds = TONAL_ZONES[activeZone].bounds;
      const constrained = constrainToZone(targetS, lightness, bounds);
      targetS = constrained.s;
    }

    set({ saturation: Math.round(targetS) });
  },

  setLightness: (l) => {
    const { activeZone, saturation } = get();
    let targetL = clamp(l, 0, 100);

    if (activeZone) {
      const bounds = TONAL_ZONES[activeZone].bounds;
      const constrained = constrainToZone(saturation, targetL, bounds);
      targetL = constrained.l;
    }

    set({ lightness: Math.round(targetL) });
  },

  setSaturationAndLightness: (s, l) => {
    const { activeZone } = get();
    let targetS = clamp(s, 0, 100);
    let targetL = clamp(l, 0, 100);

    if (activeZone) {
      const bounds = TONAL_ZONES[activeZone].bounds;
      const constrained = constrainToZone(targetS, targetL, bounds);
      targetS = constrained.s;
      targetL = constrained.l;
    }

    set({
      saturation: Math.round(targetS),
      lightness: Math.round(targetL),
    });
  },

  setActiveZone: (zoneId) => {
    if (zoneId === null) {
      set({ activeZone: null });
      return;
    }

    const { saturation, lightness } = get();
    const bounds = TONAL_ZONES[zoneId].bounds;

    // Clamp current coords to newly active zone bounds
    const { s: newS, l: newL } = constrainToZone(saturation, lightness, bounds);

    set({
      activeZone: zoneId,
      saturation: Math.round(newS),
      lightness: Math.round(newL),
    });
  },

  setColorMode: (mode) => set({ colorMode: mode }),

  setColorFromHex: (hex) => {
    const hsl = hexToHsl(hex);
    if (!hsl) return false;

    const matchedZone = getZoneForColor(hsl.s, hsl.l);

    set({
      hue: hsl.h,
      saturation: hsl.s,
      lightness: hsl.l,
      // If we are in unconstrained mode or the color fits inside the current zone, maintain the zone
      // Else, update the zone to the new matching zone, or clear it if it doesn't match any
      activeZone: matchedZone,
    });
    return true;
  },

  setColorFromRgb: (r, g, b) => {
    try {
      const hsl = rgbToHsl(r, g, b);
      const matchedZone = getZoneForColor(hsl.s, hsl.l);

      set({
        hue: hsl.h,
        saturation: hsl.s,
        lightness: hsl.l,
        activeZone: matchedZone,
      });
      return true;
    } catch {
      return false;
    }
  },

  setColorFromHsl: (h, s, l) => {
    const clampedH = clamp(h, 0, 360);
    const clampedS = clamp(s, 0, 100);
    const clampedL = clamp(l, 0, 100);

    const matchedZone = getZoneForColor(clampedS, clampedL);

    set({
      hue: Math.round(clampedH),
      saturation: Math.round(clampedS),
      lightness: Math.round(clampedL),
      activeZone: matchedZone,
    });
    return true;
  },
}));
