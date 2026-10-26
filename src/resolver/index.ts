import type { ServerResponse } from "node:http";
import { resolveStream } from "./extractors/embed.js"; // അല്ലെങ്കിൽ നിന്റെ പ്രൊജക്റ്റിലുള്ള മെയിൻ എക്സ്ട്രാക്ഷൻ ഫങ്ഷൻ

export async function handleResolveLive(res: ServerResponse, channelId: number, origin: string) {
  try {
    // യഥാർത്ഥ സ്ട്രീം ലിങ്ക് റിസോൾവ് ചെയ്യുന്ന ഭാഗം
    const streamUrl = await resolveStream(channelId);
    
    if (!streamUrl) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("stream not found");
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: true, url: streamUrl, origin }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(message);
  }
}
