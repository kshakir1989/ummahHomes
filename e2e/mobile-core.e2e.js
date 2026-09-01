/**
 * Mobile core flows — mirrors features/mobile-core.feature for Detox.
 */
const { by, device, element, expect: detoxExpect, waitFor } = require("detox");

describe("Mobile core flows", () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      launchArgs: { detoxEnableSynchronization: "0" },
    });
    await device.disableSynchronization();
  });

  it("Browse listings on mobile", async () => {
    await waitFor(element(by.id("entry")))
      .toBeVisible()
      .withTimeout(60000);
    await element(by.id("entry-search-submit")).tap();
    await waitFor(element(by.id("browse-search-input")))
      .toBeVisible()
      .withTimeout(30000);
    await detoxExpect(element(by.id("listing-card-listing-1"))).toBeVisible();
  });

  it("Sign in and apply on mobile", async () => {
    await waitFor(element(by.id("entry-sign-in")))
      .toBeVisible()
      .withTimeout(60000);
    await element(by.id("entry-sign-in")).tap();
    await waitFor(element(by.id("sign-in-role-renter")))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id("sign-in-role-renter")).tap();
    await waitFor(element(by.id("browse-search-input")))
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
    await waitFor(element(by.id("browse-search-input")))
      .toBeVisible()
      .withTimeout(30000);
  });

  it("Seller sign in routes to dashboard on mobile", async () => {
    await waitFor(element(by.id("entry-sign-in")))
      .toBeVisible()
      .withTimeout(60000);
    await element(by.id("entry-sign-in")).tap();
    await element(by.id("sign-in-role-seller")).tap();
    await waitFor(element(by.id("seller-dashboard")))
      .toBeVisible()
      .withTimeout(30000);
  });

  it("Sign up routes renter to browse on mobile", async () => {
    await waitFor(element(by.id("entry-sign-up")))
      .toBeVisible()
      .withTimeout(60000);
    await element(by.id("entry-sign-up")).tap();
    await element(by.id("sign-up-role-renter")).tap();
    await waitFor(element(by.id("browse-search-input")))
      .toBeVisible()
      .withTimeout(30000);
  });
});
