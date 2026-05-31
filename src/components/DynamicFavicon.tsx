"use client";

import { useEffect } from "react";
import { useColorStore } from "@/store/useColorStore";
import { hslToHex } from "@/utils/color";

export function DynamicFavicon() {
  const { hue, saturation, lightness } = useColorStore();

  useEffect(() => {
    const hex = hslToHex(hue, saturation, lightness);
    // Create an aesthetic, modern app-like icon SVG using the active color
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" rx="60" fill="${hex}" />
        <circle cx="128" cy="128" r="64" fill="white" opacity="0.9" />
        <circle cx="128" cy="128" r="32" fill="${hex}" />
      </svg>
    `;
    const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

    // Find or create the favicon link tag
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.type = "image/svg+xml";
      link.rel = "icon";
      document.head.appendChild(link);
    }
    // Force the browser to refresh the icon
    link.type = "image/svg+xml";
    link.href = svgUrl;
  }, [hue, saturation, lightness]);

  return null;
}
