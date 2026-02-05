/**
 * Device capability detection utilities.
 *
 * Uses feature queries (matchMedia) rather than user-agent sniffing
 * for reliable cross-browser capability detection.
 */

export interface DeviceCapabilities {
  /** Whether device is mobile (touch-primary, no hover) */
  isMobile: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
}

/**
 * Detect device capabilities using feature queries.
 * Shared across all glitch components to avoid duplicating detection logic.
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isMobile = !hasHover || hasCoarsePointer || window.innerWidth < 768;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return { isMobile, prefersReducedMotion };
}
