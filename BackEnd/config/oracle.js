import oracledb from "oracledb";

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_DIR });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

let pool;
export async function initPool() {
  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING, // the (DESCRIPTION=...) string
    poolMin: 1,
    poolMax: 4,
    pingInterval: 30, // re-checks idle connections (helps with ORA-03135)
  });
}

export async function execute(sql, binds = {}) {
  const conn = await pool.getConnection();
  try {
    return await conn.execute(sql, binds);
  } finally {
    await conn.close();
  }
}