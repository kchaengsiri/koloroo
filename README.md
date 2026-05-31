# Koloroo

**Leap over the guesswork.**

Koloroo is a high-performance, mathematically precise HSL constraint color picker engineered for UI/UX designers and developers. It leverages a strict 3x3 Cartesian grid system mapped to HSL (Hue, Saturation, Lightness) percentages, allowing users to physically snap their color selection to 5 distinct aesthetic tonal zones.

## Features
- **Strict Cartesian Engine:** A custom 2D canvas that maps X (Saturation) and Y (Lightness) directly to rigorous percentages.
- **5 Tonal Constraints:** Effortlessly snap the selector into Pastel, Fresh, Neon, Darken, or Somber bounds without tedious manual searching.
- **Dynamic Previews:** Instantly see how your selected color cascades across UI components (buttons, badges, typography).
- **Fast & Responsive:** Powered by Next.js, Zustand, and a 60fps canvas loop.

## Tonal Zones

The canvas is rigidly segmented into exact geometric thirds:
- **Pastel**: Soft, muted, light (S: 33-100%, L: 67-100%)
- **Fresh**: Vibrant, airy, clear (S: 50-100%, L: 56-67%)
- **Neon**: Intense, piercing, electric (S: 67-100%, L: 44-56%)
- **Darken**: Deep, rich, saturated (S: 50-100%, L: 33-44%)
- **Somber**: Moody, subdued, dim (S: 33-100%, L: 0-33%)

## Getting Started

1. Clone the repository and install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) to start snapping colors.

## Credits

Inspired by: IG:uxui_howard.le
