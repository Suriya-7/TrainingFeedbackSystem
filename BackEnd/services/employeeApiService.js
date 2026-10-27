import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USE_MOCK = process.env.USE_MOCK_EMPLOYEE_API === "true";

/**
 * THE ONLY SHAPE THE REST OF THE APP USES:
 *   { employeeNo, fullName, department, plantCode, isTrainer }
 *
 * When the real REST API arrives, edit ONLY `normalize()` (map its field
 * names to this shape) and the two `real*` functions below. Nothing else
 * in the project needs to change.
 */
function normalize(raw) {
  return {
    employeeNo: String(raw.employeeNumber).trim(),
    fullName: raw.name,
    department: raw.department,
    // "Plant 1" -> "PLANT1" (must match PLANT_CODE in .env and PLANT_CODE in the DB)
    plantCode: String(raw.plant).replace(/\s+/g, "").toUpperCase(),
    isTrainer: Boolean(raw.isTrainer),
  };
}

// ---------------------------------------------------------------- MOCK
let mockEmployees = [];
if (USE_MOCK) {
  const text = fs
    .readFileSync(path.join(__dirname, "../mock/employees.json"), "utf-8")
    .replace(/^\uFEFF/, ""); // strip BOM if the editor added one
  mockEmployees = JSON.parse(text).map(normalize);
  console.log(`ℹ️  Using MOCK employee data (${mockEmployees.length} employees)`);
}

const mockGetByNo = (empNo) =>
  mockEmployees.find(
    (e) => e.employeeNo.toUpperCase() === String(empNo).trim().toUpperCase()
  ) || null;

const mockListByPlant = (plantCode) =>
  plantCode ? mockEmployees.filter((e) => e.plantCode === plantCode) : mockEmployees;

// ---------------------------------------------------------------- REAL (TODO)
function notConfigured() {
  const err = new Error("Employee API is not configured yet.");
  err.status = 502; // controllers show this message to the user as-is
  throw err;
}

async function realGetByNo(/* empNo */) {
  // TODO: axios.get(`${process.env.EMPLOYEE_API_URL}/employees/${empNo}`) -> normalize(res.data)
  // Return null when the API says "not found".
  return notConfigured();
}

async function realListByPlant(/* plantCode */) {
  // TODO: axios.get(...) -> res.data.map(normalize)
  return notConfigured();
}

// ---------------------------------------------------------------- EXPORTS
export const fetchEmployeeByNo = async (empNo) =>
  USE_MOCK ? mockGetByNo(empNo) : realGetByNo(empNo);

export const fetchEmployeesByPlant = async (plantCode) =>
  USE_MOCK ? mockListByPlant(plantCode) : realListByPlant(plantCode);
