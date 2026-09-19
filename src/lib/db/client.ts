import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "@/lib/env";
import * as schema from "./schema";

/**
 * Single shared connection pool, lazily created and cached across hot
 * reloads in dev (Next.js re-evaluates modules per request in dev without
 * this guard, which would otherwise leak connections).
 */
declare global {
  // eslint-disable-next-line no-var
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

function getClient() {
  if (!globalThis.__dbClient) {
    globalThis.__dbClient = postgres(getEnv().DATABASE_URL, {
      max: process.env.NODE_ENV === "production" ? 10 : 5,
    });
  }
  return globalThis.__dbClient;
}

export const db = drizzle(getClient(), { schema });
export type Database = typeof db;
