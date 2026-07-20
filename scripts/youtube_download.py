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


def extract_info(ydl, url: str):
    info = ydl.extract_info(url, download=False)
    if info is None:
        raise ValueError("Could not extract video info")
    if "entries" in info:
        info = info["entries"][0]
    return info


def main():
    args = parse_args()

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

            ext = args.format if args.format != "bestaudio" else "webm"
            # Sanitize extension
            ext = re.sub(r"[^a-zA-Z0-9]", "", ext) or "mp3"
            output_path = f"{args.output}.{ext}"

            # Download and convert if needed
            download_opts = {
                "quiet": True,
                "no_warnings": True,
                "format": "bestaudio/best",
                "outtmpl": output_path,
                "postprocessors": [],
            }

            if args.format == "mp3":
                download_opts["postprocessors"].append(
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                )
                output_path = f"{args.output}.mp3"
            elif args.format == "m4a":
                download_opts["postprocessors"].append(
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "m4a",
                        "preferredquality": "192",
                    }
                )
                output_path = f"{args.output}.m4a"

            with yt_dlp.YoutubeDL(download_opts) as ydl2:
                ydl2.download([args.url])

            mime_type = "audio/mpeg"
            if args.format == "m4a":
                mime_type = "audio/mp4"
            elif args.format == "webm" or args.format == "bestaudio":
                mime_type = "audio/webm"

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
