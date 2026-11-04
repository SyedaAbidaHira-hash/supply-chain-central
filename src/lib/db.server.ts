import mysql from "mysql2/promise";

// Connection details for the external Aiven MySQL database. Only the password is secret.
export async function query<T>(sql: string): Promise<T[]> {
  const conn = await mysql.createConnection({
    host: "mysql-1343ec91-project-42b0.j.aivencloud.com",
    port: 27753,
    user: "avnadmin",
    password: process.env["MYSQL_PASSWORD"] ?? "",
    database: "pgd_supplychain",
    ssl: { rejectUnauthorized: false },
    connectTimeout: 15000,
    dateStrings: true,
    disableEval: true,
  });
  try {
    const [rows] = await conn.query(sql);
    return rows as T[];
  } finally {
    await conn.end();
  }
}
