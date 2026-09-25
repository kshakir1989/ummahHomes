import { test as base, createBdd } from "playwright-bdd";
import { addCoverageReport } from "monocart-reporter";

const coverageOn = process.env.COVERAGE === "1";

type CoverageFixtures = {
  autoCoverage: void;
};

export const test = base.extend<CoverageFixtures>({
  autoCoverage: [
    async ({ page }, use) => {
      if (coverageOn) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });
      }
      await use();
      if (coverageOn) {
        const jsCoverage = await page.coverage.stopJSCoverage();
        await addCoverageReport(jsCoverage, test.info());
      }
    },
    { scope: "test", auto: true },
  ],
});

export const { Given, When, Then } = createBdd(test);
