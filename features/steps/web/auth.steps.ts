import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

const ROLE_TEST_IDS: Record<string, string> = {
  seller: "sign-in-role-seller",
  buyer: "sign-in-role-buyer",
  renter: "sign-in-role-renter",
  admin: "sign-in-role-admin",
};

const SIGN_UP_ROLE_TEST_IDS: Record<string, string> = {
  seller: "sign-up-role-seller",
  buyer: "sign-up-role-buyer",
  renter: "sign-up-role-renter",
};

Given("I open sign in", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/sign-in");
  await expect(page.getByTestId("sign-in")).toBeVisible();
});

Given("I open sign up", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/sign-up");
  await expect(page.getByTestId("sign-up")).toBeVisible();
});

When("I sign in as demo role {string}", async ({ page }, role: string) => {
  const testID = ROLE_TEST_IDS[role];
  if (!testID) {
    throw new Error(`Unknown demo role: ${role}`);
  }
  await page.getByTestId(testID).click();
  const picker = page.getByTestId("role-picker");
  if (await picker.isVisible().catch(() => false)) {
    await page.getByTestId(`role-picker-${role}`).click();
  }
});

When("I sign up as demo role {string}", async ({ page }, role: string) => {
  const testID = SIGN_UP_ROLE_TEST_IDS[role];
  if (!testID) {
    throw new Error(`Unknown demo sign-up role: ${role}`);
  }
  await page.getByTestId(testID).click();
});

Then("I land on the seller dashboard", async ({ page }) => {
  await expect(page.getByTestId("seller-dashboard")).toBeVisible();
});

Then("I land on the buyer dashboard", async ({ page }) => {
  await expect(page.getByTestId("buyer-dashboard")).toBeVisible();
});

Then("I land on the renter dashboard", async ({ page }) => {
  await expect(page.getByTestId("renter-dashboard")).toBeVisible();
});

Then("I land on public browse", async ({ page }) => {
  await expect(page.getByTestId("browse")).toBeVisible();
});
