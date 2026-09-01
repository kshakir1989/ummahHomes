import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

Given("I am not signed in", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
});

When("I open public browse", async ({ page }) => {
  await page.goto("/browse");
});

Then("I see published listings", async ({ page }) => {
  await expect(page.getByTestId("browse")).toBeVisible();
  await expect(page.getByText("Owner-listed").first()).toBeVisible();
});

Given("I open a published rent listing", async ({ page }) => {
  await page.goto("/listing/listing-2");
  await expect(page.getByTestId("listing-detail")).toBeVisible();
});

Given("I open a published sale listing", async ({ page }) => {
  await page.goto("/listing/listing-1");
  await expect(page.getByTestId("listing-detail")).toBeVisible();
});

When("I tap the primary seeker CTA", async ({ page }) => {
  await page.getByTestId("listing-detail-primary-cta").click();
});

Then("I am prompted to sign in", async ({ page }) => {
  await expect(page.getByTestId("sign-in")).toBeVisible();
});
