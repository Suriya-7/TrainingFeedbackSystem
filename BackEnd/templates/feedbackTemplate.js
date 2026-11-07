import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ *
 *  PER-PLANT DOCUMENT CONTROL (top-right box on the PDF)
 *
 *  Fixed values, hardcoded per plant (not stored in the database).
 *  The PDF always uses the plant of the TRAINING being downloaded, which
 *  is the same plant as the admin who is logged in. So a Plant 2 admin
 *  gets Plant 2's DOC No, a Plant 3 admin gets Plant 3's, and so on.
 *
 *  To add a plant: add one line here. Nothing else needs to change.
 * ------------------------------------------------------------------ */
export const PLANT_DOC_INFO = {
  PLANT1: { docNo: "DT/HR/TFB/01", revNo: "00", dt: "11.03.2015", dcrNo: "954" },
  PLANT2: { docNo: "DT/HR/TFB/02", revNo: "00", dt: "15.06.2016", dcrNo: "1023" },
  PLANT3: { docNo: "DT/HR/TFB/03", revNo: "00", dt: "20.09.2017", dcrNo: "1105" },
};

// "Plant 1", "plant1", "PLANT1" -> "PLANT1"
export const normalizePlantCode = (value) =>
  String(value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * Doc-control values for a plant. Throws (instead of silently falling back to
 * Plant 1) because printing the wrong DOC No on a controlled form is worse
 * than showing an error.
 */
export function getPlantDocInfo(plantCode) {
  const info = PLANT_DOC_INFO[normalizePlantCode(plantCode)];
  if (!info) {
    const err = new Error(
      `No DOC No is configured for plant "${plantCode}". Add it to PLANT_DOC_INFO in BackEnd/templates/feedbackTemplate.js.`
    );
    err.status = 500;
    err.code = "PLANT_DOC_MISSING";
    throw err;
  }
  return info;
}

/* ------------------------------------------------------------------ */

// Logo is read relative to THIS file, so it works no matter which folder
// the server is started from. Loaded lazily: a missing file never stops
// the server — the PDF just renders without it.
let cachedLogo = null;
function getLogoDataUri() {
  if (cachedLogo !== null) return cachedLogo;
  for (const name of ["dietech-mark.png", "dietech-logo.png"]) {
    try {
      const file = path.join(__dirname, "..", "assets", name);
      cachedLogo = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
      return cachedLogo;
    } catch {
      /* try next */
    }
  }
  console.warn("Logo not found in BackEnd/assets — PDF will render without it.");
  cachedLogo = "";
  return cachedLogo;
}

// Escape user-entered text before it goes into the HTML.
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Always India time, so the printed date never shifts with the server's clock (e.g. UTC on a host).
const TZ = "Asia/Kolkata";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-GB", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, ".");
}

function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false });
  return `${formatDate(d)}  ${time}`;
}

const RATING_COLUMNS = ["Excellent", "Very Good", "Good", "Acceptable", "Poor"];

const RATING_ROWS = [
  ["a", "Content", "CONTENT_RATING"],
  ["b", "Presentation", "PRESENTATION_RATING"],
  ["c", "Style", "STYLE_RATING"],
  ["d", "Material / Handouts / Visual Aid", "MATERIAL_RATING"],
  ["e", "Venue / Environment", "VENUE_RATING"],
  ["f", "Others", "OTHERS_RATING"],
];

const same = (a, b) => String(a ?? "").trim().toLowerCase() === String(b).toLowerCase();

const box = (checked) => `<span class="box${checked ? " on" : ""}"></span>`;

function ratingRows(row) {
  return RATING_ROWS.map(([letter, label, key]) => {
    const cells = RATING_COLUMNS.map(
      (col) => `<td class="tick">${box(same(row[key], col))}</td>`
    ).join("");
    return `<tr><td class="idx">${letter}.</td><td class="param">${label}</td>${cells}</tr>`;
  }).join("\n");
}

function yesNo(value) {
  return `<span class="yn">${box(same(value, "Yes"))} Yes</span><span class="yn">${box(same(value, "No"))} No</span>`;
}

/**
 * Builds the printable HTML of ONE feedback form.
 * @param row        a TRAINING_FEEDBACK row (Oracle column names)
 * @param plantCode  the plant the training belongs to, e.g. "PLANT2"
 */
