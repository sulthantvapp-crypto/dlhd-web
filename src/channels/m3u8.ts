import type { Channel } from "./types.js";

export function sanitizeTvgName(name: string): string {
  return name.replace(/"/g, "'").trim();
}

export function generateM3u8Playlist(channels: Channel[], origin: string): string {
  const lines: string[] = ["#EXTM3U"];

  for (const ch of channels) {
    const safeName = sanitizeTvgName(ch.name);
    const streamUrl = `${origin.replace(/\/+$/, "")}/api/stream/${ch.id}.m3u8`;
    lines.push(
      `#EXTINF:-1 tvg-id="${ch.id}" tvg-name="${safeName}" group-title="DaddyLive 24/7",${ch.name}`,
      streamUrl,
    );
  }

  return lines.join("\n") + "\n";
}
