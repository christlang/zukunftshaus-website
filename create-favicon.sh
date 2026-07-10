#!/bin/bash
# Script zum Erstellen des Favicons aus dem Logo
# Benötigt: ImageMagick
# Führt aus: ./create-favicon.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/site/images"
LOGO="$IMAGES_DIR/logo.png"

if [ ! -f "$LOGO" ]; then
  echo "Fehler: Logo nicht gefunden: $LOGO"
  exit 1
fi

echo "Erstelle Favicon aus Logo..."

# Favicon für Browser (16x16 und 32x32 kombiniert in .ico)
magick "$LOGO" -resize 16x16 -background transparent -gravity center -extent 16x16 "$IMAGES_DIR/favicon-16.png"
magick "$LOGO" -resize 32x32 -background transparent -gravity center -extent 32x32 "$IMAGES_DIR/favicon-32.png"
magick "$IMAGES_DIR/favicon-16.png" "$IMAGES_DIR/favicon-32.png" "$IMAGES_DIR/favicon.ico"
rm "$IMAGES_DIR/favicon-16.png" "$IMAGES_DIR/favicon-32.png"

# Apple Touch Icon (180x180)
magick "$LOGO" -resize 180x180 -background transparent -gravity center -extent 180x180 "$IMAGES_DIR/apple-touch-icon.png"

echo "Fertig!"
echo "  - $IMAGES_DIR/favicon.ico"
echo "  - $IMAGES_DIR/apple-touch-icon.png"
