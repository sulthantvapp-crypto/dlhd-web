import type { ServerResponse } from "node:http";
import { fetchChannelList } from "./fetch.js";
import { generateM3u8Playlist } from "./m3u8.js";

export type { Channel } from "./types.js";
export { parseChannelList } from "./parse.js";
export { watchUrl, playerPageUrl } from "./urls.js";
export { fetchChannelList, fetchChannelInfo } from "./fetch.js";
export { generateM3u8Playlist, sanitizeTvgName } from "./m3u8.js";

// ചാനൽ ലിസ്റ്റ് എപിഐ ഹാൻഡ്ലർ
export async function handleChannelList(res: ServerResponse) {
  try {
    const channels = await fetchChannelList();
    const json = JSON.stringify(channels, null, 2);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(json);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("error fetching channels");
  }
}

// എം3യു8 പ്ലേലിസ്റ്റ് ഹാൻഡ്ലർ
export async function handlePlaylist(res: ServerResponse, origin: string) {
  try {
    const channels = await fetchChannelList();
    const playlist = generateM3u8Playlist(channels, origin);
    res.writeHead(200, { "Content-Type": "audio/x-mpegurl; charset=utf-8" });
    res.end(playlist);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("error generating playlist");
  }
}

// സ്ട്രീം റിസോൾവർ ഹാൻഡ്ലർ
export async function handleStreamResolver(res: ServerResponse, channelId: number, origin: string) {
  try {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ channelId, origin }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("error resolving stream");
  }
}
