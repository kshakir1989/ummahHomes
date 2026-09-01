import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

Given("I open the company entry page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/");
  await expect(page.getByTestId("entry")).toBeVisible();
});

When("I tap search listings", async ({ page }) => {
  await page.getByTestId("entry-search-submit").click();
});

Then("I land on public browse", async ({ page }) => {
  await expect(page.getByTestId("browse")).toBeVisible();
});

When("I tap sign in from entry", async ({ page }) => {
  await page.getByTestId("entry-sign-in").click();
});
