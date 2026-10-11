// Swaad Audio – backend
// Keeps API keys on the server. Every dish works even when Gemini's free quota is used up:
//   1. Gemini-written text is used when available and saved to disk (content-cache.json).
//   2. Otherwise the built-in notes below are used, so no dish ever shows an error.
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { getIndex, getGallery } = require('./photos');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MURF_KEY = process.env.MURF_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const PORT = process.env.PORT || 3000;

if (!GEMINI_KEY || !MURF_KEY) {
  console.warn('⚠  Missing GEMINI_API_KEY or MURF_API_KEY in .env (the file must be named exactly .env).');
}

/* ================= built-in notes (always available) ================= */

const KB = require('./public/notes.js');   // built-in notes (also loaded by the browser)

/* ================= storage for Gemini results ================= */

const STORE_FILE = path.join(__dirname, 'content-cache.json');
let store = { info: {}, script: {} };
try { store = Object.assign(store, JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'))); } catch (_) {}
const saveStore = () => { try { fs.writeFileSync(STORE_FILE, JSON.stringify(store)); } catch (_) {} };

/* ================= Gemini (retries, backup model, quota breaker) ================= */

const sleep = ms => new Promise(r => setTimeout(r, ms));
const MODELS = [GEMINI_MODEL, 'gemini-flash-lite-latest'].filter((m, i, a) => m && a.indexOf(m) === i);
let geminiDownUntil = 0;                // when Gemini says "quota used up" we stop asking for a while

async function gemini(prompt, { json = false, fast = false } = {}) {
  if (!GEMINI_KEY) throw new Error('No GEMINI_API_KEY set.');
  if (Date.now() < geminiDownUntil) throw new Error('Gemini is cooling down after a quota limit.');

  let quotaHits = 0, busyHits = 0, daily = false, lastError = null;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < (fast ? 1 : 3); attempt++) {
      let res;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: json ? { responseMimeType: 'application/json', temperature: 0.6 } : { temperature: 0.7 }
          })
        });
      } catch (e) { lastError = e; await sleep(1000); continue; }

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
        if (text) return text;
        lastError = new Error('Gemini returned an empty answer.');
        continue;
      }
      const body = (await res.text()).slice(0, 400);
      lastError = new Error(`Gemini ${res.status} (${model}): ${body}`);
      if (res.status === 429) { quotaHits++; if (/PerDay|per day/i.test(body)) daily = true; break; }  // try next model
      if (res.status === 404) break;                                                                    // model name gone
      if ([500, 502, 503, 504].includes(res.status)) { busyHits++; if (!fast) await sleep(1500 * (attempt + 1)); continue; }  // busy: retry
      throw lastError;                                                                                  // bad key etc.
    }
  }
  if (quotaHits) geminiDownUntil = Date.now() + (daily ? 60 * 60 * 1000 : 65 * 1000);
  const err = lastError || new Error('Gemini unavailable.');
  err.kind = quotaHits && quotaHits >= busyHits ? 'quota' : (busyHits ? 'busy' : 'other');
  throw err;
}

/* ================= 1. Dish information ================= */

