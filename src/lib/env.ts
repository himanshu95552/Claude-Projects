import { z } from "zod";

/**
 * Every environment variable the app reads, validated once at startup.
 * A missing required var fails fast with a clear message instead of a
 * cryptic runtime error three layers down. Optional integrations
 * (Anthropic, LinkedIn, push) are allowed to be absent — the app runs in
 * DEMO_MODE for those features instead of crashing, so a fresh clone is
 * runnable before any third-party account is set up. See docs/SETUP.md.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  APP_URL: z.string().default("http://localhost:3000"),
  SESSION_SECRET: z
    .string()
    .min(16, "SESSION_SECRET must be at least 16 characters")
    .default("dev-only-insecure-secret-change-me-please"),
  ENCRYPTION_KEY: z
    .string()
    .default("dev-only-insecure-32-byte-key!!"),

  // Email delivery for magic links. If unset, links are logged to the
  // server console instead — fine for local dev, not for production.
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM: z.string().default("Alpha Nodus Advocacy <onboarding@example.com>"),

  // Claude / Anthropic — generation is disabled (DEMO_MODE) without this.
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_DRAFTING_MODEL: z.string().default("claude-sonnet-5"),
  ANTHROPIC_RESEARCH_MODEL: z.string().default("claude-haiku-4-5"),

  // LinkedIn OAuth (Share on LinkedIn product, w_member_social scope).
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),

  // Instagram / Facebook (Meta Graph API) — phase 6, optional.
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),

  // Web Push (VAPID) — optional; push notifications no-op without it.
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().default("mailto:ops@example.com"),

  // Protects the nightly-generation cron endpoint from public invocation.
  CRON_SECRET: z.string().default("dev-only-cron-secret"),

  MONTHLY_SPEND_CAP_USD: z.coerce.number().default(30),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

export function isDemoMode(): boolean {
  return !getEnv().ANTHROPIC_API_KEY;
}

export function isLinkedInConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET);
}

export function isPushConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);
}

export function isMetaConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.META_APP_ID && env.META_APP_SECRET);
}
