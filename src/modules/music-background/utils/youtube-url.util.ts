export function normalizeYoutubeUrl(raw: string): string {
  const input = String(raw ?? '').trim();
  if (!input) return input;

  let url = input;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname
      .toLowerCase()
      .replace(/^www\./, '')
      .replace(/^m\./, '')
      .replace(/^music\./, '');

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0];
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery) {
        return `https://www.youtube.com/watch?v=${fromQuery}`;
      }

      const segments = parsed.pathname.split('/').filter(Boolean);
      const markerIndex = segments.findIndex((segment) =>
        ['embed', 'v', 'shorts', 'live'].includes(segment),
      );
      if (markerIndex >= 0 && segments[markerIndex + 1]) {
        return `https://www.youtube.com/watch?v=${segments[markerIndex + 1]}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}

export function extractYoutubeVideoId(url: string): string | null {
  const normalized = normalizeYoutubeUrl(url);
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}
