// Run with:   node testConnection.js
// Options:    --write-test   also checks INSERT/UPDATE (always rolled back)
//             --stability    runs 20 quick queries to see if the connection drops
//
// Each check runs on its own. If the connection drops during a check, the script
// reconnects and retries ONCE, so you can see whether the drop was a one-off
// (unstable network) or happens every time at the same step (client/server
// version problem).

import "dotenv/config";
import oracledb from "oracledb";
import { buildConnectString, initClientIfNeeded } from "./config/oracleDb.js";

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const flags = new Set(process.argv.slice(2));

// Exactly the columns the application's SQL uses.
const EXPECTED = {
  TRAINING_TYPES: ["TRAINING_TYPE_ID", "TRAINING_NAME", "IS_ACTIVE", "CREATED_AT", "UPDATED_AT"],
  EMPLOYEE_CREDENTIALS: ["CREDENTIAL_ID", "EMPLOYEE_NO", "PLANT_CODE", "PASSWORD_HASH", "LAST_LOGIN_AT", "CREATED_AT", "UPDATED_AT"],
  TRAININGS: ["TRAINING_ID", "TRAINING_TYPE_ID", "TRAINER_EMPLOYEE_NO", "PLANT_CODE", "CREATED_AT"],
  TRAINING_FEEDBACK: [
    "RECORD_ID", "TRAINING_ID", "EMPLOYEE_NO", "PARTICIPANT_NAME", "DEPARTMENT", "COURSE_NAME",
    "STATUS", "ALLOW_RESUBMISSION", "ASSIGNED_AT",
    "CONTENT_RATING", "PRESENTATION_RATING", "STYLE_RATING", "MATERIAL_RATING", "VENUE_RATING", "OTHERS_RATING",
    "EXPECTATION_MET", "SKILLS_APPLICATION", "SUGGESTIONS", "SUBMITTED_AT",
  ],
  AUDIT_LOGS: ["LOG_ID", "ACTOR_TYPE", "ACTOR_REF", "ACTION", "TARGET_TABLE", "TARGET_ID", "DETAILS", "CREATED_AT"],
};

// Errors that mean "the connection died" (as opposed to a real SQL/permission error)
const LOST = /NJS-500|NJS-501|DPI-1080|ORA-03135|ORA-03113|ORA-03114|ORA-12537|ORA-12547/;

const firstLine = (e) => String(e.message).split("\n")[0];
const toVersion = (s) => String(s || "").split(".").map((n) => parseInt(n, 10) || 0);
const atLeast = (v, [maj, min = 0]) => v[0] > maj || (v[0] === maj && (v[1] || 0) >= min);

let connection = null;
const results = [];

async function connect() {
  if (connection) {
    try { await connection.close(); } catch { /* already dead */ }
    connection = null;
  }
  connection = await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: buildConnectString(),
  });
}

// Runs one check; on a dropped connection reconnects and retries once.
async function check(name, fn) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await fn();
      results.push({ name, ok: true, recovered: attempt === 2 });
      return;
    } catch (error) {
      const dropped = LOST.test(error.message);
      if (dropped && attempt === 1) {
        console.log(`   ⚠️  "${name}": connection dropped (${firstLine(error)}). Reconnecting and retrying once...`);
        try {
          await connect();
          continue;
        } catch (reconnectError) {
          results.push({ name, ok: false, dropped: true, error: firstLine(reconnectError) });
          console.log(`❌ ${name}: could not reconnect — ${firstLine(reconnectError)}`);
          return;
        }
      }
      results.push({ name, ok: false, dropped, error: firstLine(error) });
      console.log(`❌ ${name}: ${firstLine(error)}`);
      return;
    }
  }
}

