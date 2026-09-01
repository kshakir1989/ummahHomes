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

Then("I see the browse search bar", async ({ page }) => {
  await expect(page.getByTestId("browse-search-bar")).toBeVisible();
  await expect(page.getByTestId("browse-search-input")).toBeVisible();
});

When("I open browse filters", async ({ page }) => {
  await page.getByTestId("browse-filters-toggle").click();
  await expect(page.getByTestId("browse-filters-panel")).toBeVisible();
});

When("I close browse filters", async ({ page }) => {
  await page.getByTestId("browse-filters-toggle").click();
});

Then("I see the browse filters panel", async ({ page }) => {
  await expect(page.getByTestId("browse-filters-panel")).toBeVisible();
});

Then("I do not see the browse filters panel", async ({ page }) => {
  await expect(page.getByTestId("browse-filters-panel")).toHaveCount(0);
});

When(
  "I filter browse by listing type {string}",
  async ({ page }, listingType: string) => {
    await page.getByTestId(`browse-filter-type-${listingType}`).click();
    await page.waitForTimeout(300);
  },
);

Then(
  "browse results only include listing type {string}",
  async ({ page }, listingType: string) => {
    const cards = page.locator('[data-testid^="listing-card-"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      if (listingType === "home_sale") {
        await expect(card.getByText("/mo")).toHaveCount(0);
        await expect(card.getByText("Sale", { exact: true })).toBeVisible();
      } else if (listingType === "home_rent") {
        await expect(card.getByText("/mo")).toBeVisible();
        await expect(card.getByText("Home rent", { exact: true })).toBeVisible();
      } else if (listingType === "room_rent") {
        await expect(card.getByText("/mo")).toBeVisible();
        await expect(card.getByText("Room", { exact: true })).toBeVisible();
      } else {
        await expect(card.getByText("/mo")).toBeVisible();
        await expect(card.getByText("Basement", { exact: true })).toBeVisible();
      }
    }
  },
);

When("I filter browse by city {string}", async ({ page }, city: string) => {
  const slug = city.replace(/\s+/g, "-").toLowerCase();
  await page.getByTestId(`browse-filter-city-${slug}`).click();
});

Then("browse results only include city {string}", async ({ page }, city: string) => {
  const cards = page.locator('[data-testid^="listing-card-"]');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(cards.nth(index)).toContainText(city);
  }
});

When("I search browse for {string}", async ({ page }, query: string) => {
  await page.getByTestId("browse-search-input").fill(query);
});

Then("browse results mention {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text).first()).toBeVisible();
});

When("I set browse view to {int} columns", async ({ page }, columns: number) => {
  await page.getByTestId(`browse-filter-view-${columns}`).click();
  await page.waitForTimeout(400);
});

Then("browse view is set to {int} columns", async ({ page }, columns: number) => {
  await expect(
    page.getByTestId(`browse-filter-view-${columns}-selected`),
  ).toBeVisible();
  await expect(page.getByTestId("browse-view-preview")).toBeVisible();
});

When("I tap home from browse", async ({ page }) => {
  await page.getByTestId("nav-home").click();
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
