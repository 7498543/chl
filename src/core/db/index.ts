import { useRuntimeConfig } from "../env";
import { initPg } from "./pg";

export * as schema from "./schema";

let dbInstance: ReturnType<typeof initPg> | null = null;

export function initDB() {
  if (dbInstance) {
    return dbInstance;
  }

  const config = useRuntimeConfig();

  const pgConfig = {
    connectionString: config.DATABASE_URL,
    max: 10,
  };

  dbInstance = initPg(pgConfig);
  return dbInstance;
}

export function getDB() {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return dbInstance;
}
