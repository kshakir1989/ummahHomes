/**
 * Mobile browse filters — mirrors features/browse-filters.feature for Detox.
 */
const { by, device, element, expect: detoxExpect, waitFor } = require("detox");

async function openBrowse() {
  await waitFor(element(by.id("entry")))
    .toBeVisible()
    .withTimeout(60000);
  await element(by.id("entry-search-submit")).tap();
  await waitFor(element(by.id("browse-search-input")))
    .toBeVisible()
    .withTimeout(30000);
}

describe("Mobile browse filters", () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      launchArgs: { detoxEnableSynchronization: "0" },
    });
    await device.disableSynchronization();
  });

  it("opens and closes filters from the header", async () => {
    await openBrowse();
    await element(by.id("browse-filters-toggle")).tap();
    await waitFor(element(by.id("browse-filters-panel")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("browse-filters-toggle")).tap();
    await waitFor(element(by.id("browse-filters-panel")))
      .not.toBeVisible()
      .withTimeout(10000);
  });

  it("filters listings by type on mobile", async () => {
    await openBrowse();
    await element(by.id("browse-filters-toggle")).tap();
    await waitFor(element(by.id("browse-filters-panel")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("browse-filter-type-home_sale")).tap();
    await detoxExpect(element(by.text("Sale")).atIndex(0)).toBeVisible();
  });

  it("changes listings per row on mobile", async () => {
    await openBrowse();
    await element(by.id("browse-filters-toggle")).tap();
    await waitFor(element(by.id("browse-filters-panel")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("browse-filter-view-3")).tap();
    await detoxExpect(element(by.id("browse-filter-view-3-selected"))).toBeVisible();
  });

  it("returns home from browse via glass home button", async () => {
    await openBrowse();
    await element(by.id("nav-home")).tap();
    await waitFor(element(by.id("entry-brand")))
      .toBeVisible()
      .withTimeout(15000);
  });
});
