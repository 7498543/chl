import { useRuntimeConfig } from "../env";
import { initPg } from "./pg";

export * as schema from "./schema";

export function initDB() {
  const config = useRuntimeConfig();
  const pgConfg = {
    url: config.pgUrl,
    connectionString: config.pgConnectionString,
    max: 10,
  };

  return initPg(pgConfg);
}
