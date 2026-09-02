import { useRuntimeConfig } from "../env";
import { initPg } from "./pg";
import { dbLogger } from "../logger";

export * as schema from "./schema";

const dbInstance = new Map<string, ReturnType<typeof initPg>>();

export function initDB(name = "main") {
  if (dbInstance.has(name)) {
    return dbInstance.get(name);
  }

  const config = useRuntimeConfig();

  const pgConfig = {
    connectionString: config.DATABASE_URL,
    max: 10,
    logger: dbLogger,
  };

  const db = initPg(pgConfig);

  dbInstance.set(name, db);

  return db;
}

export function getDB(name = "main") {
  if (!dbInstance.has(name)) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return dbInstance.get(name);
}

export async function closeDB(name = "main"): Promise<void> {
  if (!name) {
    dbInstance.forEach((db) => db.close());
    dbInstance.clear();
    return;
  } else if (dbInstance.has(name)) {
    await dbInstance.get(name)?.close();
    dbInstance.delete(name);
  }
}
