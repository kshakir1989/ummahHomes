/**
 * iOS demo recording: admin flow (run via demo/record-ios.sh).
 */
const { by, element, waitFor } = require("detox");
const { pause, openSignIn, tapRole, launchFresh } = require("./demo-helpers");

describe("Demo admin flow", () => {
  beforeAll(async () => {
    await launchFresh();
  });

  it(
    "walks admin users, listings, applicants",
    async () => {
      await openSignIn();
      await pause();
      await tapRole("sign-in-role-admin");
      await waitFor(element(by.id("admin-surface")))
        .toBeVisible()
        .withTimeout(20000);
      await pause(1500);
      await element(by.id("admin-tab-listings")).tap();
      await pause(1500);
      await element(by.id("admin-tab-applicants")).tap();
      await pause(1500);
      await element(by.id("admin-tab-users")).tap();
      await pause(2000);
    },
    300000,
  );
});
