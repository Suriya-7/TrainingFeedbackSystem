import Feedback from "../models/Feedback.js";
import puppeteer from "puppeteer";

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

    const skillsComments =
      feedback.skills === "Yes" ? feedback.skillsYes : feedback.skillsNo;

    const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">


<style>


@page {

 size:A4;

 margin:15mm;

}



body {

 font-family:Arial,sans-serif;

 color:#222;

 font-size:13px;

}



.header {

 text-align:center;

 border-bottom:2px solid black;

 padding-bottom:15px;

}



.company {

 font-size:18px;

 font-weight:bold;

}



.title {

 font-size:20px;

 font-weight:bold;

 margin-top:5px;

}



.section {

 margin-top:10px;

}



.section-title {

 background:#000;

 color:white;

 padding:5px 8px;

 font-weight:bold;

 font-size:12px;

}



table {

 width:100%;

 border-collapse:collapse;

 margin-top:5px;

}



td {

 border:1px solid #ccc;

 padding:5px;

}



.label {

 width:35%;

 font-weight:bold;

 background:#f5f5f5;

}



.comment-box {

 border:1px solid #ccc;

 padding:6px;

 margin-top:5px;

 min-height:25px;

}



.signature {

 margin-top:25px;

 display:flex;

 justify-content:space-between;

}



.signature-box {

 width:40%;

 text-align:center;

}



.signature-name {

 font-family:cursive;

 font-size:18px;

 font-style:italic;

}



.line {

 margin-top:20px;

 border-bottom:1px solid black;

}



</style>


</head>



<body>



<div class="header">


<div class="company">

Dietech India Pvt. Ltd.

</div>


<div class="title">

Training Feedback Form

</div>


</div>





<div class="section">

<div class="section-title">

Participant Details

</div>


<table>


<tr>
<td class="label">
Participant Name
</td>

<td>
${feedback.participantName}
</td>
</tr>



<tr>
<td class="label">
Employee No
</td>

<td>
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
</tr>



<tr>
<td class="label">
Course
</td>

<td>
${feedback.course}
</td>
</tr>



<tr>
<td class="label">
Training Date
</td>

<td>
${formattedDate}
</td>
</tr>



</table>

</div>






<div class="section">

<div class="section-title">

Training Ratings

</div>


<table>


<tr>
<td class="label">
Content
</td>

<td>
${feedback.content}
</td>
</tr>



<tr>
<td class="label">
Presentation
</td>

<td>
${feedback.presentation}
</td>
</tr>



<tr>
<td class="label">
Style
</td>

<td>
${feedback.style}
</td>
</tr>



<tr>
<td class="label">
Material / Visual Aid
</td>

<td>
${feedback.material}
</td>
</tr>



<tr>
<td class="label">
Venue / Environment
</td>

<td>
${feedback.venue}
</td>
</tr>



<tr>
<td class="label">
Others
</td>

<td>
${feedback.others}
</td>
</tr>


</table>


</div>








<div class="section">


<div class="section-title">

Expectations

</div>


<table>


<tr>

<td class="label">

Were expectations met?

</td>


<td>

${feedback.expectation}

</td>


</tr>


<tr>

<td class="label">

Comments

</td>


<td>

${expectationComments || "No comments"}

</td>


</tr>


</table>


</div>








<div class="section">


<div class="section-title">

Skill Application

</div>


<table>


<tr>

<td class="label">

Will apply learned skills?

</td>


<td>

${feedback.skills}

</td>


</tr>


<tr>

<td class="label">

Comments

</td>


<td>

${skillsComments || "No comments"}

</td>


</tr>


</table>


</div>








<div class="section">


<div class="section-title">

Suggestions

</div>


<div class="comment-box">

${feedback.suggestions || "No suggestions provided"}

</div>


</div>








<div class="signature">


<div class="signature-box">


<div class="signature-name">

${feedback.participantName}

</div>


<div class="line"></div>


<p>

Participant Signature

</p>


</div>





<div class="signature-box">


<div class="signature-name">

Trainer

</div>


<div class="line"></div>


<p>

Trainer Signature

</p>


</div>



</div>




</body>


</html>


`;

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",

      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",

      "Content-Disposition": `attachment; filename=feedback-${feedback.employeeNo}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);

    res.status(500).json({
      success: false,

      message: "PDF generation failed.",
    });
  }
};
