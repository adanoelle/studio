/**
 * BAYER DITHERING UTILITY
 *
 * Single source of truth for ordered dithering patterns.
 *
 * THEORETICAL GROUNDING:
 * Ordered dithering is a technical adaptation to color limitation.
 * The Bayer matrix creates perceived gradients from binary constraints,
 * embodying the tension between imposed systems and creative adaptation.
 *
 * When these patterns glitch or corrupt, the adaptation itself breaks
 * down - showing both the constraint and the refusal simultaneously.
 */

/**
 * 4x4 Bayer matrix - classic ordered dithering pattern.
 * 75% smaller than 8x8 while visually equivalent for web use.
 * Values normalized to 0-15 range.
 */
export const BAYER_MATRIX_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

/**
 * 8x8 Bayer matrix for higher fidelity dithering.
 * Used when smoother gradients are needed.
 * Values normalized to 0-63 range.
 */
export const BAYER_MATRIX_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
] as const;

export type BayerMatrix = typeof BAYER_MATRIX_4 | typeof BAYER_MATRIX_8;

/**
 * Generate SVG data URI for a Bayer dither pattern.
 *
 * @param color - CSS color value (hex, rgb, etc.)
 * @param matrix - Bayer matrix to use (default: 4x4)
 * @returns Data URI string for use in CSS background-image
 *
 * @example
 * ```ts
 * const pattern = generateBayerSVG('#404040');
 * element.style.backgroundImage = `url("${pattern}")`;
 * ```
 */
export function generateBayerSVG(color: string, matrix: BayerMatrix = BAYER_MATRIX_4): string {
  const size = matrix.length;
  const maxValue = size === 4 ? 16 : 64;

  const rects = matrix
    .flatMap((row, y) =>
      row.map(
        (val, x) =>
          `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" opacity="${val / maxValue}"/>`
      )
    )
    .join('');

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${rects}</svg>`
  )}`;
}

/**
 * Seeded random number generator for deterministic patterns.
 * Same seed + same inputs = same pattern (prevents flickering).
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate a corrupted Bayer pattern for dynamic glitch effects.
 *
 * As corruption level increases, the ordered pattern breaks down
 * into organic chaos - the technical constraint refusing itself.
 *
 * @param primaryColor - Base color of the pattern
 * @param corruptionColor - Color that bleeds in as corruption increases
 * @param level - Corruption level from 0 (none) to 1 (maximum)
 * @param seed - Random seed for deterministic corruption
 * @param matrix - Bayer matrix to use (default: 4x4)
 * @returns Data URI string for corrupted pattern
 *
 * @example
 * ```ts
 * const corrupted = generateCorruptedBayerSVG(
 *   '#1a0a2e',
 *   '#ff006e',
 *   0.5,
 *   Date.now()
 * );
 * ```
 */
export function generateCorruptedBayerSVG(
  primaryColor: string,
  corruptionColor: string,
  level: number,
  seed: number,
  matrix: BayerMatrix = BAYER_MATRIX_4
): string {
  const size = matrix.length;
  const maxValue = size === 4 ? 16 : 64;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const originalValue = matrix[y][x] / maxValue;

      // Deterministic corruption using seeded random
      const cellSeed = seed + y * size + x;
      const randomness = seededRandom(cellSeed) * level;
      const corruptedValue = Math.max(0, Math.min(1, originalValue + randomness - level / 2));

      // Color: blend between primary and corruption color
      const colorSeed = seed + y * size + x + 1000;
      const useCorruptionColor = seededRandom(colorSeed) < level;
      const color = useCorruptionColor ? corruptionColor : primaryColor;

      svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" opacity="${corruptedValue}"/>`;
    }
  }

  svg += '</svg>';

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Generate SVG data URI for a void texture pattern.
 *
 * Unlike Bayer dithering which uses ordered opacity, void textures
 * use color variations (noise) to create backdrop textures.
 *
 * THEORETICAL GROUNDING:
 * The void texture represents liminal space - the threshold between
 * contexts. When used as a backdrop (like modal-menu), it creates
 * a membrane between the current view and navigation possibilities.
 *
 * @param baseColor - CSS hex color value (e.g., '#2e2a28')
 * @param variance - Color variance from base (0-1), default 0.15
 * @returns Data URI string for use in CSS background-image
 *
 * @example
 * ```ts
 * const texture = generateVoidTextureSVG('#2e2a28', 0.15);
 * element.style.backgroundImage = `url("${texture}")`;
 * ```
 */
export function generateVoidTextureSVG(baseColor: string, variance: number = 0.15): string {
  // Parse hex color to RGB
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Generate 4x4 noise pattern with color variations
  const size = 4;
  const maxVariance = Math.round(255 * variance);

  // Deterministic noise pattern (matches positions used in modal-menu)
  const noisePattern = [
    [0.3, 0.1, 0.4, -0.2],
    [-0.1, 0.2, -0.3, 0.1],
    [0.2, -0.2, 0.1, 0.3],
    [-0.3, 0.15, -0.1, 0.25],
  ];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="${baseColor}"/>`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const noise = noisePattern[y][x];
      const offset = Math.round(noise * maxVariance);

      const nr = Math.max(0, Math.min(255, r + offset));
      const ng = Math.max(0, Math.min(255, g + offset));
      const nb = Math.max(0, Math.min(255, b + offset));

      const color = `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;

      svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
    }
  }

  svg += '</svg>';

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Pre-generated dither patterns for common colors.
 * Use these for static CSS to avoid runtime generation.
 */
export const DITHER_PATTERNS = {
  // Grayscale Bayer
  gray: generateBayerSVG('#404040'),
  grayDark: generateBayerSVG('#202020'),
  white: generateBayerSVG('#ffffff'),

  // Warm palette Bayer (Paean Black)
  warm: generateBayerSVG('#3a3632'),

  // Analog palette Bayer
  rose: generateBayerSVG('#8a5555'),
  teal: generateBayerSVG('#527878'),

  // Glitch palette Bayer
  magenta: generateBayerSVG('#ff00ff'),
  cyan: generateBayerSVG('#00ffff'),

  // Void textures (backdrop noise)
  voidWarm: generateVoidTextureSVG('#2e2a28', 0.15), // Warm gray backdrop
  voidCool: generateVoidTextureSVG('#1a1a1a', 0.15), // Cool gray backdrop
} as const;