app.post('/api/food-info', async (req, res) => {
  const { name, region } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Food name is required.' });
  const key = name.toLowerCase();

  if (store.info[key]) return res.json({ ...store.info[key], source: 'gemini' });

  try {
    const prompt = `You are a careful Indian food historian and nutritionist.
Describe the dish "${name}" (${region || 'India'}). Be factual and honest; if the dish is unhealthy, say why and how to enjoy it more sensibly. Do not invent precise dates or people if unsure – say "believed to" instead.
Return ONLY JSON with this exact shape:
{
  "about": "3-4 sentences: what it is, main ingredients, how it is made and eaten",
  "history": "3-4 sentences on its origin and how it spread",
  "benefits": ["4 short bullet strings about nutritional benefits"],
  "watchOut": "2 sentences: health concerns or who should limit it, plus one tip to make it healthier",
  "funFact": "1 sentence"
}`;
    const raw = await gemini(prompt, { json: true, fast: !!KB[name] });
    const info = JSON.parse(raw.replace(/```json|```/g, '').trim());
    if (!info.about || !info.history) throw new Error('Incomplete answer from Gemini.');
    store.info[key] = info; saveStore();
    return res.json({ ...info, source: 'gemini' });
  } catch (e) {
    console.warn(`Gemini not used for "${name}": ${String(e.message).slice(0, 140)}`);
  }

  const kb = KB[name];
  if (kb) return res.json({ ...kb, source: 'builtin', notice: 'Showing built-in notes because Gemini is unavailable right now.' });
  res.status(503).json({ error: 'Gemini is unavailable right now and this dish has no built-in notes. Please try again in a minute.' });
});

/* ================= 1b. Real photographs (Wikipedia / Wikimedia Commons) ================= */

