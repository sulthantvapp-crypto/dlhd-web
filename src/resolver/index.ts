import type { ServerResponse } from "node:http";
import { resolveFromHtml } from "./extractors/embed.js"; // അല്ലെങ്കിൽ കറക്റ്റ് പാത്ത്

export async function handleResolveLive(res: ServerResponse, channelId: number, origin: string) {
  try {
    // ഉദാഹരണത്തിന് ആവശ്യമായ എച്ച്എംഎൽ അല്ലെങ്കിൽ റിക്വസ്റ്റ് ഫെച്ച് ചെയ്ത് resolveFromHtml വിളിക്കുന്ന കോഡ്
    // ഇവിടെ നിന്റെ പ്രൊജക്റ്റിലെ നിലവിലുള്ള ലോജിക് അനുസരിച്ച് embedHtml എടുക്കണം.
    
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: true, channelId, origin }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(message);
  }
}
