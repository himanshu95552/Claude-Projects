import { config } from "dotenv";

/**
 * Standalone scripts (migrate/seed/nightly-job) run outside Next.js, so
 * they don't get Next's built-in .env.local loading for free — without
 * this, `dotenv/config`'s bare default only reads `.env`, silently
 * ignoring the `.env.local` file docs/SETUP.md tells everyone to create
 * (found the hard way: a fresh clone following the docs exactly hit
 * "DATABASE_URL is not set" on `npm run db:migrate`). `.env.local` wins
 * on any key present in both, matching Next.js's own precedence.
 */
config({ path: [".env.local", ".env"] });
