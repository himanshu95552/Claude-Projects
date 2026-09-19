import { randomBytes, createHash } from "node:crypto";

/**
 * Tokens are generated as random bytes and only their SHA-256 hash is
 * stored — the same pattern as password reset tokens. A leaked database
 * row is useless without the original token, which only ever appears in
 * the email/URL sent to the participant.
 */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
