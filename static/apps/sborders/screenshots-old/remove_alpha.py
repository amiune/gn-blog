#!/usr/bin/env -S uv run
# /// script
# dependencies = [
#   "pillow",
# ]
# ///

"""Remove alpha from all raster images in the current directory (in-place).

Transparent pixels are composited onto white. Do not use pip; use uv.

From this folder, preferred (isolated Python + Pillow via uvx):

    uv run --with pillow remove_alpha.py

Other options:

    uv run remove_alpha.py              # uses inline script metadata (above)
    ./remove_alpha.py                   # same, via shebang
    uv run --no-project --with pillow remove_alpha.py   # explicit dep, no metadata
"""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path

IMAGE_EXTS = frozenset({".png", ".webp", ".gif", ".tif", ".tiff", ".bmp"})


def _has_alpha(im) -> bool:
    if im.mode in ("RGBA", "LA", "PA"):
        return True
    if im.mode == "P" and "transparency" in im.info:
        return True
    return False


def _flatten(im):
    from PIL import Image

    rgba = im.convert("RGBA")
    bg = Image.new("RGB", rgba.size, (255, 255, 255))
    bg.paste(rgba, mask=rgba.split()[3])
    return bg


def _save_kwargs(path: Path) -> dict:
    ext = path.suffix.lower()
    if ext == ".png":
        return {"optimize": True}
    if ext in (".jpg", ".jpeg"):
        return {"quality": 95}
    if ext == ".webp":
        return {"quality": 95, "method": 6}
    return {}


def process_file(path: Path) -> bool:
    from PIL import Image

    img = Image.open(path)
    try:
        img.load()
        if getattr(img, "n_frames", 1) > 1:
            print(f"skip (animated): {path.name}", file=sys.stderr)
            return False
        if not _has_alpha(img):
            return False
        out = _flatten(img)
    finally:
        img.close()

    fd, tmp_name = tempfile.mkstemp(suffix=path.suffix, dir=path.parent)
    import os

    os.close(fd)
    tmp_path = Path(tmp_name)
    try:
        out.save(tmp_path, **_save_kwargs(path))
        os.replace(tmp_path, path)
    except Exception:
        tmp_path.unlink(missing_ok=True)
        raise
    print(path.name)
    return True


def main() -> int:
    try:
        import PIL  # noqa: F401
    except ImportError:
        print(
            "Pillow is required. Prefer: uvx --with pillow python remove_alpha.py  "
            "or: uv run remove_alpha.py",
            file=sys.stderr,
        )
        return 1

    cwd = Path.cwd()
    n = 0
    for path in sorted(cwd.iterdir()):
        if not path.is_file() or path.name.startswith("."):
            continue
        if path.suffix.lower() not in IMAGE_EXTS:
            continue
        try:
            if process_file(path):
                n += 1
        except OSError as e:
            print(f"{path.name}: {e}", file=sys.stderr)
    if n == 0:
        print("No images with alpha updated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
