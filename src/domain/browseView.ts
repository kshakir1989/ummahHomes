export type BrowseColumnsPerRow = 1 | 2 | 3 | 4 | 5;

export const BROWSE_COLUMNS_OPTIONS: BrowseColumnsPerRow[] = [1, 2, 3, 4, 5];

export const DEFAULT_BROWSE_COLUMNS: BrowseColumnsPerRow = 1;

export function clampBrowseColumns(value: number): BrowseColumnsPerRow {
  const rounded = Math.round(value);
  if (rounded <= 1) return 1;
  if (rounded >= 5) return 5;
  return rounded as BrowseColumnsPerRow;
}
