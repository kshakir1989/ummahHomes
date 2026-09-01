import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

Given("I am signed in as an admin", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/sign-in");
  await page.getByTestId("sign-in-role-admin").click();
  await page.waitForURL("**/admin");
});

When("I open the admin surface", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByTestId("admin-surface")).toBeVisible();
});

Then("I see users and listings tabs", async ({ page }) => {
  await expect(page.getByTestId("admin-tab-users")).toBeVisible();
  await expect(page.getByTestId("admin-tab-listings")).toBeVisible();
});

When("I suspend demo user {string}", async ({ page }, userId: string) => {
  await page.getByTestId("admin-tab-users").click();
  await page.getByTestId(`admin-suspend-${userId}`).click();
});

Then("that user shows as suspended", async ({ page }) => {
  await expect(page.getByText("suspended").first()).toBeVisible();
});

When("I unpublish listing {string}", async ({ page }, listingId: string) => {
  await page.getByTestId("admin-tab-listings").click();
  await page.getByTestId(`admin-unpublish-${listingId}`).click();
});

Then(
  "listing {string} is no longer in public browse",
  async ({ page }, listingId: string) => {
    await page.goto("/browse");
    await expect(page.getByTestId(`listing-card-${listingId}`)).toHaveCount(0);
  },
);
