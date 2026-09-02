import { useRuntimeConfig } from "../env";
import { initPg } from "./pg";
import { dbLogger } from "../logger";

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
    logger: dbLogger,
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

export async function closeDB(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}