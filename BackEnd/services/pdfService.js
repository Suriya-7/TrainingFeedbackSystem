import fs from "fs";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { buildFeedbackHtml } from "../templates/feedbackTemplate.js";

/**
 * Finds a browser to print the PDFs with.
 *
 *  1. CHROME_EXECUTABLE_PATH in .env (if you set it and the file exists)
 *  2. Chrome / Edge already installed on this computer
 *     (every Windows PC has Edge, so local runs work with no setup)
 *  3. The bundled @sparticuz/chromium — Linux only (Render, Railway, Docker)
 */
function installedBrowserPaths() {
  const env = process.env;
  switch (process.platform) {
    case "win32":
      return [
        `${env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
        `${env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
        `${env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
        `${env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
        `${env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
      ];
    case "darwin":
      return [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
      ];
    default:
      return [
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/microsoft-edge",
      ];
  }
}

function findInstalledBrowser() {
  const fromEnv = process.env.CHROME_EXECUTABLE_PATH;
  if (fromEnv) {
    if (fs.existsSync(fromEnv)) return fromEnv;
    console.warn(`CHROME_EXECUTABLE_PATH is set but the file does not exist: ${fromEnv}`);
  }
  return installedBrowserPaths().find((p) => p && !p.includes("undefined") && fs.existsSync(p)) || null;
}

async function launchBrowser() {
  const installed = findInstalledBrowser();
  const linuxArgs = process.platform === "linux" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];

  if (installed) {
    return puppeteer.launch({ executablePath: installed, headless: true, args: linuxArgs });
  }

  // The bundled Chromium only runs on Linux.
  if (process.platform !== "linux") {
    const err = new Error(
      "No Chrome or Edge was found on this computer. Install Google Chrome, or set CHROME_EXECUTABLE_PATH in BackEnd/.env to your chrome.exe / msedge.exe."
    );
    err.code = "NO_BROWSER";
    throw err;
  }

  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

async function printOne(browser, row, plantCode) {
  const page = await browser.newPage();
  try {
    page.setDefaultTimeout(30000);
    await page.setContent(buildFeedbackHtml(row, plantCode), { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

/**
 * Renders PDFs for many rows using ONE browser (fast, low memory).
 * Returns Buffers in the same order as `rows`.
 */
export async function renderFeedbackPdfs(rows, plantCode) {
  // Validates the plant BEFORE a browser is launched (throws if it has no DOC No).
  buildFeedbackHtml(rows[0] ?? {}, plantCode);

  const browser = await launchBrowser();
  try {
    const out = [];
    for (const row of rows) out.push(await printOne(browser, row, plantCode));
    return out;
  } finally {
    await browser.close();
  }
}

/** Short, human message for the admin — the real error goes to the server console. */
export function describePdfError(error) {
  if (error?.code === "PLANT_DOC_MISSING" || error?.code === "NO_BROWSER") return error.message;
  return "Could not generate the PDF on the server. Check the server console for details.";
}
