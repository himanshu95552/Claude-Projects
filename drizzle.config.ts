import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema/index.ts",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://app:app_dev_password@localhost:5432/alphanodus_advocacy",
  },
  verbose: true,
  strict: true,
});
