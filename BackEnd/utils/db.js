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

/* ------------------------------------------------------------------ *
 *  ID GENERATION (no sequences / triggers in the database)
 *
 *  The tables' ID columns are NOT filled in by the database, so the
 *  code supplies them: next ID = highest existing ID + 1.
 *  The PRIMARY KEY is the safety net: if two requests ever pick the
 *  same ID at the same instant, Oracle rejects one with ORA-00001 and
 *  withIdRetry() simply tries again with a fresh number.
 * ------------------------------------------------------------------ */

// Table/column names are inserted into SQL text, so only plain names are allowed.
const IDENT = /^[A-Za-z][A-Za-z0-9_]*$/;
const ident = (name) => {
  if (!IDENT.test(name)) throw new Error(`Unsafe SQL identifier: ${name}`);
  return name;
};

/** Marks a value as a SQL expression (e.g. SYSTIMESTAMP) instead of a bind value. */
export const raw = (sql) => ({ __raw: sql });

/** Highest existing ID + 1 (1 for an empty table). `exec` is runQuery-style or a transaction exec. */
export const getNextId = async (exec, table, idColumn) => {
  const result = await exec(
    `SELECT NVL(MAX(${ident(idColumn)}), 0) + 1 AS NEXT_ID FROM ${ident(table)}`
  );
  return Number(result.rows[0].NEXT_ID);
};

/**
 * INSERT one row, filling the ID column for you. Returns the ID used.
 *   data: { column_name: value, other_column: raw("SYSTIMESTAMP") }
 * Pass `id` only when you pre-computed it (bulk inserts).
 */
export const insertRow = async (exec, table, idColumn, data = {}, id) => {
  const newId = id ?? (await getNextId(exec, table, idColumn));

  const columns = [ident(idColumn)];
  const values = [":new_id"];
  const binds = { new_id: newId };

  for (const [column, value] of Object.entries(data)) {
    columns.push(ident(column));
    if (value && typeof value === "object" && "__raw" in value) {
      values.push(value.__raw);
    } else {
      values.push(`:b_${column}`);
      binds[`b_${column}`] = value === undefined ? null : value;
    }
  }

  await exec(
    `INSERT INTO ${ident(table)} (${columns.join(", ")}) VALUES (${values.join(", ")})`,
    binds
  );
  return newId;
};

/** Re-runs `work` if it fails with ORA-00001 (two requests picked the same ID). */
export const withIdRetry = async (work, attempts = 6) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await work();
    } catch (error) {
      if (!isDuplicateError(error) || attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 60));
    }
  }
};

/** One-statement convenience: insert a row with an auto-picked ID and commit. Returns the ID. */
export const insertOne = (table, idColumn, data) =>
  withIdRetry(() => withTransaction((exec) => insertRow(exec, table, idColumn, data)));

export default runQuery;
