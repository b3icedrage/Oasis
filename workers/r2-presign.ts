/**
 * Cloudflare Worker — R2 Presigned URL Generator
 *
 * Deploy this to Cloudflare Workers to generate presigned upload URLs.
 * The R2 credentials stay on the server — never exposed to the client.
 *
 * Environment variables needed on the Worker:
 *   R2_BUCKET      — your R2 bucket name
 *   R2_ACCESS_KEY  — R2 API access key ID
 *   R2_SECRET_KEY  — R2 API secret access key
 *   R2_ACCOUNT_ID  — your Cloudflare account ID
 *
 * Deploy:
 *   npx wrangler deploy
 */

interface Env {
  R2_BUCKET: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
  R2_ACCOUNT_ID: string;
}

// HMAC-SHA256 signing (Web Crypto API available in Workers)
async function hmacSha256(key: string | ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const keyData = typeof key === "string" ? new TextEncoder().encode(key) : new Uint8Array(key);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toAmzDate(date: Date): string {
  return date.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z".slice(-1);
}

function toShortDate(date: Date): string {
  return toAmzDate(date).slice(0, 8);
}

async function signPutUrl(
  env: Env,
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600,
): Promise<{ url: string; publicUrl: string }> {
  const region = "auto";
  const service = "s3";
  const endpoint = `https://${env.R2_BUCKET}.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const host = `${env.R2_BUCKET}.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  const now = new Date();
  const amzDate = toAmzDate(now);
  const shortDate = toShortDate(now);
  const credentialScope = `${shortDate}/${region}/${service}/aws4_request`;

  const expires = Math.floor(now.getTime() / 1000) + expiresInSeconds;

  // Query parameters for signed URL
  const queryParams: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${env.R2_ACCESS_KEY}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresInSeconds),
    "X-Amz-SignedHeaders": "host",
  };

  const canonicalQueryString = Object.keys(queryParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join("&");

  const canonicalRequest = [
    "PUT",
    `/${key}`,
    canonicalQueryString,
    `host:${host}`,
    "",
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const canonicalRequestHash = toHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalRequest)),
  );

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join("\n");

  const kDate = await hmacSha256(`AWS4${env.R2_SECRET_KEY}`, shortDate);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, "aws4_request");

  const signature = toHex(await hmacSha256(kSigning, stringToSign));

  const url = `${endpoint}/${key}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
  const publicUrl = `https://pub-${env.R2_ACCOUNT_ID}.r2.dev/${key}`;

  return { url, publicUrl };
}

async function generateId(): Promise<string> {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // POST /presign — generate a presigned PUT URL
    if (url.pathname === "/presign" && request.method === "POST") {
      try {
        const body = (await request.json()) as { contentType: string; type?: string };
        const id = await generateId();
        const ext = body.contentType.split("/")[1] || "mp4";
        const prefix = body.type === "video" ? "videos" : "images";
        const key = `${prefix}/${id}.${ext}`;

        const { url: presignedUrl, publicUrl } = await signPutUrl(env, key, body.contentType);

        return new Response(
          JSON.stringify({ uploadUrl: presignedUrl, publicUrl, key }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Failed to generate upload URL" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
