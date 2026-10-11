# Swaad Audio

Explore North and South Indian dishes (healthy and unhealthy) with **real photographs**,
read the history and benefits written by **Gemini**, and listen to each story in your chosen
language, voice, gender and tone using **Murf**.

## Run it (Windows PowerShell or VS Code terminal)
```
npm.cmd install
copy .env.example .env
code .env
npm.cmd start
```
Open http://localhost:3000

In `.env` paste your keys (no quotes, no spaces):
```
GEMINI_API_KEY=...        # https://aistudio.google.com/apikey  (starts with AIza)
MURF_API_KEY=...          # Murf API dashboard
GEMINI_MODEL=gemini-flash-latest
```
Restart the server (Ctrl+C, then `npm.cmd start`) after every change to `.env`.

## How it works
| Endpoint | What it does |
|---|---|
| `GET /api/photo-index`  | One real photo per dish from Wikipedia / Wikimedia Commons (cached in `photo-cache.json`) |
| `GET /api/photos?name=` | Main photo plus more photos from the dish's article (gallery) |
| `POST /api/food-info`   | Gemini: about, history, benefits, cautions (JSON, cached) |
| `GET /api/voices`       | The Murf Falcon voices used (English, Hindi, Tamil, Telugu; Male and Female) |
| `POST /api/narrate`     | Gemini writes a spoken-style script in the chosen language |
| `POST /api/speak`       | Murf Falcon (`global.api.murf.ai/v1/speech/stream`) turns the script into an MP3, returned as base64 |

Your keys stay on the server.

## Photos
- Photos load automatically from Wikipedia the first time you open the site (needs internet).
- Want your own photo for a dish? Save it in `public/images/` named after the dish, for example
  `idli.jpg`, `hyderabadi-biryani.jpg`, `palak-paneer.png`. It overrides the Wikipedia photo.
- If a photo cannot be found, the card shows a drawn plate illustration instead.
- Wikipedia images are free-licensed; the footer and each dish link to the source.

## Add dishes or languages
- Dishes: edit `public/foods.js` (`w` is the Wikipedia article title used to find photos).
- Languages: edit `LANGS` in `public/index.html` (Murf locale prefix like `te-`, `hi-`, `zh-`).

## If you see an old error or an old design
An old copy of the server may still be running on port 3000 and answering your browser.
1. Close it (run this in PowerShell):
```
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
2. Start again: `npm.cmd start`
3. The terminal must print `Swaad Audio v4 running`. Also open http://localhost:3000/api/version , it must show `"version":4`.
4. Refresh the browser with Ctrl+F5.

## Audio voices (taken from the NxtWave travel-guide reference)
| Language | Male | Female | Locale |
|---|---|---|---|
| English | Matthew | Alicia | en-US |
| Hindi | Aman | Namrita | hi-IN |
| Tamil | Murali | Iniya | ta-IN |
| Telugu | Zion | Josie | te-IN |

To add a language, add a row to `FALCON_VOICES` in `server.js` and to `LANGS` in `public/index.html`.
