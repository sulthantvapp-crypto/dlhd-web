import type { Channel } from "./types.js";

/**
 * Sanitizes channel names to ensure safe usage inside M3U attributes.
 */
export function sanitizeTvgName(name: string): string {
  return name.replace(/"/g, "'").trim();
}

/**
 * Generates an IPTV M3U8 playlist string for a list of channels.
 * Formats standard #EXTINF attributes for media players like VLC, TiviMate, etc.
 * 
 * @param channels Array of channels
 * @param origin Host origin (e.g., http://localhost:3000)
 * @returns M3U playlist formatted string
 */
export function generateM3u8Playlist(channels: Channel[], origin: string): string {
  const lines: string[] = ["#EXTM3U"];

  for (const ch of channels) {
    const safeName = sanitizeTvgName(ch.name);
    // ഒറിജിനൽ പ്രോക്സി സ്ട്രീം റൂട്ട് വഴി ലിങ്കുകൾ ജനറേറ്റ് ചെയ്യുന്നു, ഇത് ടോക്കൺ എക്സ്പയർ ആവാതെ ലൈവായി വർക്ക് ചെയ്യും
    const streamUrl = `${origin.replace(/\/+$/, "")}/api/stream/${ch.id}.m3u8`;
    lines.push(
      `#EXTINF:-1 tvg-id="${ch.id}" tvg-name="${safeName}" group-title="DaddyLive 24/7",${ch.name}`,
      streamUrl,
    );
  }

  return lines.join("\n") + "\n";
}
