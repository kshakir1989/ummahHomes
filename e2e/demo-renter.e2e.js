/**
 * iOS demo recording: renter flow (run via demo/record-ios.sh).
 */
const { by, device, element, waitFor } = require("detox");
const { pause, openSignIn, tapRole, launchFresh } = require("./demo-helpers");

describe("Demo renter flow", () => {
  beforeAll(async () => {
    await launchFresh();
  });

  it(
    "walks renter dashboard, browse, apply, applications, inbox",
    async () => {
      await openSignIn();
      await pause();
      await tapRole("sign-in-role-renter");
      await waitFor(element(by.id("renter-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(2000);
      await element(by.id("renter-dashboard-browse")).tap();
      await waitFor(element(by.id("browse-search-input")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(2000);
      await element(by.id("listing-card-listing-2")).tap();
      await waitFor(element(by.id("listing-detail")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(1000);
      try {
        await element(by.id("listing-detail-primary-cta")).tap();
        await waitFor(element(by.id("seeker-request-submit")))
          .toBeVisible()
          .withTimeout(10000);
        await element(by.id("seeker-request-submit")).tap();
        await pause(2000);
      } catch {
        // Already applied — continue.
      }
      await device.pressBack();
      await pause(500);
      await element(by.id("nav-home")).atIndex(0).tap();
      await waitFor(element(by.id("entry-sign-in")))
        .toBeVisible()
        .withTimeout(20000);
      await openSignIn();
      await tapRole("sign-in-role-renter");
      await waitFor(element(by.id("renter-dashboard")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(1000);
      await element(by.id("renter-dashboard-applications")).tap();
      await waitFor(element(by.id("renter-applications")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
      await element(by.id("nav-back")).atIndex(0).tap();
      await waitFor(element(by.id("renter-dashboard")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(500);
      await element(by.id("renter-dashboard-inbox")).tap();
      await waitFor(element(by.id("renter-inbox")))
        .toBeVisible()
        .withTimeout(15000);
      await pause(2000);
    },
    300000,
  );
});
