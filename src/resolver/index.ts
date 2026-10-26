import type { ServerResponse } from "node:http";
import { resolveFromHtml } from "./extractors/embed.js";

export async function handleResolveLive(res: ServerResponse, channelId: number, origin: string) {
  try {
    // ലൈവ് റിസോൾവ് ചെയ്യുന്ന ബേസിക് ലോജിക്
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: true, channelId, origin }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(message);
  }
}
