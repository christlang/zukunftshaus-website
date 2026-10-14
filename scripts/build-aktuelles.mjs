// Erzeugt die Aktuelles-Inhalte aus content/aktuelles/*.md als statisches HTML.
// Jede Nachricht liegt in einer eigenen Markdown-Datei JJJJ-MM-TT-<id>.md mit
// title und teaser im Frontmatter; Datum und id werden aus dem Dateinamen gelesen.
// Ersetzt den Bereich zwischen <!-- AKTUELLES:<name>:START --> und
// <!-- AKTUELLES:<name>:END --> in den Seiten unter site/.
//
// Aufruf: node scripts/build-aktuelles.mjs

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTIT_COUNT = 4;

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'];

function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day}. ${MONTHS[month - 1]} ${year}`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CONTENT_DIR = 'content/aktuelles';
const FILENAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/;

// Liest den Frontmatter-Block (--- key: value ---) am Anfang der Datei.
function parseFrontmatter(file, source) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source.replace(/\r\n/g, '\n'));
  if (!match) {
    throw new Error(`${file}: Frontmatter (--- ... ---) am Dateianfang fehlt`);
  }
  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const colon = line.indexOf(':');
    if (colon === -1) {
      throw new Error(`${file}: Frontmatter-Zeile "${line}" hat kein "key: value"-Format`);
    }
    data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return { data, body: match[2].trim() };
}

// Minimales Markdown: Absätze, Listen (- / *), **fett**, *kursiv*, [Links](url).
// Inline-HTML wird unverändert übernommen.
function renderInline(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderMarkdown(markdown) {
  return markdown.split(/\n\s*\n/).map(block => {
    const lines = block.split('\n').map(line => line.trim());
    if (lines.every(line => /^[-*] /.test(line))) {
      const items = lines.map(line => `\n            <li>${renderInline(line.slice(2))}</li>`).join('');
      return `\n          <ul>${items}\n          </ul>`;
    }
    return `\n          <p>${renderInline(lines.join(' '))}</p>`;
  }).join('');
}

function loadEntries() {
  const ids = new Set();
  return readdirSync(join(root, CONTENT_DIR))
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const path = `${CONTENT_DIR}/${file}`;
      const match = FILENAME.exec(file);
      if (!match) {
        throw new Error(`${path}: Dateiname muss JJJJ-MM-TT-<id>.md sein (id nur a-z, 0-9 und -)`);
      }
      const [, date, id] = match;
      if (ids.has(id)) {
        throw new Error(`${path}: id "${id}" ist doppelt vergeben`);
      }
      ids.add(id);
      const { data, body } = parseFrontmatter(path, readFileSync(join(root, path), 'utf8'));
      for (const field of ['title', 'teaser']) {
        if (!data[field]) {
          throw new Error(`${path}: Feld "${field}" im Frontmatter fehlt`);
        }
      }
      if (!body) {
        throw new Error(`${path}: Text fehlt`);
      }
      return { id, date, title: data.title, teaser: data.teaser, body };
    });
}

// Titel und Teaser sind reiner Text, der Text ist Markdown (Inline-HTML erlaubt).
function renderPostit(entry) {
  return `
        <a class="postit" href="aktuelles.html#${entry.id}">
          <time datetime="${entry.date}">${formatDate(entry.date)}</time>
          <h3>${escapeHtml(entry.title)}</h3>
          <p>${escapeHtml(entry.teaser)}</p>
          <span class="postit-more">Weiterlesen &rarr;</span>
        </a>`;
}

function renderArticle(entry) {
  return `
        <article class="news-entry" id="${entry.id}">
          <time datetime="${entry.date}">${formatDate(entry.date)}</time>
          <h2>${escapeHtml(entry.title)}</h2>${renderMarkdown(entry.body)}
        </article>`;
}

function replaceBlock(file, name, html) {
  const path = join(root, file);
  const source = readFileSync(path, 'utf8');
  const pattern = new RegExp(
    `(<!-- AKTUELLES:${name}:START -->)[\\s\\S]*?(\\n[ \\t]*<!-- AKTUELLES:${name}:END -->)`);
  if (!pattern.test(source)) {
    throw new Error(`${file}: Marker AKTUELLES:${name}:START/END nicht gefunden`);
  }
  const result = source.replace(pattern, (_, start, end) => start + html + end);
  if (result !== source) {
    writeFileSync(path, result);
    console.log(`${file} aktualisiert`);
  } else {
    console.log(`${file} unverändert`);
  }
}

const entries = loadEntries();
entries.sort((a, b) => b.date.localeCompare(a.date));

replaceBlock('site/index.html', 'POSTITS', entries.slice(0, POSTIT_COUNT).map(renderPostit).join(''));
replaceBlock('site/aktuelles.html', 'LISTE', entries.map(renderArticle).join(''));
