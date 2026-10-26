import type { ServerResponse } from "node:http";

export async function handleResolveLive(res: ServerResponse, channelId: number, origin: string) {
  try {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: true, channelId, origin }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(message);
  }
}
