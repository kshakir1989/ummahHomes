import { createBdd } from "playwright-bdd";

const { Given } = createBdd();

Given("the app is scaffolded", async () => {
  // Playwright + Gherkin harness wired; scenarios added per user story.
});