async function main() {
  try {
    initClientIfNeeded();
    console.log("Connecting with:", buildConnectString());
    await connect();
    console.log("✅ Connected successfully.\n");

    // ---- Versions: is this client officially supported for this server? ----
    const serverStr = connection.oracleServerVersionString || "unknown";
    let clientStr = "unknown";
    try { clientStr = oracledb.oracleClientVersionString || "unknown"; } catch { /* thin mode */ }
    console.log("Database (server) version :", serverStr);
    console.log("Oracle Client version     :", clientStr);

    const server = toVersion(serverStr), client = toVersion(clientStr);
    if (server[0] && client[0]) {
      if (!atLeast(server, [11, 2]) && atLeast(client, [12, 2])) {
        console.log("⚠️  Oracle says this client version only supports databases 11.2 and newer. Your database is older,");
        console.log("    so random disconnects (ORA-03135) are possible. Clients 12.1 or 11.2 officially support it.");
      } else if (!atLeast(server, [12, 1]) && atLeast(client, [21, 0])) {
        console.log("⚠️  This client version only supports databases 12.1 and newer.");
      }
    }

    // ---- 1. Login ----
    await check("Login", async () => {
      const who = await connection.execute(`SELECT USER AS USERNAME FROM dual`, {}, OBJ);
      console.log("Logged in as              :", who.rows[0].USERNAME, "\n");
    });

    // ---- 2. Tables ----
    let found = [];
    await check("Tables", async () => {
      const t = await connection.execute(`SELECT table_name AS TABLE_NAME FROM user_tables ORDER BY table_name`, {}, OBJ);
      found = t.rows.map((r) => r.TABLE_NAME);
      console.log("Tables in schema :", found.length ? found.join(", ") : "(none)");
      const missing = Object.keys(EXPECTED).filter((n) => !found.includes(n));
      if (missing.length) console.log("⚠️  Missing tables:", missing.join(", "), "(if they are under another user, tell me the schema name)");
      else console.log("✅ All 5 expected tables are present.");
    });

    // ---- 3. Columns (one small query per table) ----
    await check("Columns", async () => {
      let allGood = true;
      const present = Object.keys(EXPECTED).filter((n) => found.includes(n));
      for (const name of present) {
        const c = await connection.execute(
          `SELECT column_name AS COLUMN_NAME FROM user_tab_columns WHERE table_name = :t`,
          { t: name },
          OBJ
        );
        const have = c.rows.map((r) => r.COLUMN_NAME);
        const lacking = EXPECTED[name].filter((col) => !have.includes(col));
        if (lacking.length) {
          allGood = false;
          console.log(`❌ ${name} is missing columns: ${lacking.join(", ")}`);
        }
      }
      if (allGood) console.log(`✅ Every column the app needs exists in the ${present.length} table(s) found.`);
    });

    // ---- 4. Optional write test (always rolled back) ----
    if (flags.has("--write-test")) {
      await check("Write test (INSERT + UPDATE, rolled back)", async () => {
        const noCommit = { autoCommit: false };
        try {
          const ins = await connection.execute(
            `INSERT INTO training_types (training_name) VALUES (:n) RETURNING training_type_id INTO :id`,
            { n: "__connection_test__", id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
            noCommit
          );
          console.log("✅ INSERT works. The ID was generated automatically:", ins.outBinds.id[0]);
          await connection.execute(
            `UPDATE training_types SET training_name = :n WHERE training_type_id = :id`,
            { n: "__connection_test_2__", id: ins.outBinds.id[0] },
            noCommit
          );
          console.log("✅ UPDATE works.");
        } catch (error) {
          if (LOST.test(error.message)) throw error; // let the retry logic handle dropped connections
          if (error.message.includes("ORA-01400")) console.log("→ The ID column is NOT filled in automatically. Ask the DB team to add a sequence + trigger (or tell me and I'll adapt the code).");
          else if (error.message.includes("ORA-01031")) console.log("→ This user lacks INSERT/UPDATE permission on the table.");
          else if (error.message.includes("ORA-00942")) console.log("→ Table not found or not accessible to this user.");
          throw error;
        } finally {
          try { await connection.rollback(); console.log("↩️  Rolled back — nothing was saved."); } catch { /* connection already gone */ }
        }
      });
    }

    // ---- 5. Optional stability test ----
    if (flags.has("--stability")) {
      console.log("\n--- Stability test: 20 quick queries, 1 per second ---");
      let okCount = 0, dropCount = 0;
      for (let i = 1; i <= 20; i++) {
        try {
          await connection.execute(`SELECT 1 AS N FROM dual`, {}, OBJ);
          okCount++;
        } catch (error) {
          dropCount++;
          console.log(`   query ${i}: ${firstLine(error)}`);
          try { await connect(); } catch { break; }
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      console.log(`Stability result: ${okCount}/20 queries succeeded, ${dropCount} failed.`);
      results.push({
        name: `Stability (${okCount}/20 ok)`,
        ok: dropCount === 0,
        stability: true,
        error: `${dropCount} of 20 queries dropped the connection`,
      });
    }

    // ---- Summary + verdict ----
    console.log("\n==================== SUMMARY ====================");
    for (const r of results) {
      console.log(`${r.ok ? (r.recovered ? "⚠️ " : "✅") : "❌"} ${r.name}${r.recovered ? "  (worked only after a reconnect)" : ""}${r.ok ? "" : "  → " + r.error}`);
    }
    const unstable = results.find((r) => r.stability && !r.ok);
    const failedDropped = results.some((r) => !r.ok && r.dropped);
    const recovered = results.some((r) => r.recovered);
    if (results.every((r) => r.ok && !r.recovered)) {
      console.log("\nVERDICT: everything works.");
    } else if (unstable) {
      console.log("\nVERDICT: queries work, but the connection drops at random. That is either an unreliable network path or the");
      console.log("client/database version mismatch. Run the same test from a DIFFERENT network: if the drops follow the network,");
      console.log("it is the network; if they happen on every network, it is the client version.");
    } else if (failedDropped) {
      console.log("\nVERDICT: the connection dies at the same step even after reconnecting. That points to a client/database");
      console.log("version problem (or a firewall cutting the connection), not random network noise.");
    } else if (recovered) {
      console.log("\nVERDICT: the connection dropped once but recovered. That points to an unstable network path (e.g. mobile data).");
    } else {
      console.log("\nVERDICT: some checks failed for reasons other than a dropped connection — see the ❌ lines above.");
    }
  } catch (error) {
    console.error("\n❌ Failed:", firstLine(error));
    if (error.message.includes("DPI-1047")) {
      console.error("→ Oracle Instant Client not found. Check ORACLE_CLIENT_LIB_DIR points at the folder that directly contains oci.dll.");
    } else if (error.message.includes("NJS-138") || error.message.includes("NJS-116")) {
      console.error("→ The database is too old for the default driver mode. Set ORACLE_CLIENT_LIB_DIR in .env to your Instant Client folder.");
    } else if (error.message.includes("ORA-12170") || error.message.includes("NJS-503") || error.message.includes("timed out")) {
      console.error("→ Cannot reach the server: firewall, VPN/network, or your IP isn't allowlisted. Try the same test from another network.");
    } else if (error.message.includes("ORA-01017")) {
      console.error("→ Wrong username or password.");
    } else if (error.message.includes("ORA-12505") || error.message.includes("ORA-12514")) {
      console.error("→ SID/service name not recognised: ask the DB team whether it is a SID or a service name.");
    }
  } finally {
    if (connection) { try { await connection.close(); } catch { /* ignore */ } }
  }
}

main();
