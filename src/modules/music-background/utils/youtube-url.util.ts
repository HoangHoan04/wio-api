/**
 * Utility xử lý URL YouTube:
 *  - normalizeYoutubeUrl: chuẩn hoá mọi URL YouTube về dạng canonical
 *  - extractYoutubeVideoId: trích videoId từ URL (chuẩn hoặc không)
 *  - isYoutubeUrl: kiểm tra URL có phải YouTube không
 *
 * Không throw — luôn trả về string (URL) hoặc null (videoId).
 */

/* ============================================================
 * CONSTANTS
 * ============================================================ */
const YOUTUBE_VIDEO_ID_LENGTH = 11;
const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const VIDEO_PATH_MARKERS = ['embed', 'v', 'shorts', 'live', 'e'] as const;

const YOUTUBE_HOSTS = [
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'yt.be',
] as const;

/* ============================================================
 * HELPERS
 * ============================================================ */
function normalizeHost(hostname: string): string {
  return hostname
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/^m\./, '')
    .replace(/^music\./, '');
}

function isYoutubeHost(host: string): boolean {
  return YOUTUBE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

function isValidVideoId(id: string | null | undefined): id is string {
  if (!id) return false;
  if (id.length !== YOUTUBE_VIDEO_ID_LENGTH) return false;
  return YOUTUBE_VIDEO_ID_REGEX.test(id);
}

function buildCanonicalUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/* ============================================================
 * EXTRACT
 * ============================================================ */
export function extractYoutubeVideoId(raw: string): string | null {
  const input = String(raw ?? '').trim();
  if (!input) return null;

  let parsed: URL;
  try {
    const urlWithScheme = /^https?:\/\//i.test(input)
      ? input
      : `https://${input}`;
    parsed = new URL(urlWithScheme);
  } catch {
    return null;
  }

  const host = normalizeHost(parsed.hostname);
  if (!isYoutubeHost(host)) return null;

  // youtu.be/{id}, yt.be/{id}
  if (host === 'youtu.be' || host === 'yt.be') {
    const id = parsed.pathname.split('/').filter(Boolean)[0];
    return isValidVideoId(id) ? id : null;
  }

  // youtube.com/watch?v={id}
  const fromQuery = parsed.searchParams.get('v');
  if (isValidVideoId(fromQuery)) return fromQuery;

  // youtube.com/{embed|v|shorts|live|e}/{id}
  const segments = parsed.pathname.split('/').filter(Boolean);
  for (const marker of VIDEO_PATH_MARKERS) {
    const idx = segments.indexOf(marker);
    if (idx >= 0) {
      const candidate = segments[idx + 1];
      if (isValidVideoId(candidate)) return candidate;
    }
  }

  return null;
}

/* ============================================================
 * NORMALIZE
 * ============================================================ */
export function normalizeYoutubeUrl(raw: string): string {
  const input = String(raw ?? '').trim();
  if (!input) return input;

  const videoId = extractYoutubeVideoId(input);
  if (videoId) return buildCanonicalUrl(videoId);

  return /^https?:\/\//i.test(input) ? input : `https://${input}`;
}

/* ============================================================
 * VALIDATE
 * ============================================================ */
export function isYoutubeUrl(raw: string): boolean {
  return extractYoutubeVideoId(raw) !== null;
}
