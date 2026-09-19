/**
 * Publishing via the LinkedIn Posts API, acting as the authenticated
 * member — platform-api-capabilities.md: "posts *and* comments... no
 * impersonation of a third party." Comments use the legacy socialActions
 * endpoint (Posts API doesn't yet cover comment-create).
 */

export async function publishLinkedInPost(params: {
  accessToken: string;
  authorSub: string; // the "sub" from /v2/userinfo, e.g. a URN-shaped id
  text: string;
}): Promise<{ postId: string }> {
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify({
      author: `urn:li:person:${params.authorSub}`,
      commentary: params.text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn publish failed: ${res.status} ${await res.text()}`);
  }

  const postId = res.headers.get("x-restli-id") ?? res.headers.get("x-linkedin-id") ?? "";
  return { postId };
}

export async function publishLinkedInComment(params: {
  accessToken: string;
  authorSub: string;
  targetPostUrn: string;
  text: string;
}): Promise<{ commentId: string }> {
  const res = await fetch(
    `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(params.targetPostUrn)}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        actor: `urn:li:person:${params.authorSub}`,
        message: { text: params.text },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`LinkedIn comment failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json().catch(() => ({}));
  return { commentId: data.id ?? "" };
}
