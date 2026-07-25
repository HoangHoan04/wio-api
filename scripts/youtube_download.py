#!/usr/bin/env python3
"""
YouTube audio downloader using yt-dlp.
Can be used standalone or invoked by the NestJS PythonYtDlpProvider.

Usage:
    python youtube_download.py --url "https://www.youtube.com/watch?v=..." --output "/path/to/file"
    python youtube_download.py --url "..." --info-only

Output (stdout) is JSON.
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
import urllib.parse

# Force UTF-8 output on Windows (avoids charmap encoding errors for non-ASCII titles)
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')


def parse_args():
    parser = argparse.ArgumentParser(description="Download YouTube audio")
    parser.add_argument("--url", required=True, help="YouTube URL")
    parser.add_argument("--output", help="Output file path (without extension)")
    parser.add_argument("--format", default="mp3", help="Audio format: mp3, m4a, bestaudio")
    parser.add_argument("--info-only", action="store_true", help="Only return metadata")
    parser.add_argument("--max-duration", type=int, default=600, help="Max duration in seconds")
    return parser.parse_args()


def format_duration(seconds: int) -> str:
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes}:{secs:02d}"


def normalize_youtube_url(url: str) -> str:
    """Strip playlist/list params — only keep the video ID to avoid yt-dlp scanning whole playlists."""
    try:
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qs(parsed.query)
        video_id = params.get('v', [None])[0]
        if video_id:
            # Return clean single-video URL
            return f"https://www.youtube.com/watch?v={video_id}"
        # For youtu.be short links, just strip query params
        if 'youtu.be' in parsed.netloc:
            path = parsed.path.lstrip('/')
            return f"https://www.youtube.com/watch?v={path}"
    except Exception:
        pass
    return url


def extract_info(ydl, url: str):
    info = ydl.extract_info(url, download=False)
    if info is None:
        raise ValueError("Could not extract video info")
    if "entries" in info:
        info = info["entries"][0]
    return info


def main():
    args = parse_args()
    # Normalize URL to strip playlist params (prevents yt-dlp from scanning full playlists)
    clean_url = normalize_youtube_url(args.url)
    if clean_url != args.url:
        print(f"[normalize] Stripped playlist params: {args.url} -> {clean_url}", file=sys.stderr)
    args.url = clean_url

    try:
        import yt_dlp
    except ImportError:
        print(
            json.dumps(
                {
                    "success": False,
                    "error": "yt-dlp is not installed. Run: pip install -r scripts/requirements.txt",
                }
            )
        )
        sys.exit(1)

    try:
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "format": "bestaudio/best",
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = extract_info(ydl, args.url)

            duration = int(info.get("duration", 0) or 0)
            if duration > args.max_duration:
                print(
                    json.dumps(
                        {
                            "success": False,
                            "error": f"Video too long ({format_duration(duration)}), max {args.max_duration // 60} minutes",
                        }
                    )
                )
                sys.exit(1)

            metadata = {
                "id": info.get("id", ""),
                "title": info.get("title", "Unknown Title"),
                "author": info.get("uploader") or info.get("channel", "Unknown Author"),
                "durationSeconds": duration,
                "durationText": format_duration(duration),
                "thumbnail": info.get("thumbnail", ""),
                "youtubeUrl": args.url,
            }

            if args.info_only:
                print(json.dumps({"success": True, "info": metadata}, ensure_ascii=False))
                sys.exit(0)

            if not args.output:
                print(
                    json.dumps(
                        {"success": False, "error": "--output is required when not using --info-only"}
                    )
                )
                sys.exit(1)

            # Download best audio WITHOUT ffmpeg conversion
            # (ffmpeg may not be available on all machines)
            download_opts = {
                "quiet": False,   # show progress to stderr
                "no_warnings": False,
                "format": "bestaudio/best",
                "outtmpl": f"{args.output}.%(ext)s",
                # No postprocessors — avoids ffmpeg dependency
            }

            with yt_dlp.YoutubeDL(download_opts) as ydl2:
                ydl2.download([args.url])

            # Find the downloaded file (yt-dlp picks the extension)
            import glob
            downloaded = glob.glob(f"{args.output}.*")
            if not downloaded:
                raise FileNotFoundError(f"No file found at {args.output}.*")
            output_path = downloaded[0]
            ext = os.path.splitext(output_path)[1].lstrip(".")

            # Determine mime type from extension
            mime_map = {
                "webm": "audio/webm",
                "m4a": "audio/mp4",
                "mp4": "audio/mp4",
                "ogg": "audio/ogg",
                "opus": "audio/opus",
                "mp3": "audio/mpeg",
                "aac": "audio/aac",
            }
            mime_type = mime_map.get(ext, "audio/webm")

            print(
                json.dumps(
                    {
                        "success": True,
                        "info": metadata,
                        "filePath": output_path,
                        "mimeType": mime_type,
                    },
                    ensure_ascii=False,
                )
            )

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
