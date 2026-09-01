import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Then, When } = createBdd();

Then("I see the home brand", async ({ page }) => {
  await expect(page.getByTestId("entry-brand")).toBeVisible();
});

Then("I see the home navigation links", async ({ page }) => {
  await expect(page.getByTestId("entry-nav-links")).toBeVisible();
  await expect(page.getByTestId("entry-search-submit")).toBeVisible();
  await expect(page.getByTestId("entry-sign-in")).toBeVisible();
  await expect(page.getByTestId("entry-sign-up")).toBeVisible();
});

When("I tap the bottom browse CTA", async ({ page }) => {
  await page.getByTestId("entry-cta-browse").click();
});

When("I tap sign up from entry", async ({ page }) => {
  await page.getByTestId("entry-sign-up").click();
});

Then("I see the sign up screen", async ({ page }) => {
  await expect(page.getByTestId("sign-up")).toBeVisible();
});
