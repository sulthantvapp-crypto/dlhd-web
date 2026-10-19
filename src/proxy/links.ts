function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function buildProxyUrl(directUrl: string, referer: string, origin: string): string {
  // DaddyLive ലിങ്കിലെ പുതിയ ടോക്കണുകളും പാരാമീറ്ററുകളും (& ചിഹ്നങ്ങളും) ബ്രേക്ക് ആവാതിരിക്കാൻ encodeURIComponent ഉപയോഗിച്ച് എൻകോഡ് ചെയ്യുന്നു
  const encodedUrl = encodeURIComponent(directUrl);
  const encodedReferer = encodeURIComponent(referer);
  return `${origin.replace(/\/$/, "")}/api/proxy?url=${encodedUrl}&referer=${encodedReferer}`;
}

export function buildVlcCommand(directUrl: string, referer: string, origin: string): string {
  return `vlc --http-referrer ${shellQuote(referer)} ${shellQuote(buildProxyUrl(directUrl, referer, origin))}`;
}

export function buildMpvCommand(directUrl: string, referer: string, origin: string, title?: string): string {
  const parts = title
    ? [`mpv --force-media-title=${shellQuote(title)}`, `--referrer=${shellQuote(referer)}`, shellQuote(buildProxyUrl(directUrl, referer, origin))]
    : [`mpv --referrer=${shellQuote(referer)}`, shellQuote(buildProxyUrl(directUrl, referer, origin))];
  return parts.join(" ");
}
