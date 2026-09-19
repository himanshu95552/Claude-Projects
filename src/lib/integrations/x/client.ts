/**
 * X (Twitter) API v2 posting — docs.x.com/x-api/posts/create-post.
 * 280-char limit per post, verified current for 2026. Threads are a
 * sequence of posts, each replying to the previous via `reply.in_reply_to_tweet_id`.
 */

const POSTS_URL = "https://api.x.com/2/tweets";

export type XPostResult = { id: string };

export async function publishXPost(params: {
  accessToken: string;
  text: string;
  inReplyToTweetId?: string;
}): Promise<XPostResult> {
  if (params.text.length > 280) {
    throw new Error(`X post text is ${params.text.length} chars, exceeds the 280-char limit`);
  }

  const body: Record<string, unknown> = { text: params.text };
  if (params.inReplyToTweetId) {
    body.reply = { in_reply_to_tweet_id: params.inReplyToTweetId };
  }

  const res = await fetch(POSTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`X publish failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return { id: data.data.id };
}

/**
 * Publishes a thread sequentially — never in a burst (same pacing
 * principle as src/lib/generation/replies.ts's planSweepPublishOrder,
 * generalized: rapid-fire posting reads as automation). Stops and
 * returns what succeeded on the first failure rather than retrying.
 */
export async function publishXThread(params: {
  accessToken: string;
  posts: string[]; // pre-split into <=280-char chunks by the caller
}): Promise<{ postedIds: string[]; failedAtIndex: number | null }> {
  const postedIds: string[] = [];
  let previousId: string | undefined;

  for (let i = 0; i < params.posts.length; i++) {
    try {
      const result = await publishXPost({
        accessToken: params.accessToken,
        text: params.posts[i],
        inReplyToTweetId: previousId,
      });
      postedIds.push(result.id);
      previousId = result.id;
    } catch (err) {
      console.error(`X thread publish failed at post ${i}:`, err);
      return { postedIds, failedAtIndex: i };
    }
  }

  return { postedIds, failedAtIndex: null };
}

/**
 * Splits long-form text into a thread of <=280-char posts, breaking on
 * sentence boundaries where possible and numbering each ("1/4"). Reserves
 * 6 chars for the counter suffix.
 */
export function splitIntoThread(text: string, maxLen = 280): string[] {
  const COUNTER_RESERVE = 8; // " (10/10)"
  const budget = maxLen - COUNTER_RESERVE;
  const sentences = text.split(/(?<=[.!?])\s+/);

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > budget && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);

  if (chunks.length === 1) return chunks;
  return chunks.map((chunk, i) => `${chunk} (${i + 1}/${chunks.length})`);
}
