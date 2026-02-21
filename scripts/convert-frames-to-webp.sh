#!/bin/bash
# Convert PNG frames to WebP for ~60-70% file size reduction.
# Requires: cwebp (install via `brew install webp` on macOS or `apt install webp` on Linux)
#
# Usage:
#   chmod +x scripts/convert-frames-to-webp.sh
#   ./scripts/convert-frames-to-webp.sh
#
# After conversion, update hero.tsx:
#   Change:  return `/frames/${String(index + 1).padStart(3, "0")}.png`;
#   To:      return `/frames/${String(index + 1).padStart(3, "0")}.webp`;

FRAMES_DIR="public/frames"
QUALITY=80  # 80 is a good balance between size and quality for animation frames

if ! command -v cwebp &> /dev/null; then
  echo "Error: cwebp not found. Install with: brew install webp (macOS) or apt install webp (Linux)"
  exit 1
fi

echo "Converting PNG frames to WebP (quality=$QUALITY)..."

converted=0
for png in "$FRAMES_DIR"/*.png; do
  filename=$(basename "$png" .png)
  webp="$FRAMES_DIR/$filename.webp"
  
  if [ -f "$webp" ]; then
    echo "  Skipping $filename (already exists)"
    continue
  fi

  cwebp -q "$QUALITY" -m 4 "$png" -o "$webp" -quiet
  converted=$((converted + 1))
  echo "  Converted $filename.png → $filename.webp"
done

echo ""
echo "Done! Converted $converted frames."
echo ""

# Show size comparison
png_size=$(du -sh "$FRAMES_DIR"/*.png 2>/dev/null | tail -1 | awk '{print $1}')
webp_total=$(du -c "$FRAMES_DIR"/*.webp 2>/dev/null | tail -1 | awk '{print $1}')
png_total=$(du -c "$FRAMES_DIR"/*.png 2>/dev/null | tail -1 | awk '{print $1}')

echo "PNG total:  $(du -sh "$FRAMES_DIR"/*.png | tail -1 | awk '{print $1}') (approx)"
echo "WebP total: $(echo "scale=1; $webp_total/1024" | bc)M"
echo ""
echo "Next steps:"
echo "  1. Update hero.tsx to use .webp extension"
echo "  2. Test the site"
echo "  3. Optionally delete the .png files: rm $FRAMES_DIR/*.png"
