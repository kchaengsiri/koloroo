# Changelog

All notable changes to Koloroo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-31

### Added
- **Koloroo Initial Release:** Official release of Koloroo ("Leap over the guesswork."), complete with updated `README.md`, `package.json`, and Next.js layout metadata.
- **Strict Cartesian HSL Engine (`src/utils/color.ts`):** Custom 2D canvas strictly mapped to Cartesian HSL percentages, dividing the color space into 5 mathematically precise aesthetic constraints (Pastel, Fresh, Neon, Darken, Somber) alongside an unbounded Free Mode.
- **Dynamic Favicon (`src/components/DynamicFavicon.tsx`):** Engineered a client-side component that continuously generates a real-time SVG favicon data-uri reflecting the user's active color selection.
- **Component Previews (`src/components/color-picker/ComponentPreview.tsx`):** A live widget including interactive examples for typography (H1, H2, H3, paragraphs, anchor tags) and standard UI components (buttons, badges) that respond directly to active color constraints.
- **Zustand State Management (`src/store/useColorStore.ts`):** Reactive global coordinate management store (`hue`, `saturation`, `lightness`, `activeZone`), handling performant mutations, 60fps drag tracking, and boundary constraint clamping.
- **Color Outputs (`src/components/color-picker/ColorOutput.tsx`):** Real-time generation and one-click copying of HEX, RGB, HSL strings, plus Tailwind config and CSS variable code blocks.
- **Vitest Unit Testing (`tests/color.test.ts`):** Comprehensive test coverages verifying Zod validations, mathematical bounding boxes, clamping constraints, and bidirectional color conversions.

### Changed
- **Default Startup State:** Set the initial startup color to a vibrant `hsl(55, 77%, 50%)` and the initial constraint to "Free Mode" to prevent unexpected snapping on load.
- **UI Simplification (`src/components/color-picker/TonalZoneCard.tsx`):** Minimalist "Constraint" selection cards, stripping unnecessary borders and percentage texts for a cleaner, modern aesthetic.
- **Dashboard Layout Re-ordering:** Optimized split layout focusing on intuitive reading ergonomics. Tonal constraint options and the 2D canvas sit on the left, while component previews and export outputs sit on the right.
- **Footer Updates:** Streamlined the application footer with version badging.
