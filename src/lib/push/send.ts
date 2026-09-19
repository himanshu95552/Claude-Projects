import webpush from "web-push";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pushSubscriptions } from "@/lib/db/schema";
import { getEnv, isPushConfigured } from "@/lib/env";

let configured = false;
function ensureConfigured() {
  if (configured || !isPushConfigured()) return;
  const env = getEnv();
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY!, env.VAPID_PRIVATE_KEY!);
  configured = true;
}

/**
 * Sends a push notification to every device a participant has subscribed
 * from. Silently no-ops if push isn't configured (VAPID keys unset) —
 * the app is fully usable without it, per DEMO_MODE-style graceful
 * degradation used elsewhere.
 */
export async function sendPushToParticipant(
  participantId: string,
  payload: { title: string; body: string; url?: string },
): Promise<{ sent: number; failed: number }> {
  if (!isPushConfigured()) return { sent: 0, failed: 0 };
  ensureConfigured();

  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.participantId, participantId));
  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload),
      );
      sent++;
    } catch (err: unknown) {
      failed++;
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // Subscription is gone (browser data cleared, uninstalled, etc.) — clean it up.
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
      } else {
        console.error("Push send failed:", err);
      }
    }
  }

  return { sent, failed };
}