app.get('/api/photo-index', async (_req, res) => {
  try { res.json(await getIndex()); }
  catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.get('/api/photos', async (req, res) => {
  try { res.json(await getGallery(String(req.query.name || ''))); }
  catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

/* ================= 3. Narration script ================= */

function localScript(name, info, mode) {
  const list = (info.benefits || []).join('. ');
  let text;
  if (mode === 'quick') text = `${name}. ${info.about} One benefit: ${(info.benefits || [])[0] || ''}. ${info.watchOut}`;
  else if (mode === 'benefits') text = `${name}. Here are its benefits. ${list}. Good to know. ${info.watchOut}`;
  else text = `${name}. ${info.about} ${info.history} Here are its benefits. ${list}. Good to know. ${info.watchOut} ${info.funFact || ''}`;
  return text.replace(/\s+/g, ' ').trim().slice(0, 2900);
}

app.post('/api/narrate', async (req, res) => {
  const { name, info, languageName, mode } = req.body || {};
  if (!name || !info || !languageName) return res.status(400).json({ error: 'Missing fields.' });
  const m = ['full', 'benefits', 'quick'].includes(mode) ? mode : 'full';
  const key = `${name}|${languageName}|${m}`.toLowerCase();

  if (store.script[key]) return res.json({ script: store.script[key], source: 'gemini' });

  const parts = {
    full: { what: 'the full story: what it is, its history, its benefits and what to watch out for', words: 170 },
    benefits: { what: 'only its health benefits and what to watch out for', words: 110 },
    quick: { what: 'a quick friendly summary', words: 65 }
  }[m];

  let lastNarrateError = null;
  try {
    const prompt = `Write a spoken narration about the Indian dish "${name}" in ${languageName}.
Cover ${parts.what}. About ${parts.words} words.
Rules: it will be read aloud by a text-to-speech voice, so use plain flowing sentences – no markdown, no bullet points, no emojis, no brackets, no stage directions. Keep the dish name as people actually say it. Use ${languageName}'s natural script. Warm, clear, easy for a beginner.
Facts to use (English): ${JSON.stringify(info)}
Return only the narration text.`;
    const script = (await gemini(prompt)).replace(/[*#_`]/g, '').trim();
    store.script[key] = script; saveStore();
    return res.json({ script, source: 'gemini' });
  } catch (e) {
    lastNarrateError = e;
    console.warn(`Gemini narration skipped (${e.kind || 'error'}): ${String(e.message).slice(0, 140)}`);
  }

  if (/^english$/i.test(languageName)) {
    return res.json({ script: localScript(name, info, m), source: 'builtin' });
  }
  const why = lastNarrateError && lastNarrateError.kind === 'busy'
    ? `Google's Gemini servers are very busy right now, so the ${languageName} script could not be written. Nothing is wrong with your setup. Please press the button again in a few seconds, or choose English, which always works.`
    : `Gemini's free quota is used up for the moment, so ${languageName} narration is paused. English narration still works, or try again in about a minute.`;
  res.status(503).json({ error: why });
});
/* ================= 4. Audio with Murf Falcon (same method as the reference travel-guide project) ================= */

const FALCON_VOICES = {
  English: { Male: 'Matthew', Female: 'Alicia', locale: 'en-US' },
  Hindi:   { Male: 'Aman',    Female: 'Namrita', locale: 'hi-IN' },
  Tamil:   { Male: 'Murali',  Female: 'Iniya',   locale: 'ta-IN' },
  Telugu:  { Male: 'Zion',    Female: 'Josie',   locale: 'te-IN' }
};

app.get('/api/voices', (_req, res) => res.json(FALCON_VOICES));

function murfMessage(status, body) {
  const b = String(body || '').slice(0, 300);
  if (status === 401 || status === 403) return `Murf rejected the API key (${status}). Create a new key in the Murf API dashboard, put it in .env as MURF_API_KEY, and restart the server.`;
  if (status === 402 || /credit|quota|limit|plan/i.test(b)) return `Your Murf account has no credits or access for this voice (${status}). Check your plan in the Murf dashboard. ${b}`;
  if (status === 429) return 'Murf is receiving too many requests. Wait a few seconds and press the button again.';
  if (status >= 500) return `Murf is having a problem right now (${status}). Please try again in a moment.`;
  return `Murf could not create the audio (${status}). ${b}`;
}

app.post('/api/speak', async (req, res) => {
  try {
    const { text, language, gender } = req.body || {};
    const v = FALCON_VOICES[language];
    if (!text || !v) return res.status(400).json({ error: 'Choose English, Hindi, Tamil or Telugu and provide text.' });
    if (!MURF_KEY) return res.status(500).json({ error: 'MURF_API_KEY is missing. Add it to your .env file and restart the server.' });
    const voiceId = v[gender === 'Female' ? 'Female' : 'Male'];

    const r = await fetch('https://global.api.murf.ai/v1/speech/stream', {
      method: 'POST',
      headers: { 'api-key': MURF_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voice_id: voiceId,
        text: String(text).slice(0, 2900),
        locale: v.locale,
        model: 'FALCON',
        format: 'MP3',
        sampleRate: 24000,
        channelType: 'MONO'
      })
    });

    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.warn(`Murf error ${r.status}: ${body.slice(0, 200)}`);
      return res.status(502).json({ error: murfMessage(r.status, body) });
    }
    const audio = Buffer.from(await r.arrayBuffer());
    // Murf sometimes answers 200 with a JSON error instead of audio: catch that instead of sending silence
    const head = audio.slice(0, 1).toString();
    if (audio.length < 1000 || head === '{') {
      const body = audio.toString('utf8').slice(0, 300);
      console.warn(`Murf returned no audio: ${body}`);
      return res.status(502).json({ error: `Murf returned no audio. ${body}` });
    }
    res.json({ audioBase64: audio.toString('base64'), mime: 'audio/mpeg', voice: voiceId, seconds: null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not reach Murf: ' + e.message });
  }
});

app.get('/api/version', (_req, res) => res.json({ version: 4, audio: 'murf-falcon', builtInNotes: Object.keys(KB).length, geminiKeySet: !!GEMINI_KEY, murfKeySet: !!MURF_KEY }));

const server = app.listen(PORT, () => {
  console.log(`Swaad Audio v4 running → http://localhost:${PORT}`);
  console.log(`Built-in notes for ${Object.keys(KB).length} dishes · Gemini key ${GEMINI_KEY ? 'found' : 'MISSING'} · Murf key ${MURF_KEY ? 'found' : 'MISSING'}`);
});
server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n✖ Port ${PORT} is already in use. An OLD copy of the server is still running and is the one answering your browser.\n  Close it first (see the README), then run npm.cmd start again.\n`);
    process.exit(1);
  }
  throw e;
});
