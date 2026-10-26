import type { ServerResponse } from "node:http";
import { resolveFromHtml } from "./extractors/embed.js";
import { fetchChannelInfo } from "../channels/fetch.js";
import { watchUrl } from "../channels/urls.js";

export async function handleResolveLive(res: ServerResponse, channelId: number, origin: string) {
  try {
    const channel = await fetchChannelInfo(channelId);
    if (!channel) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("channel not found");
      return;
    }

    const targetUrl = watchUrl(channelId);
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://daddylive.mp/",
      },
    });
    const html = await response.text();

    const resolved = await resolveFromHtml(html, {
      channelId,
      server: "casting", // അല്ലെങ്കിൽ "cast" - പ്ലെയറിന് അനുയോജ്യമായത്
      embedUrl: targetUrl,
    });

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: true, ...resolved, origin }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(message);
  }
}
