import { getConnection } from "../config/oracleDb.js";

/**
 * Runs a single SQL statement and always releases the connection,
 * even on error. Use for everything that is one statement.
 */
export const runQuery = async (sql, binds = {}) => {
  const conn = await getConnection();
  try {
    return await conn.execute(sql, binds);
  } finally {
    await conn.close();
  }
};

/**
 * Runs several statements as ONE all-or-nothing unit.
 * `work` receives an exec(sql, binds) function; everything it runs is
 * committed together at the end, or rolled back if anything throws.
 */
export const withTransaction = async (work) => {
  const conn = await getConnection();
  try {
    const exec = (sql, binds = {}) => conn.execute(sql, binds, { autoCommit: false });
    const result = await work(exec);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    await conn.close();
  }
};

/** True for Oracle "unique constraint violated" (ORA-00001). */
export const isDuplicateError = (error) =>
  error?.errorNum === 1 || String(error?.message).includes("ORA-00001");

export default runQuery;
