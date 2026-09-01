/**
 * iOS demo recording: buyer flow (run via demo/record-ios.sh).
 */
const { by, device, element, waitFor } = require("detox");
const { pause, openSignIn, tapRole, launchFresh } = require("./demo-helpers");

describe("Demo buyer flow", () => {
  beforeAll(async () => {
    await launchFresh();
  });

  it(
    "walks buyer dashboard, browse, interests, inbox",
    async () => {
      await openSignIn();
      await pause();
      await tapRole("sign-in-role-buyer");
      await waitFor(element(by.id("buyer-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(2000);
      await element(by.id("buyer-dashboard-browse")).tap();
      await waitFor(element(by.id("browse-search-input")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(2000);
      await element(by.id("listing-card-listing-1")).tap();
      await waitFor(element(by.id("listing-detail")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
      await device.pressBack();
      await pause(500);
      await element(by.id("nav-home")).atIndex(0).tap();
      await waitFor(element(by.id("entry-sign-in")))
        .toBeVisible()
        .withTimeout(20000);
      await openSignIn();
      await tapRole("sign-in-role-buyer");
      await waitFor(element(by.id("buyer-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(1000);
      await element(by.id("buyer-dashboard-interests")).tap();
      await waitFor(element(by.id("buyer-interests")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
      await element(by.id("nav-back")).atIndex(0).tap();
      await waitFor(element(by.id("buyer-dashboard")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(500);
      await element(by.id("buyer-dashboard-inbox")).tap();
      await waitFor(element(by.id("buyer-inbox")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
    },
    300000,
  );
});