export function buildFeedbackHtml(row, plantCode) {
  const doc = getPlantDocInfo(plantCode);
  const logo = getLogoDataUri();
  const suggestions = String(row.SUGGESTIONS ?? "").trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Training Feedback — ${esc(row.EMPLOYEE_NO)}</title>
<style>
  @page { size: A4; margin: 11mm 12mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root { --ink:#111827; --muted:#6b7280; --line:#9aa3b2; --brand:#000080; --tint:#eef0fa; --soft:#f7f8fc; }
  html, body { margin: 0; padding: 0; }
  body { font-family: "Segoe UI", Arial, Helvetica, sans-serif; color: var(--ink); font-size: 11.5px; line-height: 1.35; }

  .sheet { border: 1.6px solid var(--brand); }

  /* ---------- header ---------- */
  .head { display: grid; grid-template-columns: 1.05fr 1.7fr 1.1fr; border-bottom: 1.6px solid var(--brand); }
  .head > div { padding: 10px 12px; }
  .brand { display: flex; align-items: center; gap: 10px; border-right: 1px solid var(--line); }
  .brand img { height: 46px; width: auto; display: block; }
  .brand .name { font-weight: 800; font-size: 13px; letter-spacing: .02em; line-height: 1.2; color: var(--brand); }
  .title { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-right: 1px solid var(--line); }
  .title h1 { margin: 0; font-size: 15.5px; letter-spacing: .07em; color: var(--brand); white-space: nowrap; }
  .title p { margin: 4px 0 0; font-size: 10.5px; color: var(--muted); letter-spacing: .04em; }
  .doc { padding: 0 !important; display: flex; }
  .doc table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  .doc td { padding: 5px 9px; border-bottom: 1px solid var(--line); }
  .doc tr:last-child td { border-bottom: 0; }
  .doc td:first-child { width: 42%; background: var(--tint); font-weight: 700; color: var(--brand); border-right: 1px solid var(--line); }
  .doc td:last-child { font-weight: 600; }

  /* ---------- participant ---------- */
  .who { display: grid; grid-template-columns: 142px 1fr 84px 1fr; border-bottom: 1px solid var(--line); }
  .who > div { padding: 7px 10px; border-bottom: 1px solid var(--line); min-height: 30px; }
  .who .k { background: var(--tint); font-weight: 700; color: var(--brand); border-right: 1px solid var(--line); }
  .who .v { font-weight: 600; overflow-wrap: anywhere; }
  .who .v.mid { border-right: 1px solid var(--line); }
  .who .span3 { grid-column: 2 / -1; }
  .who .last { border-bottom: 0; }

  /* ---------- sections ---------- */
  .sec { border-bottom: 1px solid var(--line); }
  .sec:last-of-type { border-bottom: 0; }
  .sec-head { display: flex; align-items: center; gap: 9px; padding: 7px 12px; background: var(--soft); border-bottom: 1px solid var(--line); font-weight: 700; }
  .num { width: 20px; height: 20px; border-radius: 50%; background: var(--brand); color: #fff; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
  .sec-body { padding: 0; }

  table.rate { width: 100%; border-collapse: collapse; }
  table.rate th { font-size: 10px; font-weight: 700; color: var(--brand); background: #fff; padding: 6px 4px; border-bottom: 1px solid var(--line); text-align: center; letter-spacing: .02em; }
  table.rate th.left { text-align: left; padding-left: 12px; }
  table.rate td { border-bottom: 1px solid #e3e6ee; padding: 0; height: 34px; }
  table.rate tr:last-child td { border-bottom: 0; }
  table.rate td.idx { width: 28px; padding-left: 12px; color: var(--muted); font-weight: 700; }
  table.rate td.param { padding-left: 4px; font-weight: 600; }
  table.rate td.tick, table.rate th.col { width: 74px; text-align: center; border-left: 1px solid #e3e6ee; }
  table.rate tbody tr:nth-child(even) td { background: #fbfbfe; }

  .box { display: inline-block; width: 15px; height: 15px; border: 1.4px solid #7b8497; border-radius: 3px; background: #fff; position: relative; vertical-align: middle; }
  .box.on { background: var(--brand); border-color: var(--brand); }
  .box.on::after { content: ""; position: absolute; left: 4.2px; top: 0.8px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }

  .q { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 13px 12px; }
  .q .text { font-weight: 600; }
  .yn { display: inline-flex; align-items: center; gap: 6px; margin-left: 18px; font-weight: 600; }

  .notes { margin: 10px 12px 14px; min-height: 112px; padding: 8px 10px; border: 1px solid #d5d9e4; border-radius: 4px; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere;
           background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #e6e9f2 19px, #e6e9f2 20px); line-height: 20px; }
  .notes.empty { color: var(--muted); font-style: italic; }

  /* ---------- signature ---------- */
  .sign { display: flex; justify-content: flex-end; padding: 14px 18px 12px; border-top: 1px solid var(--line); }
  .sign .blk { width: 250px; text-align: center; }
  .sign .script { font-family: "Segoe Script", "Brush Script MT", "Lucida Handwriting", "Apple Chancery", cursive; font-size: 20px; color: #0b1a6b; padding-bottom: 2px; min-height: 30px; }
  .sign .line { border-top: 1.2px solid var(--ink); margin-top: 2px; padding-top: 4px; font-weight: 700; }
  .sign .meta { font-size: 9.5px; color: var(--muted); margin-top: 2px; }

  .foot { margin-top: 7px; display: flex; justify-content: space-between; font-size: 9px; color: var(--muted); }

  .sheet, .sec, .sign { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body>
<div class="sheet">

  <div class="head">
    <div class="brand">
      ${logo ? `<img src="${logo}" alt="">` : ""}
      <div class="name">DIETECH<br>INDIA P LTD</div>
    </div>
    <div class="title">
      <h1>TRAINING FEEDBACK FORM</h1>
      <p>Participant’s evaluation of the programme</p>
    </div>
    <div class="doc">
      <table>
        <tr><td>DOC No</td><td>${esc(doc.docNo)}</td></tr>
        <tr><td>REV No</td><td>${esc(doc.revNo)}</td></tr>
        <tr><td>DT</td><td>${esc(doc.dt)}</td></tr>
        <tr><td>DCR No</td><td>${esc(doc.dcrNo)}</td></tr>
      </table>
    </div>
  </div>

  <div class="who">
    <div class="k">Participant’s Name</div><div class="v mid">${esc(row.PARTICIPANT_NAME)}</div>
    <div class="k">Emp. No.</div><div class="v">${esc(row.EMPLOYEE_NO)}</div>
    <div class="k">Department</div><div class="v mid">${esc(row.DEPARTMENT)}</div>
    <div class="k">Date</div><div class="v">${formatDate(row.SUBMITTED_AT)}</div>
    <div class="k last">Course / Programme</div><div class="v span3 last">${esc(row.COURSE_NAME)}</div>
  </div>

  <div class="sec">
    <div class="sec-head"><span class="num">1</span> Comment on the following</div>
    <div class="sec-body">
      <table class="rate">
        <thead>
          <tr>
            <th class="left" colspan="2">Parameter</th>
            ${RATING_COLUMNS.map((c) => `<th class="col">${c}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${ratingRows(row)}
        </tbody>
      </table>
    </div>
  </div>

  <div class="sec">
    <div class="sec-head"><span class="num">2</span> Expectations</div>
    <div class="q"><span class="text">Were your expectations met?</span><span>${yesNo(row.EXPECTATION_MET)}</span></div>
  </div>

  <div class="sec">
    <div class="sec-head"><span class="num">3</span> Application</div>
    <div class="q"><span class="text">Will you be able to use the skills learnt during the programme?</span><span>${yesNo(row.SKILLS_APPLICATION)}</span></div>
  </div>

  <div class="sec">
    <div class="sec-head"><span class="num">4</span> Suggestions</div>
    <div class="notes${suggestions ? "" : " empty"}">${suggestions ? esc(suggestions) : "No suggestions given."}</div>
  </div>

  <div class="sign">
    <div class="blk">
      <div class="script">${esc(row.PARTICIPANT_NAME)}</div>
      <div class="line">Employee Signature</div>
      <div class="meta">Digitally signed · ${esc(formatDateTime(row.SUBMITTED_AT))}</div>
    </div>
  </div>
</div>

<div class="foot">
  <span>${esc(doc.docNo)} · Rev ${esc(doc.revNo)}</span>
  <span>Dietech India P Ltd · Training Feedback System</span>
</div>
</body>
</html>`;
}

export default buildFeedbackHtml;
