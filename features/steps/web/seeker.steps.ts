import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

async function signInAs(page: import("@playwright/test").Page, testId: string) {
  await page.goto("/sign-in");
  await page.getByTestId(testId).click();
  await page.waitForURL(
    (url) =>
      !url.pathname.includes("/sign-in") &&
      (url.pathname.includes("/browse") ||
        url.pathname.includes("/dashboard") ||
        url.pathname.includes("/buyer-dashboard") ||
        url.pathname.includes("/renter-dashboard") ||
        url.pathname.includes("/admin") ||
        url.pathname.includes("/role-picker")),
  );
}

const DEMO_STATE_KEY = "ummahHomes.demoState.v5";

async function signInAsUserId(
  page: import("@playwright/test").Page,
  userId: string,
  activeRole?: "seller" | "buyer" | "renter" | "admin",
) {
  await page.goto("/browse");
  await page.evaluate(
    ({ id, role }) => {
      sessionStorage.setItem("ummahHomes.demoSessionUserId", id);
      if (role) {
        sessionStorage.setItem("ummahHomes.demoActiveRole", role);
      } else {
        sessionStorage.removeItem("ummahHomes.demoActiveRole");
      }
    },
    { id: userId, role: activeRole },
  );
  if (activeRole === "seller") {
    await page.goto("/dashboard");
    await expect(page.getByTestId("seller-dashboard")).toBeVisible({
      timeout: 15000,
    });
    return;
  }
  await page.reload();
}

Given("I am signed in as a renter", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await signInAs(page, "sign-in-role-renter");
});

Given("I am signed in as a buyer", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await signInAs(page, "sign-in-role-buyer");
});

When("I submit an apply request", async ({ page }) => {
  await page.getByTestId("listing-detail-primary-cta").click();
  await expect(page.getByTestId("seeker-request")).toBeVisible();
  await page.getByTestId("seeker-request-submit").click();
});

When("I submit an express interest request", async ({ page }) => {
  await page.getByTestId("listing-detail-primary-cta").click();
  await expect(page.getByTestId("seeker-request")).toBeVisible();
  await page.getByTestId("seeker-request-submit").click();
});

Then("the seller can see my submitted request", async ({ page }) => {
  const ownerId = await page.evaluate((stateKey) => {
    const raw = sessionStorage.getItem(stateKey);
    if (!raw) return null;
    const state = JSON.parse(raw) as {
      requests: { listingId: string }[];
      listings: { id: string; ownerId: string }[];
    };
    const request = state.requests[state.requests.length - 1];
    const listing = state.listings.find((l) => l.id === request.listingId);
    return listing?.ownerId ?? null;
  }, DEMO_STATE_KEY);
  expect(ownerId).toBeTruthy();
  await signInAsUserId(page, ownerId!, "seller");
  await page.goto("/requests");
  await expect(page.getByTestId("seller-requests")).toBeVisible();
  await expect(page.getByText("submitted").first()).toBeVisible();
});

Given("two renters have open requests on the same listing", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await signInAs(page, "sign-in-role-renter");
  await page.goto("/listing/listing-2");
  await page.getByTestId("listing-detail-primary-cta").click();
  await page.getByTestId("seeker-request-submit").click();
  await signInAsUserId(page, "user-10");
  await page.goto("/listing/listing-2");
  await page.getByTestId("listing-detail-primary-cta").click();
  await page.getByTestId("seeker-request-submit").click();
});

When("the seller accepts the first request", async ({ page }) => {
  const ownerId = await page.evaluate((stateKey) => {
    const raw = sessionStorage.getItem(stateKey);
    if (!raw) return null;
    const state = JSON.parse(raw) as {
      listings: { id: string; ownerId: string }[];
    };
    return state.listings.find((l) => l.id === "listing-2")?.ownerId ?? null;
  }, DEMO_STATE_KEY);
  await signInAsUserId(page, ownerId!, "seller");
  await page.goto("/requests");
  await page.getByTestId("seller-request-accept").first().click();
});

Then("the second request remains submitted", async ({ page }) => {
  await expect(page.getByText("submitted").first()).toBeVisible();
  await expect(page.getByText("accepted").first()).toBeVisible();
});

Given(
  "I open a rent listing that requires a background check",
  async ({ page }) => {
    await page.goto("/listing/listing-10");
    await expect(page.getByTestId("listing-detail")).toBeVisible();
  },
);

When("I start and pass the background check stub", async ({ page }) => {
  await page.getByTestId("listing-detail-primary-cta").click();
  await page.getByTestId("seeker-request-submit").click();
  await expect(page.getByTestId("seeker-bg-stub")).toBeVisible();
  await page.getByTestId("seeker-bg-stub-start").click();
  await page.getByTestId("seeker-bg-stub-pass").click();
  await expect(page.getByTestId("message-thread")).toBeVisible({
    timeout: 15000,
  });
});

Then("I can send a message to the seller", async ({ page }) => {
  await page.getByTestId("message-thread-input").fill("Hello from e2e");
  await page.getByTestId("message-thread-send").click();
  await expect(page.getByText("Hello from e2e")).toBeVisible();
});

Given("a renter has an open request on a listing", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => sessionStorage.clear());
  await signInAs(page, "sign-in-role-renter");
  await page.goto("/listing/listing-2");
  await page.getByTestId("listing-detail-primary-cta").click();
  await page.getByTestId("seeker-request-submit").click();
  await page.evaluate(() => {
    (window as unknown as { __bookListingId?: string }).__bookListingId =
      "listing-2";
  });
});

When("the seller marks the listing booked", async ({ page }) => {
  const ownerId = await page.evaluate((stateKey) => {
    const raw = sessionStorage.getItem(stateKey);
    if (!raw) return null;
    const state = JSON.parse(raw) as {
      listings: { id: string; ownerId: string }[];
    };
    return state.listings.find((l) => l.id === "listing-2")?.ownerId ?? null;
  }, DEMO_STATE_KEY);
  await signInAsUserId(page, ownerId!, "seller");
  await page.goto("/listing-form?book=listing-2");
  await expect(page.getByTestId("seller-listing-form")).toBeVisible();
  await page.getByTestId("seller-mark-booked").click();
});

Then("the open request becomes unavailable", async ({ page }) => {
  await page.goto("/requests");
  await expect(page.getByText("unavailable").first()).toBeVisible();
});

Then("seekers cannot apply to the booked listing", async ({ page }) => {
  await signInAs(page, "sign-in-role-renter");
  await page.goto("/listing/listing-2");
  await expect(page.getByTestId("listing-detail-booked")).toBeVisible();
});
