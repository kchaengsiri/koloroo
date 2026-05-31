import { z } from "zod";

// ==========================================
// Zod Schemas for Rigid Type Boundaries
// ==========================================

export const HSLSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

export type HSL = z.infer<typeof HSLSchema>;

export const RGBSchema = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
});

export type RGB = z.infer<typeof RGBSchema>;

export const ZoneBoundsSchema = z.object({
  sMin: z.number().min(0).max(100),
  sMax: z.number().min(0).max(100),
  lMin: z.number().min(0).max(100),
  lMax: z.number().min(0).max(100),
});

export type ZoneBounds = z.infer<typeof ZoneBoundsSchema>;

// ==========================================
// Predefined Tonal Zones
// ==========================================

export const TONAL_ZONES = {
  PASTEL: {
    id: "PASTEL",
    name: "Pastel",
    description:
      "Soft, muted, and light. Perfect for backgrounds and subtle interfaces.",
    bounds: { sMin: 33.33, sMax: 100, lMin: 66.66, lMax: 100 },
    color: "hsl(280, 40%, 85%)",
  },
  FRESH: {
    id: "FRESH",
    name: "Fresh",
    description:
      "Clean, vibrant, and airy. Excellent for brand accent elements.",
    bounds: { sMin: 50, sMax: 100, lMin: 55.55, lMax: 66.66 },
    color: "hsl(140, 70%, 61%)",
  },
  NEON: {
    id: "NEON",
    name: "Neon",
    description:
      "Bright, intense, and highly saturated. Demands high visual attention.",
    bounds: { sMin: 66.66, sMax: 100, lMin: 44.44, lMax: 55.55 },
    color: "hsl(60, 95%, 50%)",
  },
  DARKEN: {
    id: "DARKEN",
    name: "Darken",
    description:
      "Deep, rich, and grounded. Ideal for secondary panels or text contrasts.",
    bounds: { sMin: 50, sMax: 100, lMin: 33.33, lMax: 44.44 },
    color: "hsl(210, 70%, 38%)",
  },
  SOMBER: {
    id: "SOMBER",
    name: "Somber",
    description:
      "Dark, muted, and moody. Designed for luxury or atmospheric dark modes.",
    bounds: { sMin: 33.33, sMax: 100, lMin: 0, lMax: 33.33 },
    color: "hsl(240, 35%, 20%)",
  },
} as const;

export type TonalZoneId = keyof typeof TONAL_ZONES;

// ==========================================
// Clamping & Constraining Functions
// ==========================================

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function constrainToZone(
  s: number,
  l: number,
  bounds: ZoneBounds,
): { s: number; l: number } {
  return {
    s: clamp(s, bounds.sMin, bounds.sMax),
    l: clamp(l, bounds.lMin, bounds.lMax),
  };
}

export function getZoneForColor(s: number, l: number): TonalZoneId | null {
  for (const [key, zone] of Object.entries(TONAL_ZONES)) {
    const { bounds } = zone;
    if (
      s >= bounds.sMin &&
      s <= bounds.sMax &&
      l >= bounds.lMin &&
      l <= bounds.lMax
    ) {
      return key as TonalZoneId;
    }
  }
  return null;
}

// ==========================================
// HSL <-> RGB <-> HEX Conversions
// ==========================================

export function hslToRgb(h: number, s: number, l: number): RGB {
  // Validate input parameters
  HSLSchema.parse({ h, s, l });

  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const kVal = k(n);
    return l - a * Math.max(-1, Math.min(kVal - 3, 9 - kVal, 1));
  };

  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);

  return { r, g, b };
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  // Validate input parameters
  RGBSchema.parse({ r, g, b });

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex: string): RGB | null {
  const cleanHex = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }

  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  try {
    return RGBSchema.parse({ r, g, b });
  } catch {
    return null;
  }
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb);
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// ==========================================
// Code Export Generators
// ==========================================

export function getCssVariables(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb);
  return `:root {
  --color-primary-hsl: ${h} ${s}% ${l}%;
  --color-primary-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};
  --color-primary-hex: ${hex};
}`;
}

export function getTailwindConfig(h: number, s: number, l: number): string {
  const hex = hslToHex(h, s, l);
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'hsl(${h} ${s}% ${l}%)',
          DEFAULT: '${hex}',
        }
      }
    }
  }
}`;
}
