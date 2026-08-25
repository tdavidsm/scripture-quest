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

- **Three divisions** — Primary (1,071 Qs), Junior (1,226 Qs), Senior (2,389 Qs).
- **Three clock speeds** — Scribe (35s), Pilgrim (25s), Champion (15s) per question.
- **Difficulty ramp** — easier passage sets feed the early tiers, the hardest sets
  the gemstones, so the quest gets tougher as you climb.
- **Scoring** — points for correct answers, plus time and streak bonuses.
- **Best-score memory** — your best run per division is saved in the browser.
- Keyboard support (A–D or 1–4), fully responsive, works offline once loaded.
- Entirely self-contained: no build step, no external code, no tracking.

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
