#!/bin/bash
# Script zum Umwandeln eines Bildes (jpg, png, ...) in WebP fürs Web
# Das Bild wird auf eine maximale Breite verkleinert (nur verkleinert, nie
# vergrößert), korrekt gedreht (EXIF-Orientierung), von Metadaten befreit und
# als WebP gespeichert. Die WebP-Datei landet neben dem Original.
# Benötigt: ImageMagick
# Führt aus: ./scripts/convert-to-webp.sh <bild> [max-breite] [qualität]
# Beispiel:  ./scripts/convert-to-webp.sh site/images/foto.jpg 800 80

set -e

INPUT="$1"
MAX_WIDTH="${2:-800}"
QUALITY="${3:-80}"

if [ -z "$INPUT" ]; then
  echo "Aufruf: $0 <bild> [max-breite (Standard: 800)] [qualität (Standard: 80)]"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Fehler: Bild nicht gefunden: $INPUT"
  exit 1
fi

OUTPUT="${INPUT%.*}.webp"

if [ "$INPUT" = "$OUTPUT" ]; then
  echo "Fehler: Bild ist bereits WebP: $INPUT"
  exit 1
fi

echo "Wandle $INPUT in WebP um (max. ${MAX_WIDTH}px breit, Qualität $QUALITY)..."

# "${MAX_WIDTH}x>" verkleinert nur, wenn das Bild breiter ist.
magick "$INPUT" -auto-orient -resize "${MAX_WIDTH}x>" -strip -quality "$QUALITY" "$OUTPUT"

echo "Fertig! $(du -h "$INPUT" | cut -f1) -> $(du -h "$OUTPUT" | cut -f1) -> $OUTPUT"
