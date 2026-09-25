import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import type { CoverageReportOptions } from "monocart-coverage-reports";

const testDir = defineBddConfig({
  features: [
    "features/admin.feature",
    "features/auth-routing.feature",
    "features/browse-auth.feature",
    "features/browse-filters.feature",
    "features/company-entry.feature",
    "features/home-marketing.feature",
    "features/seeker-requests.feature",
    "features/seller-listings.feature",
    "features/vet-message-booked.feature",
  ],
  steps: ["features/steps/web/**/*.ts", "features/fixtures.ts"],
  outputDir: ".features-gen",
});

const coverageOptions: CoverageReportOptions = {
  outputDir: "coverage",
  reports: [
    ["v8", { inline: true }],
    "console-summary",
    "lcov",
  ],
  entryFilter: (entry) => {
    const url = String(entry.url ?? "");
    if (!url || url.startsWith("node:")) return false;
    if (url.includes("node_modules")) return false;
    if (url.includes(".features-gen")) return false;
    return true;
  },
  sourceFilter: (sourcePath) => {
    const p = sourcePath.replace(/\\/g, "/");
    if (p.includes("node_modules")) return false;
    if (p.includes(".features-gen")) return false;
    return /(^|\/)(app|src)\/.+\.(ts|tsx)$/.test(p);
  },
};

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [
    ["list"],
    [
      "monocart-reporter",
      {
        name: "ummahHomes e2e coverage",
        outputFile: "coverage/monocart-report.html",
        coverage: coverageOptions,
      },
    ],
  ],
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
