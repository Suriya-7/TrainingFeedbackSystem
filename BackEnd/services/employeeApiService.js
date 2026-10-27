
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USE_MOCK = process.env.USE_MOCK_EMPLOYEE_API === "true";

let mockData = [];

if (USE_MOCK) {
  mockData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../mock/employees.json"),
      "utf-8"
    )
  );
}

export async function getEmployeeByNo(empNo) {
  if (USE_MOCK) {
    return mockData.find(
      (e) => String(e.empNo) === String(empNo)
    ) || null;
  }

  // TODO: Call the real REST API here when it arrives.
  throw new Error("Real employee API not configured");
}

export async function listEmployees(plantCode) {
  if (USE_MOCK) {
    return plantCode
      ? mockData.filter((e) => e.plantCode === plantCode)
      : mockData;
  }

  throw new Error("Real employee API not configured");
}

// Aliases required by trainingController.js
export { getEmployeeByNo as fetchEmployeeByNo };
export { listEmployees as fetchEmployeesByPlant };
