#!/bin/bash
# Script zum Erstellen einer schlanken Logo-Variante fürs Web (Header/Footer)
# Das Original (logo.png) ist 1024x1024px und ~1,4 MB - deutlich größer als
# nötig, da das Logo im Header/Footer nur mit 50-60px Höhe angezeigt wird.
# logo-small.png ist auf diese Anzeigegröße (inkl. Retina/Mobile) zugeschnitten
# und stark komprimiert.
# Benötigt: ImageMagick, pngquant
# Führt aus: ./scripts/create-logo-small.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/../site/images"
LOGO="$IMAGES_DIR/logo.png"
SMALL_LOGO="$IMAGES_DIR/logo-small.png"

if [ ! -f "$LOGO" ]; then
  echo "Fehler: Logo nicht gefunden: $LOGO"
  exit 1
fi

echo "Erstelle mobil-optimierte Logo-Variante..."

# 200x200: reicht für die im CSS genutzte Anzeigegröße von 50-60px
# selbst bei 3x-Displays (Retina/Mobile) noch mit Reserve.
magick "$LOGO" -resize 200x200 -background transparent -gravity center -extent 200x200 "$SMALL_LOGO"
pngquant --force --quality=65-90 --strip --output "$SMALL_LOGO" "$SMALL_LOGO"

echo "Fertig! $(du -h "$SMALL_LOGO" | cut -f1) -> $SMALL_LOGO"
