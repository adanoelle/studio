/**
 * Archive Data Types
 *
 * TypeScript interfaces for archive items, shared between
 * the data layer and UI components.
 */

export interface ArchiveItemBase {
  /** URL-safe slug identifier */
  id: string;
  /** Content type */
  type: 'image' | 'writing' | 'sound' | 'code';
  /** Display title */
  title: string;
  /** Creation date (ISO 8601: YYYY-MM-DD) */
  date: string;
  /** Tags for filtering */
  tags: string[];
  /** Optional markdown description */
  notes?: string;
}

export interface ImageItem extends ArchiveItemBase {
  type: 'image';
  /** Full-size image URL */
  src: string;
  /** Thumbnail URL (optional, falls back to src) */
  thumbnail?: string;
  /** Alt text for accessibility */
  alt: string;
}

export interface WritingItem extends ArchiveItemBase {
  type: 'writing';
  /** Short excerpt for card display (~100 chars) */
  excerpt: string;
  /** Full markdown content */
  content: string;
}

export interface SoundItem extends ArchiveItemBase {
  type: 'sound';
  /** Audio file URL */
  src: string;
  /** Duration in seconds */
  duration: number;
  /** Pre-computed waveform data (0-1 values) */
  waveform?: number[];
}

export interface CodeItem extends ArchiveItemBase {
  type: 'code';
  /** Repository URL */
  repo?: string;
  /** Live demo URL */
  demo?: string;
  /** Primary programming language */
  language?: string;
  /** Project description */
  description: string;
}

export type ArchiveItem = ImageItem | WritingItem | SoundItem | CodeItem;

/**
 * Type guard for ImageItem
 */
export function isImageItem(item: ArchiveItem): item is ImageItem {
  return item.type === 'image';
}

/**
 * Type guard for WritingItem
 */
export function isWritingItem(item: ArchiveItem): item is WritingItem {
  return item.type === 'writing';
}

/**
 * Type guard for SoundItem
 */
export function isSoundItem(item: ArchiveItem): item is SoundItem {
  return item.type === 'sound';
}

/**
 * Type guard for CodeItem
 */
export function isCodeItem(item: ArchiveItem): item is CodeItem {
  return item.type === 'code';
}
