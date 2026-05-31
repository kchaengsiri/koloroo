import { describe, expect, it } from "vitest";
import {
  constrainToZone,
  getZoneForColor,
  HSLSchema,
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  TONAL_ZONES,
} from "../src/utils/color";

describe("HSL boundary Zod validations", () => {
  it("should pass for valid HSL coordinates", () => {
    const valid = { h: 180, s: 50, l: 50 };
    expect(() => HSLSchema.parse(valid)).not.toThrow();
  });

  it("should throw for values out of bounds", () => {
    expect(() => HSLSchema.parse({ h: 361, s: 50, l: 50 })).toThrow();
    expect(() => HSLSchema.parse({ h: 180, s: -1, l: 50 })).toThrow();
    expect(() => HSLSchema.parse({ h: 180, s: 50, l: 101 })).toThrow();
  });
});

describe("Color conversions", () => {
  it("converts HSL to RGB correctly", () => {
    // Pure Red: HSL(0, 100%, 50%) -> RGB(255, 0, 0)
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });

    // Pure Green: HSL(120, 100%, 50%) -> RGB(0, 255, 0)
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });

    // Pure Blue: HSL(240, 100%, 50%) -> RGB(0, 0, 255)
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });

    // White: HSL(0, 0%, 100%) -> RGB(255, 255, 255)
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });

    // Black: HSL(0, 0%, 0%) -> RGB(0, 0, 0)
    expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("converts RGB to HSL correctly", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
    expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
    expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
    expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
  });

  it("handles HEX to RGB and RGB to HEX bidirectional conversions", () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe("#FF0000");
    expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });

    // Short Hex
    expect(hexToRgb("#F00")).toEqual({ r: 255, g: 0, b: 0 });

    // Non-hash inputs
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });
});

describe("Tonal Zone constraints", () => {
  it("clamps coordinates strictly inside the zone boundaries", () => {
    // Pastel bounds: s: [33.33, 100], l: [66.66, 100]
    const bounds = TONAL_ZONES.PASTEL.bounds;

    // Fully outside (too high lightness, saturation is within range)
    const result1 = constrainToZone(80, 102, bounds);
    expect(result1).toEqual({ s: 80, l: 100 });

    // Fully outside (too low saturation and lightness)
    const result2 = constrainToZone(5, 50, bounds);
    expect(result2).toEqual({ s: 33.33, l: 66.66 });

    // Saturation outside, lightness inside
    const result3 = constrainToZone(25, 80, bounds);
    expect(result3).toEqual({ s: 33.33, l: 80 });
  });

  it("determines the correct zone for a given HSL coordinate", () => {
    // Neon check: S=95%, L=50%
    expect(getZoneForColor(95, 50)).toBe("NEON");

    // Pastel check: S=35%, L=80%
    expect(getZoneForColor(35, 80)).toBe("PASTEL");

    // Outside all zones
    expect(getZoneForColor(20, 50)).toBeNull();
  });
});
