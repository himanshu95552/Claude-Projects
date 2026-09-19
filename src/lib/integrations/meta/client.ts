/**
 * Instagram (Graph API, Business/Creator account) and Facebook Page
 * publishing — platform-api-capabilities.md. Personal FB profiles are
 * confirmed unavailable via API (removed 2018); that path stays
 * manual-only and never appears here.
 */

export async function publishInstagramPost(params: {
  accessToken: string;
  igUserId: string;
  imageUrl: string;
  caption: string;
}): Promise<{ mediaId: string }> {
  // Two-step publish: create a media container, then publish it.
  const createRes = await fetch(`https://graph.facebook.com/v19.0/${params.igUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: params.imageUrl,
      caption: params.caption,
      access_token: params.accessToken,
    }),
  });
  if (!createRes.ok) throw new Error(`Instagram media create failed: ${createRes.status} ${await createRes.text()}`);
  const { id: creationId } = await createRes.json();

  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${params.igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: creationId, access_token: params.accessToken }),
  });
  if (!publishRes.ok) throw new Error(`Instagram publish failed: ${publishRes.status} ${await publishRes.text()}`);
  const { id: mediaId } = await publishRes.json();
  return { mediaId };
}

export async function publishFacebookPagePost(params: {
  accessToken: string;
  pageId: string;
  message: string;
}): Promise<{ postId: string }> {
  const res = await fetch(`https://graph.facebook.com/v19.0/${params.pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: params.message, access_token: params.accessToken }),
  });
  if (!res.ok) throw new Error(`Facebook Page publish failed: ${res.status} ${await res.text()}`);
  const { id: postId } = await res.json();
  return { postId };
}
