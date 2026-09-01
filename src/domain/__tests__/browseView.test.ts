import { describe, expect, it } from "@jest/globals";
import {
  BROWSE_COLUMNS_OPTIONS,
  clampBrowseColumns,
  DEFAULT_BROWSE_COLUMNS,
} from "../browseView";

describe("browseView", () => {
  it("defaults to one column", () => {
    expect(DEFAULT_BROWSE_COLUMNS).toBe(1);
  });

  it("offers one through five columns", () => {
    expect(BROWSE_COLUMNS_OPTIONS).toEqual([1, 2, 3, 4, 5]);
  });

  it("clamps column counts", () => {
    expect(clampBrowseColumns(0)).toBe(1);
    expect(clampBrowseColumns(3.4)).toBe(3);
    expect(clampBrowseColumns(9)).toBe(5);
  });
});
