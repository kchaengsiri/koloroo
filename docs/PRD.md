# Product Requirements Document (PRD)
**Product Name:** Koloroo
**Document Status:** Approved
**Target Audience:** UI/UX Designers, Graphic Designers, Web Developers

---

## 1. Overview & Objective
Designers often waste time manually hunting for the perfect shade within standard color pickers. **Koloroo** leverages the **HSL (Hue, Saturation, Lightness)** color space to divide the gradient into 5 mathematically rigid tonal zones. By snapping the color selection node to these zones, users can rapidly extract colors based on aesthetic mood (Pastel, Neon, Somber, etc.) without guesswork.

---

## 2. Key Features & Requirements

### 2.1 Pure HSL Color Engine
* **Requirement:** The core rendering and selection engine must operate exclusively in HSL. Standard HSV mapping must not be used for the 2D canvas.

### 2.2 The Cartesian Saturation/Lightness Grid
* **Requirement:** The 2D canvas must map X and Y coordinates strictly to HSL percentages.
* **X-Axis:** Represents Saturation (0% far left, 100% far right).
* **Y-Axis:** Represents Lightness (100% top, 0% bottom).

### 2.3 The 5 Tonal Zones (Strict Grid Boundaries)
* **Requirement:** The canvas is segmented into 5 distinct areas based strictly on a 3x3 geometric grid (exact thirds). The draggable selector node must physically snap to, and be confined within, the active area's coordinates.
* **Zone Definitions & Boundaries:**
    * **Zone 1: Pastel:** Saturation `33.33-100%` | Lightness `66.66-100%`
    * **Zone 2: Fresh:** Saturation `50-100%` | Lightness `55.55-66.66%`
    * **Zone 3: Neon:** Saturation `66.66-100%` | Lightness `44.44-55.55%`
    * **Zone 4: Darken:** Saturation `50-100%` | Lightness `33.33-44.44%`
    * **Zone 5: Somber:** Saturation `33.33-100%` | Lightness `0-33.33%`

---

## 3. User Flow
1.  **Select Hue:** Adjust a 0-360 degree slider.
2.  **Choose Zone:** Click one of the 5 predefined Tonal Zones. The selector node will instantly snap inside that zone's boundary.
3.  **Fine-tune:** Drag the selector node. It will physically hit a "wall" if attempting to drag outside the active zone's mathematical bounds.
4.  **Export:** Copy the resulting HSL, HEX, or RGB values.
