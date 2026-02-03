/**
 * Re-export archive types from design-system
 */
export type {
  ArchiveItem,
  ImageItem,
  WritingItem,
  SoundItem,
  CodeItem,
} from '@studio/design-system/glitch';

/**
 * Utility functions for archive data manipulation
 */
import type { ArchiveItem } from '@studio/design-system/glitch';

/**
 * Extract unique tags from archive items
 */
export function extractTags(items: ArchiveItem[]): string[] {
  const tagSet = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Filter items by tag
 */
export function filterByTag(items: ArchiveItem[], tag: string | null): ArchiveItem[] {
  if (!tag) return items;
  return items.filter((item) => item.tags.includes(tag));
}

/**
 * Sort items by date (most recent first)
 */
export function sortByDate(items: ArchiveItem[]): ArchiveItem[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Group items by year for temporal view
 */
export function groupByYear(items: ArchiveItem[]): Map<number, ArchiveItem[]> {
  const groups = new Map<number, ArchiveItem[]>();
  for (const item of items) {
    const year = new Date(item.date).getFullYear();
    const group = groups.get(year) || [];
    group.push(item);
    groups.set(year, group);
  }
  // Sort years descending
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

/**
 * Paginate items
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number; hasNext: boolean; hasPrev: boolean } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const normalizedPage = Math.max(1, Math.min(page, totalPages));
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    totalPages,
    hasNext: normalizedPage < totalPages,
    hasPrev: normalizedPage > 1,
  };
}
