import Feedback from "../models/Feedback.js";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export const generateFeedbackPDF = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    const formattedDate = new Date(feedback.date).toLocaleDateString("en-IN");

    const expectationComments =
      feedback.expectation === "Yes"
        ? feedback.expectationYes
        : feedback.expectationNo;

    // Change the path if your logo is inside backend/assets
    const logoPath = path.join(process.cwd(), "assets", "dietech-logo.png");

    const logoBase64 = fs.readFileSync(logoPath).toString("base64");

    const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

@page{
    size:A4;
    margin:10mm;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    color:#000;
    font-size:12px;
}

*{
    box-sizing:border-box;
}

table{
    width:100%;
    border-collapse:collapse;
}

td{
    border:1px solid #000;
    padding:5px;
    vertical-align:middle;
}

.header{
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:12px;
}

.logo-section{
    width:18%;
}

.logo{
    width:120px;
    height:auto;
}

.title-section{
    width:52%;
    text-align:center;
    padding-top:10px;
}

.company{
    font-size:18px;
    font-weight:bold;
}

.form-title{
    margin-top:10px;
    font-size:17px;
    font-weight:bold;
    text-decoration:underline;
}

.doc-section{
    width:30%;
}

.doc-table{
    width:100%;
    font-size:11px;
}

.doc-table td{
    border:1px solid #000;
    padding:4px;
}

.details{
    margin-top:8px;
}

.details td{
    height:32px;
}

.label{
    font-weight:bold;
    width:18%;
}

.value{
    width:32%;
}

.section-number{
    width:40px;
    text-align:center;
    font-weight:bold;
}

.rating-header{
    text-align:center;
    font-weight:bold;
    background:#f3f3f3;
}

.rating-row td{
    height:34px;
}

.large-box{
    height:90px;
    vertical-align:top;
    padding-top:8px;
}

.signature{
    margin-top:25px;
    text-align:center;
}

.signature-name{
    font-family:cursive;
    font-size:18px;
    font-style:italic;
}

.signature-line{
    width:220px;
    border-bottom:1px solid #000;
    margin:10px auto 8px;
}

.footer-label{
    font-weight:bold;
}

</style>

</head>

<body>

<!-- ================= HEADER ================= -->

<div class="header">

    <div class="logo-section">

        <img
            class="logo"
            src="data:image/png;base64,${logoBase64}"
        />

    </div>

    <div class="title-section">

        <div class="company">
            DIETECH INDIA P LTD
        </div>

        <div class="form-title">
            TRAINING - FEEDBACK FORM
        </div>

    </div>

    <div class="doc-section">

        <table class="doc-table">

            <tr>
                <td><b>DOC No</b></td>
                <td>DT/HR/TFB/01</td>
            </tr>

            <tr>
                <td><b>REV No</b></td>
                <td>00</td>
            </tr>

            <tr>
                <td><b>DT</b></td>
                <td>11.03.2015</td>
            </tr>

            <tr>
                <td><b>DCR No</b></td>
                <td>954</td>
            </tr>

        </table>

    </div>

</div>

<!-- ================= PARTICIPANT DETAILS ================= -->

<table class="details">

<tr>

<td class="label">
Participant's Name
</td>

<td class="value">
${feedback.participantName}
</td>

<td class="label">
Emp. No.
</td>

<td class="value">
${feedback.employeeNo}
</td>

</tr>

<tr>

<td class="label">
Department
</td>

<td>
${feedback.department}
</td>

<td class="label">
Date
</td>

<td>
${formattedDate}
</td>

</tr>

<tr>

<td class="label">
Course / Programme
</td>

<td colspan="3">
${feedback.course}
</td>

</tr>

</table>

<!-- ================= SECTION 1 STARTS HERE ================= -->
<!-- ================= TRAINING RATING ================= -->

<table>

<tr>

<td class="section-number" rowspan="7">
1
</td>

<td class="rating-header">
Comment on the following
</td>

<td class="rating-header">
Rating
</td>

</tr>

<tr class="rating-row">
<td>a. Content</td>
<td>${feedback.content}</td>
</tr>

<tr class="rating-row">
<td>b. Presentation</td>
<td>${feedback.presentation}</td>
</tr>

<tr class="rating-row">
<td>c. Style</td>
<td>${feedback.style}</td>
</tr>

<tr class="rating-row">
<td>d. Material / Handouts / Visual Aid</td>
<td>${feedback.material}</td>
</tr>

<tr class="rating-row">
<td>e. Venue / Environment</td>
<td>${feedback.venue}</td>
</tr>

<tr class="rating-row">
<td>f. Others</td>
<td>${feedback.others}</td>
</tr>

</table>

<br>

<!-- ================= EXPECTATION ================= -->

<table>

<tr>

<td class="section-number" rowspan="3">
2
</td>

<td>

<b>Were your expectations met?</b>

&nbsp;&nbsp;

${feedback.expectation}

</td>

</tr>

<tr>

<td class="large-box">

<b>a. If "Yes", please list major areas of your learning:</b>

<br><br>

${feedback.expectation === "Yes"
? (feedback.expectationYes || "")
: ""}

</td>

</tr>

<tr>

<td class="large-box">

<b>b. If "No", please give reasons:</b>

<br><br>

${feedback.expectation === "No"
? (feedback.expectationNo || "")
: ""}

</td>

</tr>

</table>

<br>

<!-- ================= SKILL APPLICATION ================= -->

<table>

<tr>

<td class="section-number">
3
</td>

<td class="large-box">

<b>
Will you be able to use the skills learnt during the programme?
</b>

<br><br>

${feedback.skills || ""}

</td>

</tr>

</table>

<br>

<!-- ================= SUGGESTIONS ================= -->

<table>

<tr>

<td class="section-number">
4
</td>

<td class="large-box">

<b>Suggestions :</b>

<br><br>

${feedback.suggestions || ""}

</td>

</tr>

</table>

<!-- ================= SIGNATURE ================= -->

<div class="signature">

<div class="signature-name">

${feedback.participantName}

</div>

<div class="signature-line"></div>

<div class="footer-label">

Employee Signature

</div>

</div>

</body>

</html>

`;

const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});

const page = await browser.newPage();

await page.setContent(html, {
  waitUntil: "networkidle0",
});

const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();

// Create a safe filename
const safeName = feedback.participantName
  .trim()
  .replace(/\s+/g, "_")
  .replace(/[^\w-]/g, "");

const safeDepartment = feedback.department
  .trim()
  .replace(/\s+/g, "_")
  .replace(/[^\w-]/g, "");

res.set({
  "Content-Type": "application/pdf",
  "Content-Disposition": `attachment; filename="Feedback-${safeName}-${safeDepartment}.pdf"`,
});

return res.send(pdfBuffer);

} catch (error) {

console.error("PDF Generation Error:", error);

return res.status(500).json({
success: false,
message: "PDF generation failed.",
});

}

};