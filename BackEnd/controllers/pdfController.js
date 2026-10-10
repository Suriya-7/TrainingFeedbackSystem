import archiver from "archiver";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { runQuery } from "../utils/db.js";
import { buildFeedbackHtml } from "../templates/feedbackTemplate.js";

async function launchBrowser() {
  // The bundled @sparticuz/chromium binary is Linux-only (fine for Render).
  // On Windows/Mac, set CHROME_EXECUTABLE_PATH in .env to your installed
  // Chrome (see .env.example). Leave it unset on Render/Linux.
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return puppeteer.launch({
      executablePath: process.env.CHROME_EXECUTABLE_PATH,
      headless: true,
    });
  }
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

// One training -> zip of every COMPLETED employee's PDF, named by employee number.
export const downloadTrainingPdfs = async (req, res) => {
  const { id } = req.params;

  const result = await runQuery(
    `SELECT * FROM training_feedback WHERE training_id = :id AND status = 'COMPLETED' ORDER BY employee_no`,
    { id }
  );

  if (result.rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No completed feedback for this training yet." });
  }

  // Build every PDF first, using ONE browser. If anything fails we can
  // still send a clean JSON error because nothing has been streamed yet.
  let files;
  let browser;
  try {
    browser = await launchBrowser();
    files = [];
    for (const row of result.rows) {
      const page = await browser.newPage();
      try {
        await page.setContent(buildFeedbackHtml(row), { waitUntil: "load" });
        const pdf = await page.pdf({ format: "A4", printBackground: true });
        files.push({ name: `${row.EMPLOYEE_NO}.pdf`, data: Buffer.from(pdf) });
      } finally {
        await page.close();
      }
    }
  } catch (error) {
    console.error("PDF generation failed:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "Could not generate PDFs. If you're running locally on Windows/Mac, set CHROME_EXECUTABLE_PATH in .env.",
    });
  } finally {
    if (browser) await browser.close();
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="training-${id}-feedback.zip"`);

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    console.error("ZIP error:", err.message);
    res.destroy(err);
  });
  archive.pipe(res);
  for (const f of files) archive.append(f.data, { name: f.name });
  await archive.finalize();
};
