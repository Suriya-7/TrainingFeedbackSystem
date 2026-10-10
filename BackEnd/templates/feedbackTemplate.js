import fs from "fs";
import path from "path";

// Per-plant doc-control header info — fixed values, hardcoded per plant
// as agreed (not stored in the database). Add PLANT2 / PLANT3 here when
// those plants come online — no other file needs to change.
const PLANT_DOC_INFO = {
  PLANT1: { docNo: "DT/HR/TFB/01", revNo: "00", dt: "11.03.2015", dcrNo: "954" },
};

// Uses the logo already in your repo (BackEnd/assets/dietech-logo.png),
// same file the original PDF code used. Loaded lazily so a missing file
// can never stop the server from starting.
let cachedLogo = null;
function getLogoBase64() {
  if (cachedLogo !== null) return cachedLogo;
  try {
    cachedLogo = fs
      .readFileSync(path.join(process.cwd(), "assets", "dietech-logo.png"))
      .toString("base64");
  } catch {
    console.warn("Logo not found at assets/dietech-logo.png — PDF will render without it.");
    cachedLogo = "";
  }
  return cachedLogo;
}

// Escape user-entered text before it goes into the HTML template.
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB").replace(/\//g, ".");
}

export function buildFeedbackHtml(row) {
  const docInfo = PLANT_DOC_INFO[process.env.PLANT_CODE] || PLANT_DOC_INFO.PLANT1;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page { size: A4; margin: 10mm; }
body { font-family: Arial, Helvetica, sans-serif; color: #000; font-size: 12px; }
* { box-sizing: border-box; }
table { width: 100%; border-collapse: collapse; }
td { border: 1px solid #000; padding: 5px; vertical-align: middle; }
.header { width: 100%; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.logo-section { width: 18%; }
.logo { width: 120px; height: auto; }
.title-section { width: 52%; text-align: center; padding-top: 10px; }
.company { font-size: 18px; font-weight: bold; }
.form-title { margin-top: 10px; font-size: 17px; font-weight: bold; text-decoration: underline; }
.doc-section { width: 30%; }
.doc-table { width: 100%; font-size: 11px; }
.doc-table td { border: 1px solid #000; padding: 4px; }
.details { margin-top: 8px; }
.details td { height: 32px; }
.label { font-weight: bold; width: 18%; }
.value { width: 32%; }
.section-number { width: 40px; text-align: center; font-weight: bold; }
.rating-header { text-align: center; font-weight: bold; background: #f3f3f3; }
.rating-row td { height: 34px; }
.large-box { height: 60px; vertical-align: top; padding-top: 8px; }
.signature { margin-top: 25px; text-align: center; }
.signature-name { font-family: cursive; font-size: 18px; font-style: italic; }
.signature-line { width: 220px; border-bottom: 1px solid #000; margin: 10px auto 8px; }
.footer-label { font-weight: bold; }
</style>
</head>
<body>

<div class="header">
  <div class="logo-section">
    <img class="logo" src="data:image/png;base64,${getLogoBase64()}" />
  </div>
  <div class="title-section">
    <div class="company">DIETECH INDIA P LTD</div>
    <div class="form-title">TRAINING - FEEDBACK FORM</div>
  </div>
  <div class="doc-section">
    <table class="doc-table">
      <tr><td><b>DOC No</b></td><td>${docInfo.docNo}</td></tr>
      <tr><td><b>REV No</b></td><td>${docInfo.revNo}</td></tr>
      <tr><td><b>DT</b></td><td>${docInfo.dt}</td></tr>
      <tr><td><b>DCR No</b></td><td>${docInfo.dcrNo}</td></tr>
    </table>
  </div>
</div>

<table class="details">
  <tr>
    <td class="label">Participant's Name</td><td class="value">${esc(row.PARTICIPANT_NAME)}</td>
    <td class="label">Emp. No.</td><td class="value">${esc(row.EMPLOYEE_NO)}</td>
  </tr>
  <tr>
    <td class="label">Department</td><td>${esc(row.DEPARTMENT)}</td>
    <td class="label">Date</td><td>${formatDate(row.SUBMITTED_AT)}</td>
  </tr>
  <tr>
    <td class="label">Course / Programme</td><td colspan="3">${esc(row.COURSE_NAME)}</td>
  </tr>
</table>

<table>
  <tr>
    <td class="section-number" rowspan="7">1</td>
    <td class="rating-header">Comment on the following</td>
    <td class="rating-header">Rating</td>
  </tr>
  <tr class="rating-row"><td>a. Content</td><td>${esc(row.CONTENT_RATING)}</td></tr>
  <tr class="rating-row"><td>b. Presentation</td><td>${esc(row.PRESENTATION_RATING)}</td></tr>
  <tr class="rating-row"><td>c. Style</td><td>${esc(row.STYLE_RATING)}</td></tr>
  <tr class="rating-row"><td>d. Material / Handouts / Visual Aid</td><td>${esc(row.MATERIAL_RATING)}</td></tr>
  <tr class="rating-row"><td>e. Venue / Environment</td><td>${esc(row.VENUE_RATING)}</td></tr>
  <tr class="rating-row"><td>f. Others</td><td>${esc(row.OTHERS_RATING)}</td></tr>
</table>

<br>

<table>
  <tr>
    <td class="section-number">2</td>
    <td><b>Were your expectations met?</b>&nbsp;&nbsp;${esc(row.EXPECTATION_MET)}</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <td class="section-number">3</td>
    <td><b>Will you be able to use the skills learnt during the programme?</b>&nbsp;&nbsp;${esc(row.SKILLS_APPLICATION)}</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <td class="section-number">4</td>
    <td class="large-box"><b>Suggestions :</b><br><br>${esc(row.SUGGESTIONS)}</td>
  </tr>
</table>

<div class="signature">
  <div class="signature-name">${esc(row.PARTICIPANT_NAME)}</div>
  <div class="signature-line"></div>
  <div class="footer-label">Employee Signature</div>
</div>

</body>
</html>`;
}

export default buildFeedbackHtml;
