/**
 * iOS demo recording: seller flow (run via demo/record-ios.sh).
 */
const { by, element, waitFor } = require("detox");
const { pause, openSignIn, tapRole, launchFresh } = require("./demo-helpers");

describe("Demo seller flow", () => {
  beforeAll(async () => {
    await launchFresh();
  });

  it(
    "walks seller dashboard, listings, requests, inbox",
    async () => {
      await openSignIn();
      await pause();
      await tapRole("sign-in-role-seller");
      await waitFor(element(by.id("role-picker-seller")))
        .toBeVisible()
        .withTimeout(20000);
      await element(by.id("role-picker-seller")).tap();
      await waitFor(element(by.id("seller-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(2000);
      await element(by.id("seller-dashboard-listings")).tap();
      await waitFor(element(by.id("seller-listings")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
      await element(by.id("nav-back")).atIndex(0).tap();
      await waitFor(element(by.id("seller-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(1000);
      await element(by.id("seller-dashboard-requests")).tap();
      await waitFor(element(by.id("seller-requests")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
      await element(by.id("nav-back")).atIndex(0).tap();
      await waitFor(element(by.id("seller-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(500);
      await element(by.id("seller-dashboard-inbox")).tap();
      await waitFor(element(by.id("seller-inbox")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
    },
    300000,
  );
});
