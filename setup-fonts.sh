#!/bin/bash
# Script zum Herunterladen und Einrichten der lokalen Fonts
# Führt aus: ./setup-fonts.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FONTS_DIR="$SCRIPT_DIR/fonts"

echo "Erstelle fonts-Verzeichnis..."
mkdir -p "$FONTS_DIR"
cd "$FONTS_DIR"

# Inter Font
echo "Lade Inter Font herunter..."
curl -L -o inter.zip "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip"
unzip -o -q inter.zip -d inter-temp
mkdir -p inter
cp inter-temp/web/Inter-Light.woff2 inter/
cp inter-temp/web/Inter-Regular.woff2 inter/
cp inter-temp/web/Inter-Medium.woff2 inter/
cp inter-temp/web/Inter-SemiBold.woff2 inter/
cp inter-temp/web/Inter-Bold.woff2 inter/
rm -rf inter-temp inter.zip
echo "Inter Font installiert."

# Font Awesome (nur benötigte Dateien)
echo "Lade Font Awesome herunter..."
curl -L -o fontawesome.zip "https://use.fontawesome.com/releases/v6.5.1/fontawesome-free-6.5.1-web.zip"
unzip -o -q fontawesome.zip
mkdir -p fontawesome/css fontawesome/webfonts

# Nur solid Icons werden verwendet - minimales CSS und Webfonts kopieren
cp fontawesome-free-6.5.1-web/css/fontawesome.min.css fontawesome/css/
cp fontawesome-free-6.5.1-web/css/solid.min.css fontawesome/css/
cp fontawesome-free-6.5.1-web/webfonts/fa-solid-900.woff2 fontawesome/webfonts/
cp fontawesome-free-6.5.1-web/webfonts/fa-solid-900.ttf fontawesome/webfonts/

# Aufräumen
rm -rf fontawesome-free-6.5.1-web fontawesome.zip
echo "Font Awesome installiert (nur solid Icons)."

echo ""
echo "Fertig! Fonts wurden nach $FONTS_DIR installiert."
