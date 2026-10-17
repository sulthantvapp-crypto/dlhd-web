import type { LiveEvent } from "./staticEvents.js";

function sanitizeEventName(name: string): string {
  return name.replace(/"/g, "'").trim();
}

export function generateStaticEventPlaylist(events: LiveEvent[], origin: string): string {
  const lines: string[] = ["#EXTM3U"];

  for (const ev of events) {
    const safeName = sanitizeEventName(ev.name);
    const streamUrl = `${origin.replace(/\/+$/, "")}/api/event-stream?url=${encodeURIComponent(String(ev.id))}`;
    
    lines.push(
      `#EXTINF:-1 tvg-name="${safeName}" group-title="Live Events",${ev.name}`,
      streamUrl,
    );
  }

  return lines.join("\n") + "\n";
}
