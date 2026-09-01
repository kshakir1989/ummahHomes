/**
 * Mobile core flows — mirrors features/mobile-core.feature for Detox.
 *
 * Prefer text + interactive testIDs: Screen container testIDs are unreliable
 * under Expo Router / Fabric without accessible wrappers (which break children).
 */
const { by, device, element, expect: detoxExpect, waitFor } = require("detox");

describe("Mobile core flows", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      launchArgs: { detoxEnableSynchronization: "0" },
    });
    await device.disableSynchronization();
  });

  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: { detoxEnableSynchronization: "0" },
    });
    await device.disableSynchronization();
  });

  it("Browse listings on mobile", async () => {
    await waitFor(element(by.text("Search listings")))
      .toBeVisible()
      .withTimeout(60000);
    await element(by.id("entry-search-submit")).tap();
    await waitFor(element(by.text("Search owner-listed homes")))
      .toBeVisible()
      .withTimeout(30000);
    await detoxExpect(element(by.id("listing-card-listing-1"))).toBeVisible();
  });

  it("Sign in and apply on mobile", async () => {
    await waitFor(element(by.text("Sign in")))
      .toBeVisible()
      .withTimeout(60000);
    await element(by.id("entry-sign-in")).tap();
    await waitFor(element(by.text("Continue as demo user")))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id("sign-in-role-renter")).tap();
    await waitFor(element(by.text("Search owner-listed homes")))
      .toBeVisible()
      .withTimeout(30000);

    await waitFor(element(by.id("listing-card-listing-2")))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id("listing-card-listing-2")).tap();
    await waitFor(element(by.text("Photo gallery")))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id("listing-detail-primary-cta")).tap();
    await waitFor(element(by.id("seeker-request-submit")))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id("seeker-request-submit")).tap();
    await waitFor(element(by.text("Search owner-listed homes")))
      .toBeVisible()
      .withTimeout(30000);
  });
});
