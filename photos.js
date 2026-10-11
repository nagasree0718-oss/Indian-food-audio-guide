// Real food photographs from Wikipedia / Wikimedia Commons (free, no API key).
// - getIndex():   one main photo per dish (cached in photo-cache.json)
// - getGallery(): main photo + more photos from the dish's Wikipedia article
// You can override any dish by dropping your own file in public/images/, e.g. idli.jpg
const fs = require('fs');
const path = require('path');
const FOODS = require('./public/foods.js');

const CACHE_FILE = path.join(__dirname, 'photo-cache.json');
const HEADERS = { 'User-Agent': 'SwaadAudio/1.0 (student project)', Accept: 'application/json' };
const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let cache = {};
try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch (_) {}
const save = () => { try { fs.writeFileSync(CACHE_FILE, JSON.stringify(cache)); } catch (_) {} };
const missed = new Set(); // dishes that failed this session (do not hammer Wikipedia)

async function getJson(url) {
  try {
    const r = await fetch(url, { headers: HEADERS });
    return r.ok ? await r.json() : null;
  } catch (_) { return null; }
}

const summary = t =>
  getJson('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(t.replace(/ /g, '_')));

// choose a sharp but safe thumbnail size (never bigger than the original)
function sharp(s) {
  const thumb = s.thumbnail && s.thumbnail.source;
  const w = (s.originalimage && s.originalimage.width) || 0;
  const size = [960, 500, 330, 250].find(x => x <= w);
  if (thumb && size && thumb.includes('/thumb/')) return thumb.replace(/\/\d+px-/, `/${size}px-`);
  return thumb || (s.originalimage && s.originalimage.source) || null;
}

function localPhoto(name) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (fs.existsSync(path.join(__dirname, 'public', 'images', `${slug(name)}.${ext}`)))
      return `/images/${slug(name)}.${ext}`;
  }
  return null;
}

async function findMain(food) {
  let s = await summary(food.w || food.n);
  if (!s || (!s.thumbnail && !s.originalimage)) {
    const q = encodeURIComponent((food.w || food.n) + ' Indian dish');
    const found = await getJson(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=1&format=json`);
    const title = found && found.query && found.query.search && found.query.search[0] && found.query.search[0].title;
    if (title) s = await summary(title);
  }
  const url = s && sharp(s);
  if (!url) return null;
  return { url, title: s.title, page: s.content_urls && s.content_urls.desktop && s.content_urls.desktop.page };
}

async function getMain(food) {
  const local = localPhoto(food.n);
  if (local) return { url: local, title: food.n, page: null };
  const key = 'main:' + food.n;
  if (cache[key]) return cache[key];
  if (missed.has(food.n)) return null;
  const m = await findMain(food);
  if (m) { cache[key] = m; save(); } else missed.add(food.n);
  return m;
}

async function getIndex() {
  const out = {};
  for (let i = 0; i < FOODS.length; i += 6) {            // 6 at a time, polite to Wikipedia
    const chunk = FOODS.slice(i, i + 6);
    const res = await Promise.all(chunk.map(f => getMain(f)));
    chunk.forEach((f, k) => { if (res[k]) out[f.n] = { url: res[k].url, page: res[k].page }; });
  }
  return out;
}

async function getGallery(name) {
  const food = FOODS.find(f => f.n === name);
  if (!food) return { main: null, gallery: [] };
  const key = 'gal:' + name;
  if (cache[key]) return cache[key];

  const main = await getMain(food);
  const result = { main: main && main.url, page: main && main.page, gallery: [] };
  if (main && main.title) {
    const media = await getJson('https://en.wikipedia.org/api/rest_v1/page/media-list/' + encodeURIComponent(main.title.replace(/ /g, '_')));
    const items = (media && media.items) || [];
    const bad = /(icon|logo|flag|map|symbol|stub|commons|wiki|edit|question|disambig|portrait)/i;
    for (const it of items) {
      if (it.type !== 'image' || it.showInGallery === false) continue;
      const mime = (it.original && it.original.mime) || '';
      if (!/jpeg|png|webp/.test(mime) || bad.test(it.title || '')) continue;
      const set = it.srcset || [];
      const src = set.length ? set[set.length - 1].src : null;
      if (!src) continue;
      result.gallery.push({
        src: src.startsWith('//') ? 'https:' + src : src,
        caption: ((it.caption && it.caption.text) || '').slice(0, 140)
      });
      if (result.gallery.length >= 8) break;
    }
  }
  if (result.main && result.gallery.length) { cache[key] = result; save(); }
  return result;
}

module.exports = { getIndex, getGallery };
