import { extractAssetrageM3u8 } from "./assetrage.js";
import { extractCdnLiveTvM3u8 } from "./cdnlivetv.js";
import { extractDaddy3M3u8, extractDaddy3Meta } from "./daddy3.js";
import { extractEmbedUrl } from "./dlhd-page.js"; // 🔥 ഇത് ഇവിടെ ആഡ് ചെയ്തിട്ടുണ്ട്
import { decryptHubConfigFromHtml, buildHubPlayableUrl } from "./hub.js";
import { extractIgniteShipM3u8 } from "./igniteandship.js";
import { extractPlusM3u8, extractPlusMeta } from "./plus.js";
import { extractWideiptvM3u8, extractWideiptvSlug } from "./wideiptv.js";
import type { ResolvedStream, ServerKind } from "../types.js"; // 🔥 പാത്ത് ശരിയാക്കിയിരിക്കുന്നു

export type PlayableResult = {
  playableUrl: string;
  mimeType: "application/x-mpegURL" | "video/webm";
  meta: Record<string, string>;
};

export function htmlMayContainPlayable(html: string): boolean {
  return /#EXTM3U|SIGNED_URL|ENCRYPTED_CONFIG|window\._econfig|dreamstream\.cc|streamId|streamUrl:|var _\w+=\[|function \w+\(s\)\{[^}]*atob|player\.load\(\{source:|https:\/\/[^"'`\s]+\.m3u8|\/premium\d+\/index\.m3u8/.test(
    html,
  );
}

export async function extractPlayableFromHtml(html: string): Promise<PlayableResult | null> {
  const assetrageUrl = extractAssetrageM3u8(html);
  if (assetrageUrl) {
    return { playableUrl: assetrageUrl, mimeType: "application/x-mpegURL", meta: {} };
  }

  const plusUrl = extractPlusM3u8(html);
  if (plusUrl) {
    return { playableUrl: plusUrl, mimeType: "application/x-mpegURL", meta: extractPlusMeta(html) };
  }

  const wideUrl = extractWideiptvM3u8(html);
  if (wideUrl) {
    const slug = extractWideiptvSlug(html);
    return { playableUrl: wideUrl, mimeType: "application/x-mpegURL", meta: slug ? { slug } : {} };
  }

  const cdnUrl = extractCdnLiveTvM3u8(html);
  if (cdnUrl) {
    return { playableUrl: cdnUrl, mimeType: "application/x-mpegURL", meta: {} };
  }

  const igniteUrl = extractIgniteShipM3u8(html);
  if (igniteUrl) {
    return { playableUrl: igniteUrl, mimeType: "application/x-mpegURL", meta: {} };
  }

  const daddyUrl = extractDaddy3M3u8(html);
  if (daddyUrl) {
    return {
      playableUrl: daddyUrl,
      mimeType: "application/x-mpegURL",
      meta: extractDaddy3Meta(html),
    };
  }

  const hubConfig = await decryptHubConfigFromHtml(html);
  if (hubConfig) {
    const playableUrl = buildHubPlayableUrl(hubConfig);
    if (playableUrl) {
      return {
        playableUrl,
        mimeType: "video/webm",
        meta: { streamId: hubConfig.streamId, baseUrl: hubConfig.baseUrl },
      };
    }
  }

  return null;
}

export type ResolveContext = {
  channelId: number;
  server: ServerKind;
  embedUrl: string;
};

export async function resolveFromHtml(
  embedHtml: string,
  ctx: ResolveContext,
): Promise<ResolvedStream> {
  const resolved = await extractPlayableFromHtml(embedHtml);
  if (!resolved) {
    throw new Error(`no playable stream in ${ctx.server} embed`);
  }
  return { ...ctx, ...resolved };
}

export function resolveEmbedFromDlhdPage(
  dlhdHtml: string,
  embedHtml: string,
  channelId: number,
  server: ServerKind,
): Promise<ResolvedStream> {
  const embedUrl = extractEmbedUrl(dlhdHtml);
  if (!embedUrl) {
    throw new Error(`embed iframe not found for channel ${channelId} server ${server}`);
  }
  return resolveFromHtml(embedHtml, { channelId, server, embedUrl });
}
