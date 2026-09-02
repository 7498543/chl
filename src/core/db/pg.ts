import { drizzle } from "drizzle-orm/node-postgres";

import { Pool, PoolConfig } from "pg";

interface PgConfig extends PoolConfig {
  url: string;
  connectionString: string;
}

export function initPg(config: PgConfig) {
  const pool = new Pool({
    max: 10,
    ...config,
  });

  const pg = drizzle(pool);

  return {
    db: pg,
    get() {
      return pg.query;
    },
    close() {
      pool.end();
    },
  };
}
