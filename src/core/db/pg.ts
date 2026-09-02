import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

interface PgConfig {
  connectionString: string;
  max?: number;
}

export function initPg(config: PgConfig) {
  const pool = new Pool({
    max: config.max ?? 10,
    connectionString: config.connectionString,
  });

  const db = drizzle(pool);

  return {
    db,
    close() {
      pool.end();
    },
  };
}
