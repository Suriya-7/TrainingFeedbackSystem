// Run once with `node testConnection.js` (after `npm install` and filling .env)
// to confirm the credentials work before starting the full app.

import "dotenv/config";
import oracledb from "oracledb";
import { buildConnectString, initClientIfNeeded } from "./config/oracleDb.js";

const EXPECTED_TABLES = [
  "AUDIT_LOGS",
  "EMPLOYEE_CREDENTIALS",
  "TRAINING_FEEDBACK",
  "TRAINING_TYPES",
  "TRAININGS",
];

async function main() {
  let connection;
  try {
    initClientIfNeeded();
    const connectString = buildConnectString();
    console.log("Connecting with:", connectString);

    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString,
    });
    console.log("✅ Connected successfully.\n");

    const who = await connection.execute(`SELECT USER FROM dual`);
    console.log("Logged in as:", who.rows[0][0]);

    const tables = await connection.execute(`SELECT table_name FROM user_tables ORDER BY table_name`);
    const found = tables.rows.map((r) => r[0]);
    console.log("Tables in this schema:", found.length ? found.join(", ") : "(none)");

    const missing = EXPECTED_TABLES.filter((t) => !found.includes(t));
    if (missing.length) {
      console.log("\n⚠️  Missing expected tables:", missing.join(", "));
      console.log("   (If the DB team created them in another schema, tell me the schema name.)");
    } else {
      console.log("\n✅ All 5 expected tables are present.");
    }

    // Read test on one table
    if (found.includes("TRAINING_TYPES")) {
      const c = await connection.execute(`SELECT COUNT(*) FROM training_types`);
      console.log("SELECT works — rows in TRAINING_TYPES:", c.rows[0][0]);
    }
  } catch (error) {
    console.error("\n❌ Failed:", error.message);
    if (error.message.includes("NJS-138") || error.message.includes("NJS-116")) {
      console.error("→ Database version is too old for the default driver mode, or password verifier issue.");
      console.error("  Install Oracle Instant Client and set ORACLE_CLIENT_LIB_DIR in .env.");
    } else if (error.message.includes("NJS-503") || error.message.includes("timed out")) {
      console.error("→ Cannot reach the server: check host/port, your network/VPN, or whether your IP must be allowlisted.");
    } else if (error.message.includes("ORA-01017")) {
      console.error("→ Wrong username or password.");
    } else if (error.message.includes("ORA-12505") || error.message.includes("ORA-12514")) {
      console.error("→ SID/service name not recognised: ask the DB team whether it is a SID or a service name.");
    }
  } finally {
    if (connection) await connection.close();
  }
}

main();
