/**
 * iOS demo recording: browse flow (entry scroll, browse, filters, 3-column view).
 */
const { by, element, waitFor } = require("detox");
const { pause, launchFresh } = require("./demo-helpers");

async function scrollEntry(direction, times = 1) {
  const swipeDir = direction === "down" ? "up" : "down";
  for (let i = 0; i < times; i += 1) {
    await element(by.id("entry-scroll")).swipe(swipeDir, "fast", 0.75);
    await pause(700);
  }
}

async function scrollBy(testID, direction, times = 1, amount = 500) {
  for (let i = 0; i < times; i += 1) {
    await element(by.id(testID)).scroll(amount, direction);
    await pause(600);
  }
}

describe("Demo browse flow", () => {
  beforeAll(async () => {
    await launchFresh();
  });

  it(
    "scrolls entry, browses homes, filters, and changes grid view",
    async () => {
      await waitFor(element(by.id("entry-sign-in")))
        .toBeVisible()
        .withTimeout(120000);
      await pause(1500);

      await scrollEntry("down", 6);
      await pause(1000);
      await scrollEntry("up", 6);
      await pause(800);

      await element(by.id("entry-search-submit")).tap();
      await waitFor(element(by.id("browse-search-input")))
        .toBeVisible()
        .withTimeout(30000);
      await pause(1000);

      await scrollBy("browse-list", "down", 3);
      await scrollBy("browse-list", "up", 3);
      await pause(800);

      await element(by.id("browse-filters-toggle")).tap();
      await waitFor(element(by.id("browse-filters-panel")))
        .toBeVisible()
        .withTimeout(10000);
      await pause(600);
      await element(by.id("browse-filter-view-3")).tap();
      await waitFor(element(by.id("browse-filter-view-3-selected")))
        .toBeVisible()
        .withTimeout(10000);
      await pause(800);
      await element(by.id("browse-filters-toggle")).tap();
      await waitFor(element(by.id("browse-filters-panel")))
        .not.toBeVisible()
        .withTimeout(10000);
      await pause(600);

      await scrollBy("browse-list", "down", 3);
      await scrollBy("browse-list", "up", 3);
      await pause(1500);
    },
    300000,
  );
});
