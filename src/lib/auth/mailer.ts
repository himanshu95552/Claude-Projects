import { getEnv } from "@/lib/env";

/**
 * Mailer abstraction with exactly one production implementation (Resend)
 * and one dev fallback (console). Swapping providers later means adding a
 * branch here, not touching any call site — every call site just imports
 * `sendMagicLinkEmail`.
 */
export async function sendMagicLinkEmail(params: {
  to: string;
  magicLinkUrl: string;
}): Promise<void> {
  const env = getEnv();

  if (!env.RESEND_API_KEY) {
    // Dev fallback: no email provider configured. Print the link so local
    // development and demo mode work without any third-party account.
    console.log("\n──────────────────────────────────────────────────────");
    console.log(`  Magic link for ${params.to}:`);
    console.log(`  ${params.magicLinkUrl}`);
    console.log("──────────────────────────────────────────────────────\n");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: params.to,
      subject: "Your Alpha Nodus Advocacy sign-in link",
      html: `
        <p>Click below to sign in. This link expires in 15 minutes and can only be used once.</p>
        <p><a href="${params.magicLinkUrl}">Sign in to Alpha Nodus Advocacy</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send magic link email: ${res.status} ${body}`);
  }
}
