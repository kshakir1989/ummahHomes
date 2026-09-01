/**
 * Records browse-flow.mp4 for web (entry scroll, browse, filters, grid view).
 * Usage: DEMO_BASE_URL=http://127.0.0.1:8081 node demo/record-browse.mjs
 */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../demoStore/web");
const BASE_URL = process.env.DEMO_BASE_URL ?? "http://127.0.0.1:8081";
const PAUSE_MS = Number(process.env.DEMO_PAUSE_MS ?? 800);

async function pause(page, ms = PAUSE_MS) {
  await page.waitForTimeout(ms);
}

async function convertToMp4(inPath, outPath) {
  await new Promise((resolve, reject) => {
    const ff = spawn(
      "ffmpeg",
      ["-y", "-i", inPath, "-c:v", "libx264", "-pix_fmt", "yuv420p", outPath],
      { stdio: "inherit" },
    );
    ff.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)),
    );
  });
}

async function scrollPage(page, deltaY) {
  await page.mouse.wheel(0, deltaY);
  await pause(page, 500);
}

async function recordBrowseFlow(page) {
  await page.goto(BASE_URL);
  await page.getByTestId("entry").waitFor({ state: "visible" });
  await pause(page, 1200);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pause(page, 1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(page, 1000);

  await page.getByTestId("entry-search-submit").click();
  await page.getByTestId("browse-search-input").first().waitFor({ state: "visible" });
  await pause(page, 1000);

  for (let i = 0; i < 3; i += 1) {
    await scrollPage(page, 700);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(page, 1000);

  await page.getByTestId("browse-filters-toggle").click();
  await page.getByTestId("browse-filters-panel").waitFor({ state: "visible" });
  await pause(page, 600);
  await page.getByTestId("browse-filter-view-3").click();
  await page.getByTestId("browse-filter-view-3-selected").waitFor({ state: "visible" });
  await pause(page, 800);
  await page.getByTestId("browse-filters-toggle").click();
  await page.getByTestId("browse-filters-panel").waitFor({ state: "hidden" });
  await pause(page, 600);

  for (let i = 0; i < 3; i += 1) {
    await scrollPage(page, 700);
  }
  for (let i = 0; i < 3; i += 1) {
    await scrollPage(page, -700);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(page, 1200);
}

async function main() {
  try {
    const probe = await fetch(BASE_URL);
    if (!probe.ok) {
      throw new Error(`Dev server not reachable at ${BASE_URL}`);
    }
  } catch {
    console.error(
      `Start the web app first: cd apps/ummahHomes && npm run web\nThen: DEMO_BASE_URL=http://127.0.0.1:8081 node demo/record-browse.mjs`,
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = path.join(OUT_DIR, ".tmp");
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: tmpDir, size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    console.log("Recording web: browse-flow...");
    await recordBrowseFlow(page);
    await pause(page, 1000);
  } finally {
    const video = page.video();
    await context.close();
    await browser.close();
    if (!video) {
      throw new Error("No video captured for browse-flow");
    }
    const webm = await video.path();
    const outMp4 = path.join(OUT_DIR, "browse-flow.mp4");
    await convertToMp4(webm, outMp4);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log(`Wrote ${outMp4}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
