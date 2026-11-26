# Sunset Villa

A step-powered reality-dating show game. You and a partner co-produce a villa full of animal islanders: walk to earn reels, step into scenes, run interviews, set up dates, and watch your episode air at 8pm.

This repo is the playable web demo.

## Demo

`/demo` is the same game set up for showing people: its own save, time you can click through (next part of the day, next day, tonight's episode), buttons for a bombshell, a recoupling and the finale, and a picker to preview any season's features. Rebuild it after changing `index.html`:

```
python3 tools/build_demo.py
```

## Run it

It's a static site with no build step.

- Open `index.html` in a browser, or
- serve the folder: `python3 -m http.server 8000`, then go to http://localhost:8000

## Deploy

Vercel: import this repo as a project. Framework preset "Other", no build command, output directory `.` (the repo root). Every push to `main` redeploys.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The whole game: concept page, phone, all systems inlined |
| `dialogue*.js` | Dialogue library (about 6,000 lines, tagged by personality trait) |
| `src/` | The game systems as separate files, for reading and editing. They are already inlined into `index.html`; the page does not load them |

## Notes for the demo

- Steps are simulated with buttons. Real step counting needs the native app.
- Two-phone co-producing uses Claude's artifact database, so it only works in the Claude-hosted version. On this site the game runs solo.
- Progress saves in the browser (localStorage).
- ☰ → Preview mode lets you skip time. ☰ → "Test as season" previews Seasons 1–10.
