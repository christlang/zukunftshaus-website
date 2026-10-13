// Erzeugt die Aktuelles-Inhalte aus content/aktuelles.json als statisches HTML.
// Ersetzt den Bereich zwischen <!-- AKTUELLES:<name>:START --> und
// <!-- AKTUELLES:<name>:END --> in den Seiten unter site/.
//
// Aufruf: node scripts/build-aktuelles.mjs

import { readFileSync, writeFileSync } from 'node:fs';
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

function validate(entries) {
  const ids = new Set();
  for (const entry of entries) {
    for (const field of ['id', 'date', 'title', 'teaser', 'body']) {
      if (!entry[field]) {
        throw new Error(`Eintrag ${JSON.stringify(entry.id ?? entry.title)}: Feld "${field}" fehlt`);
      }
    }
    if (!/^[a-z0-9-]+$/.test(entry.id)) {
      throw new Error(`Eintrag "${entry.id}": id darf nur a-z, 0-9 und - enthalten`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
      throw new Error(`Eintrag "${entry.id}": date muss im Format JJJJ-MM-TT sein`);
    }
    if (ids.has(entry.id)) {
      throw new Error(`Eintrag "${entry.id}": id ist doppelt vergeben`);
    }
    ids.add(entry.id);
  }
}

// Titel und Teaser sind reiner Text, body-Absätze dürfen HTML (z. B. Links) enthalten.
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
  const paragraphs = entry.body.map(p => `\n          <p>${p}</p>`).join('');
  return `
        <article class="news-entry" id="${entry.id}">
          <time datetime="${entry.date}">${formatDate(entry.date)}</time>
          <h2>${escapeHtml(entry.title)}</h2>${paragraphs}
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

const entries = JSON.parse(readFileSync(join(root, 'content/aktuelles.json'), 'utf8'));
validate(entries);
entries.sort((a, b) => b.date.localeCompare(a.date));

replaceBlock('site/index.html', 'POSTITS', entries.slice(0, POSTIT_COUNT).map(renderPostit).join(''));
replaceBlock('site/aktuelles.html', 'LISTE', entries.map(renderArticle).join(''));
