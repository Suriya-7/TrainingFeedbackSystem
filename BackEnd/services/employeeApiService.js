/**
 * ============================================================
 *  >>> THIS IS THE ONLY FILE YOU NEED TO EDIT <<<
 *  once the DB person gives you the real REST API.
 *
 *  Every other file in this project calls fetchEmployeeByNo() or
 *  fetchEmployeesByPlant() from here — nothing outside this file
 *  talks to the external API directly. So once you update the
 *  URL, headers, and the response-field mapping below to match
 *  what they actually send back, the rest of the app works
 *  unchanged.
 * ============================================================
 */

import axios from "axios";

// Read at call time (not at import time) so .env is always loaded first.
const base = () => process.env.EMPLOYEE_API_BASE_URL;
const key = () => process.env.EMPLOYEE_API_KEY;

// Shown to the user when the external employee service can't be reached.
const unavailable = () =>
  Object.assign(new Error("Employee service is unreachable. Please try again shortly."), { status: 502 });

/**
 * STEP 1 — update this once you know their real endpoint shape.
 * Right now this assumes: GET {BASE}/employees/{employeeNo}
 * returning JSON shaped like:
 *   { employeeNo, fullName, department, plantCode, isTrainer }
 *
 * If their field names differ (e.g. "emp_no" / "emp_name"),
 * change ONLY the right-hand side of each line in the `return`
 * below — don't touch any other file.
 */
export async function fetchEmployeeByNo(employeeNo) {
  try {
    const { data } = await axios.get(
      `${base()}/employees/${encodeURIComponent(employeeNo)}`,
      {
        headers: { Authorization: `Bearer ${key()}` },
        timeout: 5000,
      }
    );

    if (!data) return null;

    // ---- Map their response fields to our internal shape here ----
    return {
      employeeNo: data.employeeNo,
      fullName: data.fullName,
      department: data.department,
      plantCode: data.plantCode,
      isTrainer: Boolean(data.isTrainer),
    };
  } catch (error) {
    if (error.response?.status === 404) return null;
    console.error("employeeApiService.fetchEmployeeByNo failed:", error.message);
    throw unavailable();
  }
}

/**
 * STEP 2 — used by the admin "pick employees to assign" checklist.
 * Assumes: GET {BASE}/employees?plantCode=XXXX returning an array
 * of the same shape as above.
 */
export async function fetchEmployeesByPlant(plantCode) {
  try {
    const { data } = await axios.get(`${base()}/employees`, {
      headers: { Authorization: `Bearer ${key()}` },
      params: { plantCode },
      timeout: 8000,
    });

    const list = Array.isArray(data) ? data : data?.items || [];

    return list.map((e) => ({
      employeeNo: e.employeeNo,
      fullName: e.fullName,
      department: e.department,
      plantCode: e.plantCode,
      isTrainer: Boolean(e.isTrainer),
    }));
  } catch (error) {
    console.error("employeeApiService.fetchEmployeesByPlant failed:", error.message);
    throw unavailable();
  }
}

export default { fetchEmployeeByNo, fetchEmployeesByPlant };
