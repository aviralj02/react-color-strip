import { ColorValue } from "../types";

/**
 * Convert HSL to RGB
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
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

/**
 * Convert RGB to Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert Hex to RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Parse color string and return RGB values
 */
export function parseColor(
  color: string
): { r: number; g: number; b: number } | null {
  // Handle hex colors
  if (color.startsWith("#")) {
    return hexToRgb(color);
  }

  // Handle rgb colors
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  // Handle hsl colors
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    return hslToRgb(h, s, l);
  }

  return null;
}

/**
 * Create a ColorValue object from hue (0-360)
 */
export function createColorFromHue(hue: number): ColorValue {
  const rgb = hslToRgb(hue, 100, 50);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = { h: hue, s: 100, l: 50 };

  return { hex, rgb, hsl };
}

/**
 * Get hue from color string
 */
export function getHueFromColor(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 0;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.h;
}

/**
 * Create a ColorValue object from any color format
 */
export function createColorValue(color: string): ColorValue {
  const rgb = parseColor(color);
  if (!rgb) {
    // Default to red if parsing fails
    return createColorFromHue(0);
  }

  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return { hex, rgb, hsl };
}

/**
 * Linearly interpolate between two colors
 * @param from Starting hex color (e.g. "#ffffff")
 * @param to Ending hex color (e.g. "#000000")
 * @param t Interpolation value between 0 and 1
 * @returns Interpolated hex color
 */
export function mixColors(from: string, to: string, t: number): string {
  const fromRGB = hexToRgb(from);
  const toRGB = hexToRgb(to);
  if (!fromRGB || !toRGB) return from;

  const r = fromRGB.r + (toRGB.r - fromRGB.r) * t;
  const g = fromRGB.g + (toRGB.g - fromRGB.g) * t;
  const b = fromRGB.b + (toRGB.b - fromRGB.b) * t;

  return rgbToHex(r, g, b);
}
