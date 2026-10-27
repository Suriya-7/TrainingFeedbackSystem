import oracledb from "oracledb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
// Return CLOB columns (SUGGESTIONS) as plain strings instead of Lob streams
oracledb.fetchAsString = [oracledb.CLOB];

let pool;
let clientInitialised = false;

/**
 * Builds the Oracle connect string.
 *
 * Easiest: set ORACLE_HOST, ORACLE_PORT and ORACLE_SID in .env (or
 * ORACLE_SERVICE_NAME if the DB team says it is a service name) and this
 * builds the full descriptor for you. A SID cannot be written in the short
 * "host:port/name" form, which is why the descriptor is needed.
 *
 * Advanced: set ORACLE_CONNECT_STRING yourself and it is used as-is.
 */
export function buildConnectString() {
  if (process.env.ORACLE_CONNECT_STRING) return process.env.ORACLE_CONNECT_STRING;

  const { ORACLE_HOST, ORACLE_PORT = "1521", ORACLE_SID, ORACLE_SERVICE_NAME } = process.env;
  if (!ORACLE_HOST || (!ORACLE_SID && !ORACLE_SERVICE_NAME)) {
    throw new Error(
      "Set ORACLE_HOST, ORACLE_PORT and ORACLE_SID (or ORACLE_SERVICE_NAME) in .env"
    );
  }

  const target = ORACLE_SID ? `(SID=${ORACLE_SID})` : `(SERVICE_NAME=${ORACLE_SERVICE_NAME})`;
  return `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${ORACLE_HOST})(PORT=${ORACLE_PORT}))(CONNECT_DATA=${target}))`;
}

/**
 * The default driver ("Thin" mode) needs Oracle Database 12.1 or newer.
 * If the DB is older (e.g. 11g) you get error NJS-138 — in that case install
 * Oracle Instant Client and set ORACLE_CLIENT_LIB_DIR in .env to its folder.
 */

export function initClientIfNeeded() {
  if (clientInitialised) return;

  const libDir = process.env.ORACLE_CLIENT_LIB_DIR;

  if (!libDir) {
    throw new Error(
      "ORACLE_CLIENT_LIB_DIR is missing. Check your backend .env file."
    );
  }

  console.log("Initializing Oracle Client from:", libDir);

  oracledb.initOracleClient({ libDir });
  clientInitialised = true;

  console.log("Oracle Client initialized successfully.");
}


export const connectDB = async () => {
  try {
    initClientIfNeeded();

    pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: buildConnectString(),
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
    });

    console.log("✅ Oracle connection pool created");
  } catch (error) {
    console.error("❌ Oracle Connection Failed:", error.message);
    process.exit(1);
  }
};

export const getConnection = async () => {
  if (!pool) throw new Error("Oracle pool not initialized — call connectDB() first");
  return pool.getConnection();
};

export const closeDB = async () => {
  if (pool) await pool.close(0);
};

export default connectDB;
