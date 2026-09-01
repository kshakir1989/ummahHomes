/**
 * Shared helpers for iOS demo recording flows.
 */
const { by, device, element, waitFor } = require("detox");

const pause = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

async function openSignIn() {
  await waitFor(element(by.id("entry-sign-in")))
    .toBeVisible()
    .withTimeout(120000);
  await pause(800);
  await element(by.id("entry-sign-in")).tap();
  await waitFor(element(by.id("sign-in")))
    .toBeVisible()
    .withTimeout(30000);
}

async function tapRole(roleTestId) {
  const role = element(by.id(roleTestId));
  try {
    await role.tap();
  } catch {
    await element(by.id("sign-in")).scrollTo("bottom");
    await role.tap();
  }
}

async function launchFresh() {
  await device.launchApp({
    newInstance: true,
    delete: true,
    launchArgs: { detoxEnableSynchronization: "0" },
  });
  await device.disableSynchronization();
}

module.exports = { pause, openSignIn, tapRole, launchFresh };
