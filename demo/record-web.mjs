/**
 * Records MP4 walkthrough videos for each demo role on web.
 * Usage: DEMO_BASE_URL=http://127.0.0.1:8081 node demo/record-web.mjs
 * Requires: dev server running, ffmpeg on PATH.
 */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../demoStore/web");
const BASE_URL = process.env.DEMO_BASE_URL ?? "http://127.0.0.1:8081";
const PAUSE_MS = Number(process.env.DEMO_PAUSE_MS ?? 900);

async function pause(page, ms = PAUSE_MS) {
  await page.waitForTimeout(ms);
}

async function waitTestId(page, id) {
  await page.getByTestId(id).first().waitFor({ state: "visible" });
}

async function convertToMp4(inPath, outPath) {
  if (!fs.existsSync(inPath)) {
    throw new Error(`Missing recording: ${inPath}`);
  }
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

async function signInAs(page, roleTestId, pickerRole) {
  await page.goto(`${BASE_URL}/sign-in`);
  await page.getByTestId("sign-in").waitFor({ state: "visible" });
  await pause(page, 600);
  await page.getByTestId(roleTestId).click();
  const picker = page.getByTestId("role-picker");
  if (await picker.isVisible({ timeout: 3000 }).catch(() => false)) {
    await page.getByTestId(`role-picker-${pickerRole}`).click();
  }
  await pause(page);
}

async function recordFlow(name, run) {
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
    await run(page);
    await pause(page, 1200);
  } finally {
    const video = page.video();
    await context.close();
    await browser.close();
    if (!video) {
      throw new Error(`No video captured for ${name}`);
    }
    const webm = await video.path();
    const outMp4 = path.join(OUT_DIR, `${name}.mp4`);
    await convertToMp4(webm, outMp4);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log(`Wrote ${outMp4}`);
  }
}

async function recordSellerFlow(page) {
  await page.goto(BASE_URL);
  await page.getByTestId("entry").waitFor({ state: "visible" });
  await pause(page);
  await signInAs(page, "sign-in-role-seller", "seller");
  await page.getByTestId("seller-dashboard").waitFor({ state: "visible" });
  await pause(page);
  await page.getByTestId("seller-dashboard-listings").click();
  await page.getByTestId("seller-listings").waitFor({ state: "visible" });
  await pause(page);
  await page.getByTestId("seller-listings-new").click();
  await page.getByTestId("seller-listing-form").waitFor({ state: "visible" });
  await pause(page, 1500);
  await page.goto(`${BASE_URL}/requests`);
  await page.getByTestId("seller-requests").waitFor({ state: "visible" });
  await pause(page);
  await page.goto(`${BASE_URL}/seller-inbox`);
  await page.getByTestId("seller-inbox").waitFor({ state: "visible" });
  await pause(page);
}

async function recordBuyerFlow(page) {
  await page.goto(BASE_URL);
  await signInAs(page, "sign-in-role-buyer", "buyer");
  await page.getByTestId("buyer-dashboard").waitFor({ state: "visible" });
  await pause(page);
  await page.getByTestId("buyer-dashboard-browse").click();
  await page.getByTestId("browse-search-input").first().waitFor({ state: "visible" });
  await pause(page);
  const saleCard = page.locator('[data-testid^="listing-card-"]').first();
  await saleCard.waitFor({ state: "visible" });
  await saleCard.click();
  await page.getByTestId("listing-detail").waitFor({ state: "visible" });
  await pause(page);
  await page.goto(`${BASE_URL}/my-interests`);
  await page.getByTestId("buyer-interests").waitFor({ state: "visible" });
  await pause(page);
  await page.goto(`${BASE_URL}/inbox`);
  await page.getByTestId("buyer-inbox").waitFor({ state: "visible" });
  await pause(page);
}

async function recordRenterFlow(page) {
  await page.goto(BASE_URL);
  await signInAs(page, "sign-in-role-renter", "renter");
  await page.getByTestId("renter-dashboard").waitFor({ state: "visible" });
  await pause(page);
  await page.getByTestId("renter-dashboard-browse").click();
  await page.getByTestId("browse-search-input").first().waitFor({ state: "visible" });
  await pause(page);
  const rentCard = page.locator('[data-testid^="listing-card-"]').nth(1);
  await rentCard.waitFor({ state: "visible" });
  await rentCard.click();
  await page.getByTestId("listing-detail").waitFor({ state: "visible" });
  await pause(page);
  const applyCta = page.getByTestId("listing-detail-primary-cta");
  if (await applyCta.isVisible({ timeout: 2000 }).catch(() => false)) {
    await applyCta.click();
    await page.getByTestId("seeker-request").waitFor({ state: "visible" });
    await pause(page);
    await page.getByTestId("seeker-request-submit").click();
    await page.waitForURL(/\/browse/, { timeout: 15000 }).catch(() => {});
    await pause(page, 1500);
  }
  await page.goto(`${BASE_URL}/my-applications`);
  await page.getByTestId("renter-applications").waitFor({ state: "visible" });
  await pause(page);
  await page.goto(`${BASE_URL}/renter-inbox`);
  await page.getByTestId("renter-inbox").waitFor({ state: "visible" });
  await pause(page);
}

async function recordAdminFlow(page) {
  await page.goto(BASE_URL);
  await signInAs(page, "sign-in-role-admin", "admin");
  await page.getByTestId("admin-surface").waitFor({ state: "visible" });
  await pause(page);
  await page.getByTestId("admin-tab-listings").click();
  await pause(page);
  await page.getByTestId("admin-listings-search").fill("Atlanta");
  await pause(page);
  await page.getByTestId("admin-tab-applicants").click();
  await pause(page);
  await page.getByTestId("admin-tab-users").click();
  await pause(page);
}

async function main() {
  try {
    const probe = await fetch(BASE_URL);
    if (!probe.ok) {
      throw new Error(`Dev server not reachable at ${BASE_URL}`);
    }
  } catch {
    console.error(
      `Start the web app first: cd apps/ummahHomes && npm run web\nThen: DEMO_BASE_URL=http://127.0.0.1:8081 npm run record:demos:web`,
    );
    process.exit(1);
  }

  const only = process.env.DEMO_FLOWS?.split(",").map((s) => s.trim()).filter(Boolean);
  const flows = [
    ["seller-flow", recordSellerFlow],
    ["buyer-flow", recordBuyerFlow],
    ["renter-flow", recordRenterFlow],
    ["admin-flow", recordAdminFlow],
  ].filter(([name]) => !only?.length || only.includes(name));

  for (const [name, fn] of flows) {
    console.log(`Recording web: ${name}...`);
    await recordFlow(name, fn);
  }

  console.log(`Done. Videos in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
