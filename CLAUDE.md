# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for "Zukunftshaus Karlsruhe" - a housing cooperative (Baugruppe) building community-oriented, affordable housing in the Quartier Zukunft Nord district of Karlsruhe, Germany.

## Development

This is a simple static HTML/CSS website without dependencies. The only build step is `npm run build` (`scripts/build-aktuelles.mjs`), which renders `content/aktuelles.json` into `site/aktuelles.html` and the post-its in `site/index.html` between `<!-- AKTUELLES:...:START/END -->` markers. Never edit content between these markers by hand; generated output is committed. To develop:

- Open `index.html` directly in a browser, or
- Use any local server (e.g., `python -m http.server 8000`)

## Architecture

**Files:**
- `aktuelles.html` - News page (generated from `content/aktuelles.json`)
- `index.html` - Main landing page with all sections (hero, status timeline, about, project details, join options, contact)
- `impressum.html` - Legal notice page (German Impressum requirement)
- `css/style.css` - All styling using CSS custom properties
- `images/` - Logo and other assets

**Styling approach:**
- CSS custom properties defined in `:root` for colors, spacing, typography
- Color palette derived from logo: primary green (#5B8A4E), accent colors (red, yellow, blue)
- Mobile-first responsive design with breakpoints at 768px and 1024px
- No CSS preprocessor or framework

**JavaScript:**
- Minimal vanilla JS embedded in HTML files
- Mobile navigation toggle
- Header scroll effect

## Content Notes

- Website is in German
- Timeline in status section tracks project phases (Ausschreibung → Auswahlphase → Optionsphase → Vollzugsphase → Bauphase)
- Image placeholders exist for: hero background, group photo, architecture visualization
