# Scripture Quest — Treasures of the Word

A timed, browser-based Bible quiz game built from the National Bible Bee passage
test banks (NKJV). Answer passages correctly to gather treasures and climb through
seven Biblically-themed tiers:

**Clay → Stone → Iron → Bronze → Silver → Gold → Gemstones**

Each of the first six tiers is completed by earning **5 treasures** (clay jars,
stone blocks, iron blades, bronze bowls, silver rings, gold menorahs). The final
tier gathers the **12 gemstones of the high priest's breastplate** (Exodus 28:17–20).
A live **Treasury** panel shows your collection filling up as you play.

## Features

- **Persistent scholars** — create a named profile; the game remembers each
  scholar's best scores and their full right/wrong history per question, stored
  in the browser (per device — see note below).
- **Adaptive review** — questions you've missed are re-asked about **3× more
  often** than fresh ones, and questions you've mastered fade out, so practice
  concentrates on your weak spots.
- **Three divisions** — Primary (1,071 Qs), Junior (1,226 Qs), Senior (2,389 Qs).
- **Three difficulty levels**, each setting three limits at once:

  | Level | Per-question | Wrong answers allowed | Overall run time |
  |---|---|---|---|
  | Scribe | 25s | 5 | 10:00 |
  | Pilgrim | 15s | 4 | 7:00 |
  | Champion | 10s | 3 | 5:00 |

  Running out of wrong-answer chances **or** overall time ends the run.
- **Difficulty ramp** — easier passage sets feed the early tiers, the hardest sets
  the gemstones, so the quest gets tougher as you climb.
- **Scoring** — points for correct answers, plus time and streak bonuses.
- Keyboard support (A–D or 1–4), fully responsive, works offline once loaded.
- Entirely self-contained: no build step, no external code, no tracking.

The difficulty limits are plain constants at the top of `assets/game.js`
(the `DIFFICULTIES` array) — edit them there to retune.

## Shared scores across devices (cloud backend)

Scholar profiles and a shared leaderboard are stored as JSON **files in this
repository**, on a separate `data` branch, so they're visible from any browser:

```
data branch:
  index.json            leaderboard / directory of all scholars
  profiles/<slug>.json   one scholar's full saved data (scores + question history)
```

- **Viewing is public and needs no setup.** Every visitor's page reads the
  leaderboard and can load any scholar onto their own device (the ☁ chips under
  "Who is playing?"). Reads use the GitHub contents API, which is always fresh
  (unlike the ~5-minute raw CDN cache).
- **Saving is opt-in per device.** GitHub Pages can't hold a write credential
  safely, so to *save* scores a player enables saving with a personal token:

  1. On the home screen, click **Enable saving → How to make one**, or go to
     **GitHub → Settings → Developer settings → Fine-grained tokens → Generate new**.
  2. Scope it to **only this repository**, with **Repository permissions →
     Contents → Read and write**. Set a short expiry if you like.
  3. Paste it into the box and click **Connect**. The token is stored **only in
     that browser** (`localStorage`) and is never written into the repo.

  After that, finishing a run commits the scholar's file to the `data` branch and
  updates the leaderboard, which any other browser then sees.

Set this up once on each device that should be able to save (e.g. a parent or
teacher enabling it on each child's device). A typical family/classroom shares one
token; because it's a fine-grained token limited to this one repo, the worst case
is a bad edit to this repo's data, which is fully recoverable from git history.
Revoke a token anytime from GitHub settings.

**Notes & limits**

- The `data` branch is deliberately separate from `main`, so score-saves don't
  trigger Pages rebuilds (GitHub caps those at ~10/hour).
- Without a token, reads share GitHub's unauthenticated API limit of 60
  requests/hour per IP — ample for casual viewing; with a token it's 5,000/hour.
- Same-scholar edits from two devices are last-write-wins on that scholar's file.
- The repo owner/name is auto-detected from the Pages URL, so forks work without
  code changes; a fresh fork needs its own `data` branch seeded with
  `index.json` = `{"updatedAt":0,"scholars":{}}`.

> **A note on “accounts”:** this is still a static site — there are no passwords or
> real user accounts. “Scholars” are named profiles; the token is what authorizes
> writing their files to the repo. For a public high-stakes leaderboard you'd want
> a real backend (e.g. a serverless function holding the token, or a hosted DB).

## Play locally

Because the game loads a data file, open it through a local web server rather than
double-clicking the HTML:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000> in your browser.

## Deploy to GitHub Pages

1. Create a GitHub repository and push these files to it:

   ```bash
   git init
   git add .
   git commit -m "Scripture Quest quiz game"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**,
   choose the **main** branch and the **/(root)** folder, and click **Save**.
4. Wait a minute, then open `https://<your-username>.github.io/<your-repo>/`.

The included empty `.nojekyll` file tells GitHub Pages to serve the files directly.

## Project structure

```
index.html                     Page shell (start / game / end screens)
assets/style.css               All styling and the parchment theme
assets/game.js                 Game logic, treasure SVG icons, scoring
assets/cloud.js                Shared cross-browser sync (repo files on `data` branch)
assets/data.js                 4,686 parsed questions (generated from the banks)
build_data.py                  Rebuilds assets/data.js from the banks
.nojekyll                      Serve files as-is on GitHub Pages
*_Passages_Test_Bank.md        Source question banks (not needed at runtime)
```

## Regenerating the question data

`assets/data.js` is generated from the three `*_Passages_Test_Bank.md` files. If you
edit a bank, re-run the parser to rebuild the data:

```bash
python3 build_data.py
```

It reads each bank's questions, options, and answer keys and rewrites
`assets/data.js` (`window.QUIZ_DATA`).

---

*Questions are drawn from the National Bible Bee passage test banks (NKJV). This game
is an independent study aid and is not affiliated with or endorsed by the National
Bible Bee.*
