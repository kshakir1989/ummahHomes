import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "features/**/*.feature",
  steps: "features/steps/web/**/*.ts",
  outputDir: ".features-gen",
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:19006",
    trace: "on-first-retry",
  },
  webServer: {
    command: "CI=1 npx expo start --web --port 19006",
    url: "http://127.0.0.1:19006",
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
