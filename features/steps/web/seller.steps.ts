import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

let lastListingTitle = "";

Given("I am signed in as a seller", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/sign-in");
  await page.getByTestId("sign-in-role-seller").click();
  await page.waitForURL("**/browse");
});

const TYPE_LABELS: Record<string, string> = {
  home_sale: "Sale",
  home_rent: "Home rent",
  room_rent: "Room",
  basement_rent: "Basement",
};

When(
  "I create a {string} listing with required details",
  async ({ page }, listingType: string) => {
    lastListingTitle = `E2E ${listingType} ${Date.now()}`;
    await page.goto("/listing-form");
    await page.getByText(TYPE_LABELS[listingType] ?? listingType).click();
    await page.getByTestId("seller-listing-form-title").fill(lastListingTitle);
    await page
      .getByTestId("seller-listing-form-description")
      .fill("Owner-listed demo listing");
    await page.getByTestId("seller-listing-form-location").fill("Atlanta, GA");
    await page.getByTestId("seller-listing-form-price").fill("1200");
    await page.getByTestId("seller-listing-form-save").click();
  },
);

When("I complete the listing fee stub", async ({ page }) => {
  await page.getByTestId("seller-fee-stub-acknowledge").click();
});

When("I publish the listing", async ({ page }) => {
  await page.getByTestId("seller-listing-form-publish").click();
});

When("I attempt to publish the listing", async ({ page }) => {
  await page.getByTestId("seller-listing-form-publish").click();
});

Then("the listing appears in public browse", async ({ page }) => {
  await page.goto("/browse");
  await expect(page.getByText(lastListingTitle)).toBeVisible();
});

Then("publish is blocked for missing fee stub", async ({ page }) => {
  await expect(page.getByTestId("seller-fee-stub")).toBeVisible();
});
