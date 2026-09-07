import type { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

interface PgConfig {
  connectionString: string;
  max?: number;
  logger?: Logger;
}

export function initPg(config: PgConfig) {
  const pool = new Pool({
    max: config.max ?? 10,
    connectionString: config.connectionString,
  });

  const db = drizzle(pool, {
    logger: config.logger,
  });

  return {
    db,
    close() {
      pool.end();
    },
  };
}
