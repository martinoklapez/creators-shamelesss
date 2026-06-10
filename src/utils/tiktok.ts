export interface ParsedTikTok {
  id: string;
  username: string;
  tiktokUrl: string;
  playerUrl: string;
}

export function parseTikTokUrl(url: string): ParsedTikTok | null {
  const idMatch = url.match(/\/(video|photo)\/(\d+)/);
  if (!idMatch) return null;

  const usernameMatch = url.match(/@([^/]+)/);
  const username = usernameMatch ? usernameMatch[1] : "creator";
  const id = idMatch[2];

  return {
    id,
    username,
    tiktokUrl: `https://www.tiktok.com/@${username}/video/${id}`,
    playerUrl: `https://www.tiktok.com/player/v1/${id}?music_info=0&description=0`,
  };
}
