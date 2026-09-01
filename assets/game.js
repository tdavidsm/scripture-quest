/* ============================================================
   Scripture Quest — game logic
   ============================================================ */
(function () {
  "use strict";

  /* ---------- treasure icons (self-contained SVG) ---------- */
  const ICONS = {
    clay: () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 17 Q11 33 20 34 Q29 33 29 17 Q29 11 20 11 Q11 11 11 17Z" fill="#b5652f"/>
      <path d="M11 17 Q11 25 15 31 Q13 24 14 18 Q15 13 20 11 Q13 11 11 17Z" fill="#8f4a1f"/>
      <ellipse cx="17" cy="21" rx="2.3" ry="6" fill="#d98a52" opacity=".55"/>
      <path d="M12 12 q-4 2 -2 7" stroke="#8f4a1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M28 12 q4 2 2 7" stroke="#8f4a1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <rect x="16" y="6" width="8" height="7" rx="1.5" fill="#c1703a"/>
      <ellipse cx="20" cy="6.5" rx="6" ry="2.3" fill="#d98a52"/>
      <ellipse cx="20" cy="6.5" rx="3.4" ry="1.2" fill="#7d3f18"/></svg>`,
    stone: () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,6 34,13 20,20 6,13" fill="#a3a39c"/>
      <polygon points="6,13 20,20 20,34 6,27" fill="#75756e"/>
      <polygon points="34,13 20,20 20,34 34,27" fill="#5b5b54"/>
      <polyline points="6,13 20,20 34,13" fill="none" stroke="#bcbcb4" stroke-width="1" opacity=".5"/>
      <line x1="20" y1="20" x2="20" y2="34" stroke="#4a4a44" stroke-width="1" opacity=".5"/>
      <line x1="12" y1="16.5" x2="12" y2="30" stroke="#5f5f58" stroke-width="1" opacity=".4"/></svg>`,
    iron: () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,3 24,20 20,25 16,20" fill="#c2cad0"/>
      <polygon points="20,3 20,25 16,20" fill="#8f989f"/>
      <polygon points="20,3 24,20 20,25" fill="#aab3ba"/>
      <rect x="12" y="23" width="16" height="3.2" rx="1.6" fill="#7a5730"/>
      <rect x="18" y="26" width="4" height="9" rx="2" fill="#4a3218"/>
      <rect x="18.8" y="26" width="1.4" height="9" fill="#6b4a26"/>
      <circle cx="20" cy="36" r="2.6" fill="#7a5730"/></svg>`,
    bronze: () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16 Q20 35 34 16 Z" fill="#b57c22"/>
      <path d="M6 16 Q20 30 34 16 Q20 33 6 16Z" fill="#8a5e1a" opacity=".55"/>
      <ellipse cx="20" cy="16" rx="14" ry="4.6" fill="#d9a63f"/>
      <ellipse cx="20" cy="16" rx="10.5" ry="3" fill="#8a5e1a"/>
      <ellipse cx="16.5" cy="15" rx="3.5" ry="1" fill="#f0cf7e" opacity=".8"/></svg>`,
    silver: () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="25" rx="11" ry="9.5" fill="none" stroke="#b9bfc6" stroke-width="4.2"/>
      <ellipse cx="20" cy="25" rx="11" ry="9.5" fill="none" stroke="#eef2f6" stroke-width="1.5"/>
      <ellipse cx="20" cy="25" rx="11" ry="9.5" fill="none" stroke="#8b939b" stroke-width="1.5" opacity=".5" transform="rotate(20 20 25)"/>
      <polygon points="20,4 25,10 20,16 15,10" fill="#7fb8e6"/>
      <polygon points="20,4 25,10 20,16" fill="#a9d4f5"/>
      <polygon points="20,4 15,10 20,16" fill="#5f9fd6"/></svg>`,
    gold: () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#d9a93a" stroke-width="2.2" stroke-linecap="round">
        <path d="M20 27 V12"/>
        <path d="M20 25 Q13.5 25 13.5 16 V12"/>
        <path d="M20 25 Q9 24 9 15 V12"/>
        <path d="M20 25 Q5 22 5 13 V12"/>
        <path d="M20 25 Q26.5 25 26.5 16 V12"/>
        <path d="M20 25 Q31 24 31 15 V12"/>
        <path d="M20 25 Q35 22 35 13 V12"/>
      </g>
      <g fill="#ff9a3c">
        <circle cx="5" cy="10.5" r="1.7"/><circle cx="9" cy="10.5" r="1.7"/><circle cx="13.5" cy="10.5" r="1.7"/>
        <circle cx="20" cy="10.5" r="1.7"/><circle cx="26.5" cy="10.5" r="1.7"/><circle cx="31" cy="10.5" r="1.7"/>
        <circle cx="35" cy="10.5" r="1.7"/></g>
      <g fill="#ffd27a">
        <circle cx="5" cy="10" r=".7"/><circle cx="9" cy="10" r=".7"/><circle cx="13.5" cy="10" r=".7"/>
        <circle cx="20" cy="10" r=".7"/><circle cx="26.5" cy="10" r=".7"/><circle cx="31" cy="10" r=".7"/>
        <circle cx="35" cy="10" r=".7"/></g>
      <path d="M15 27 h10 l2 4 h-14 Z" fill="#e6bd5c"/>
      <rect x="12" y="31" width="16" height="2.4" rx="1.2" fill="#d9a93a"/></svg>`,
    gem: (g) => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,4 31,14 20,37 9,14" fill="${g.main}"/>
      <polygon points="20,4 31,14 20,17 9,14" fill="${g.light}"/>
      <polygon points="9,14 20,17 20,37" fill="${g.dark}"/>
      <polygon points="31,14 20,17 20,37" fill="${g.main}"/>
      <polyline points="9,14 20,4 31,14" fill="none" stroke="#ffffff" stroke-width=".8" opacity=".55"/>
      <line x1="20" y1="17" x2="20" y2="37" stroke="#ffffff" stroke-width=".7" opacity=".3"/>
      <polygon points="14,12 20,4 20,9" fill="#ffffff" opacity=".35"/></svg>`,
    heart: () => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7.5-4.9-7.5-10.5A4 4 0 0 1 12 7.2 4 4 0 0 1 19.5 10.5C19.5 16.1 12 21 12 21z"
            fill="#9b3b3b" stroke="#7a2e2e" stroke-width="1"/>
      <path d="M8.5 8.2a3 3 0 0 1 2.4-1.1" fill="none" stroke="#d98a8a" stroke-width="1.2" stroke-linecap="round" opacity=".8"/></svg>`,
    heartLost: () => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7.5-4.9-7.5-10.5A4 4 0 0 1 12 7.2 4 4 0 0 1 19.5 10.5C19.5 16.1 12 21 12 21z"
            fill="none" stroke="#8a7a5a" stroke-width="1.2" opacity=".55"/>
      <path d="M12 7.5 l-1.6 4 2.4 1.5 -1.8 3.5" fill="none" stroke="#8a7a5a" stroke-width="1" opacity=".5" stroke-linejoin="round"/></svg>`,
  };

  /* 12 stones of the breastplate (Exodus 28:17-20) */
  const GEMS = [
    { name: "Sardius",   main: "#c1362f", light: "#e0655c", dark: "#8f231e" },
    { name: "Topaz",     main: "#e8b32e", light: "#f6d675", dark: "#b3841a" },
    { name: "Emerald",   main: "#2f9e57", light: "#63c489", dark: "#1d6e3a" },
    { name: "Turquoise", main: "#2bb0b8", light: "#6fd6dc", dark: "#1a7d83" },
    { name: "Sapphire",  main: "#3559b3", light: "#6b8fe0", dark: "#213c80" },
    { name: "Diamond",   main: "#cfe3ef", light: "#ffffff", dark: "#9db6c6" },
    { name: "Jacinth",   main: "#e07a2c", light: "#f2a565", dark: "#a8531a" },
    { name: "Agate",     main: "#b98a5e", light: "#dcb98f", dark: "#8a6038" },
    { name: "Amethyst",  main: "#8548b0", light: "#b07bd6", dark: "#5e2f82" },
    { name: "Beryl",     main: "#3fb59a", light: "#78d8c2", dark: "#26816d" },
    { name: "Onyx",      main: "#3a3a42", light: "#6d6d78", dark: "#1e1e24" },
    { name: "Jasper",    main: "#8fae43", light: "#bcd479", dark: "#63802a" },
  ];

  /* ---------- tiers ---------- */
  const TIERS = [
    { key: "clay",   name: "Clay",      item: "clay jar",     count: 5,  icon: () => ICONS.clay() },
    { key: "stone",  name: "Stone",     item: "stone block",  count: 5,  icon: () => ICONS.stone() },
    { key: "iron",   name: "Iron",      item: "iron blade",   count: 5,  icon: () => ICONS.iron() },
    { key: "bronze", name: "Bronze",    item: "bronze bowl",  count: 5,  icon: () => ICONS.bronze() },
    { key: "silver", name: "Silver",    item: "silver ring",  count: 5,  icon: () => ICONS.silver() },
    { key: "gold",   name: "Gold",      item: "gold menorah", count: 5,  icon: () => ICONS.gold() },
    { key: "gems",   name: "Gemstones", item: "gemstone",     count: 12, gems: true, icon: (i) => ICONS.gem(GEMS[i % GEMS.length]) },
  ];
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");

  const DIVISIONS = [
    { key: "primary", name: "Primary",  desc: "youngest" },
    { key: "junior",  name: "Junior",   desc: "middle" },
    { key: "senior",  name: "Senior",   desc: "advanced" },
  ];
  // perQ  = seconds per question
  // maxWrong = wrong answers allowed before the run ends
  // runTime = overall seconds for the whole run
  // mult = score multiplier — harder clock / fewer lives is worth more
  const DIFFICULTIES = [
    { key: "scribe",   name: "Scribe",   perQ: 25, maxWrong: 5, runTime: 600, mult: 1.0 },
    { key: "pilgrim",  name: "Pilgrim",  perQ: 15, maxWrong: 4, runTime: 420, mult: 1.5 },
    { key: "champion", name: "Champion", perQ: 10, maxWrong: 3, runTime: 300, mult: 2.0 },
  ];
  const diffCfg = () => DIFFICULTIES.find((d) => d.key === S.difficulty);
  function fmtTime(sec) {
    sec = Math.max(0, Math.ceil(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }

  /* ---------- state ---------- */
  const S = {
    profile: null,      // current scholar name
    mode: "quest",      // "quest" | "custom"
    filters: null,      // custom-run filters { cats, chapters, summary, refs }
    division: null, difficulty: null,
    bands: [],          // per-tier full question pools (not consumed)
    usedKeys: null,     // Set of question keys used this run
    tier: 0, itemInTier: 0,
    qIndex: 0,          // overall question count
    score: 0, streak: 0, bestStreak: 0,
    correct: 0, attempts: 0,
    current: null,      // current question
    timer: null, timeLeft: 0, timeTotal: 0, answered: false,
    lives: 0, maxWrong: 0,
    runTimer: null, runLeft: 0, runTime: 0,
    startTime: 0, ended: false,
  };
  const TOTAL_ITEMS = TIERS.reduce((a, t) => a + t.count, 0);

  /* ---------- dom ---------- */
  const $ = (id) => document.getElementById(id);
  const screens = { start: $("screen-start"), game: $("screen-game"),
    end: $("screen-end"), progress: $("screen-progress") };
  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    window.scrollTo(0, 0);
  }

  /* ---------- audio (WebAudio, no assets) ---------- */
  let AC = null;
  function beep(freqs, dur, type) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const now = AC.currentTime;
      freqs.forEach((f, i) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = type || "sine"; o.frequency.value = f;
        o.connect(g); g.connect(AC.destination);
        const t = now + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.02);
      });
    } catch (e) {}
  }
  const sndGood = () => beep([523, 784], 0.25, "triangle");
  const sndTier = () => beep([523, 659, 784, 1047], 0.3, "triangle");
  const sndBad  = () => beep([196, 155], 0.25, "sawtooth");
  const sndWin  = () => beep([523, 659, 784, 1047, 1319], 0.45, "triangle");

  /* ---------- helpers ---------- */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Build one question pool per tier, using set-number difficulty bands. */
  function buildPools(divKey) {
    const all = window.QUIZ_DATA.data[divKey];
    const maxSet = window.QUIZ_DATA.meta[divKey].sets;
    const nTiers = TIERS.length;
    const buckets = Array.from({ length: nTiers }, () => []);
    let rr = 0;   // round-robin cursor for questions with no set number
    all.forEach((q) => {
      let band;
      if (q.s == null) {
        // xlsx workbook questions have no difficulty set — spread them evenly
        // across the tiers so a Full Quest draws them throughout
        band = rr % nTiers; rr++;
      } else {
        band = Math.floor(((q.s - 1) / maxSet) * nTiers);
      }
      if (!(band >= 0)) band = 0;          // guards NaN
      if (band >= nTiers) band = nTiers - 1;
      buckets[band].push(q);
    });
    // guarantee every tier has enough questions; borrow from neighbours if sparse
    for (let t = 0; t < nTiers; t++) {
      if (buckets[t].length < TIERS[t].count + 2) {
        const merged = buckets[t].slice();
        for (let d = 1; d < nTiers && merged.length < TIERS[t].count + 2; d++) {
          if (buckets[t - d]) merged.push(...buckets[t - d]);
          if (buckets[t + d]) merged.push(...buckets[t + d]);
        }
        buckets[t] = merged;
      }
      shuffle(buckets[t]);
    }
    return buckets;
  }

  /* ============================================================
     PROFILES  (persistent scholars, stored in this browser)
     ============================================================ */
  const STORE_KEY = "scripture-quest-v2";
  let STORE = loadStore();

  function loadStore() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.profiles) return s;
    } catch (e) {}
    return { profiles: {}, current: null };
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(STORE)); } catch (e) {}
  }
  function curProfile() { return STORE.profiles[S.profile]; }
  function makeProfile(name) {
    STORE.profiles[name] = { created: Date.now(), best: {}, scopes: {}, history: [], q: {}, runs: 0, lastPlayed: 0 };
    saveStore();
  }

  // stable per-question key: division + short hash of the text
  function hstr(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function qkey(q) { return S.division[0] + hstr(q.q); }

  // higher weight -> asked more often. Favors previously-wrong and unseen
  // questions; fades ones the scholar has mastered.
  function weightOf(q) {
    const p = curProfile();
    const st = p && p.q[qkey(q)];
    if (!st) return 1.2;                                   // unseen: slight favor
    if (st.w > st.c) return Math.min(10, 2 + (st.w - st.c) * 2);   // struggling
    if (st.w === st.c) return st.w > 0 ? 1.6 : 1.2;        // even record
    return Math.max(0.3, 1.2 - (st.c - st.w) * 0.3);       // mastered: fades
  }
  function weightedPick(cands) {
    let total = 0;
    const ws = cands.map((q) => { const w = weightOf(q); total += w; return w; });
    let r = Math.random() * total;
    for (let i = 0; i < cands.length; i++) { r -= ws[i]; if (r <= 0) return i; }
    return cands.length - 1;
  }
  // record the outcome of the current question against the scholar's history
  function recordOutcome(correct) {
    const p = curProfile();
    if (!p) return;
    const k = qkey(S.current);
    const st = p.q[k] || { c: 0, w: 0 };
    if (correct) st.c++; else st.w++;
    st.last = Date.now();
    p.q[k] = st;
    p.lastPlayed = Date.now();
    saveStore();
  }

  /* ============================================================
     START SCREEN
     ============================================================ */
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function initials(name) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0][0] || "?") + (parts[1] ? parts[1][0] : "")).toUpperCase();
  }

  function renderProfiles() {
    const box = $("profiles");
    box.innerHTML = "";
    const names = Object.keys(STORE.profiles).sort(
      (a, b) => (STORE.profiles[b].lastPlayed || 0) - (STORE.profiles[a].lastPlayed || 0)
    );
    names.forEach((name) => {
      const chip = document.createElement("div");
      chip.className = "profile-chip" + (S.profile === name ? " selected" : "");
      chip.innerHTML =
        `<span class="avatar">${escapeHtml(initials(name))}</span>` +
        `<span class="pname">${escapeHtml(name)}</span>` +
        `<button class="chip-del" title="Remove ${escapeHtml(name)}" aria-label="Remove ${escapeHtml(name)}">×</button>`;
      chip.addEventListener("click", (e) => {
        if (e.target.classList.contains("chip-del")) { e.stopPropagation(); delProfile(name); return; }
        selectProfile(name);
      });
      box.appendChild(chip);
    });

    // cloud-only scholars (saved from another browser) — click to load here
    const localSlugs = new Set(names.map((n) => Cloud.slugify(n)));
    const cloud = (CLOUD_INDEX && CLOUD_INDEX.scholars) || {};
    Object.keys(cloud).forEach((slug) => {
      if (localSlugs.has(slug)) return;
      const nm = cloud[slug].name || slug;
      const chip = document.createElement("div");
      chip.className = "profile-chip cloud";
      chip.title = "Saved on another device — click to load here";
      chip.innerHTML =
        `<span class="avatar">${escapeHtml(initials(nm))}</span>` +
        `<span class="pname">${escapeHtml(nm)}</span>` +
        `<span class="cloud-mark">☁</span>`;
      chip.addEventListener("click", () => pullCloudScholar(slug));
      box.appendChild(chip);
    });
  }
  async function pullCloudScholar(slug) {
    try {
      const prof = await Cloud.getProfile(slug);
      const name = prof.name || slug;
      STORE.profiles[name] = prof;
      saveStore();
      selectProfile(name);
    } catch (e) {
      alert("Could not load that scholar from the cloud. Please try again.");
    }
  }
  function selectProfile(name) {
    S.profile = name;
    STORE.current = name;
    saveStore();
    renderProfiles();
    refreshStart();
  }
  function addProfile() {
    const input = $("newProfileInput");
    const name = input.value.trim().replace(/\s+/g, " ");
    if (!name) return;
    if (STORE.profiles[name]) { selectProfile(name); input.value = ""; return; }
    makeProfile(name);
    input.value = "";
    selectProfile(name);
  }
  function delProfile(name) {
    if (!window.confirm(`Remove "${name}" and all of their saved progress?`)) return;
    delete STORE.profiles[name];
    if (S.profile === name) S.profile = null;
    if (STORE.current === name) STORE.current = null;
    saveStore();
    renderProfiles();
    refreshStart();
  }

  function renderStart() {
    if (STORE.current && STORE.profiles[STORE.current]) S.profile = STORE.current;
    renderProfiles();

    const dc = $("divisions");
    dc.innerHTML = "";
    DIVISIONS.forEach((d) => {
      const n = window.QUIZ_DATA.meta[d.key].count;
      const el = document.createElement("button");
      el.className = "opt-card";
      el.dataset.key = d.key;
      el.innerHTML = `<span class="opt-name">${d.name}</span><span class="opt-desc">${d.desc} · ${n} Qs</span>`;
      el.addEventListener("click", () => {
        S.division = d.key;
        dc.querySelectorAll(".opt-card").forEach((x) => x.classList.remove("selected"));
        el.classList.add("selected");
        if (S.mode === "custom") renderCustomBuilder(S.division);
        refreshStart();
      });
      dc.appendChild(el);
    });

    const fc = $("difficulties");
    fc.innerHTML = "";
    DIFFICULTIES.forEach((f, i) => {
      const el = document.createElement("button");
      el.className = "opt-card";
      el.dataset.key = f.key;
      el.innerHTML = `<span class="opt-name">${f.name}</span>` +
        `<span class="opt-desc">${f.perQ}s each · ${f.maxWrong} lives · ${fmtTime(f.runTime)}</span>` +
        `<span class="opt-mult">×${f.mult.toFixed(1)} points</span>`;
      el.addEventListener("click", () => {
        S.difficulty = f.key;
        fc.querySelectorAll(".opt-card").forEach((x) => x.classList.remove("selected"));
        el.classList.add("selected");
        refreshStart();
      });
      fc.appendChild(el);
      if (i === 1) el.click(); // default: Pilgrim
    });

    $("addProfileBtn").addEventListener("click", addProfile);
    $("newProfileInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); addProfile(); }
    });
  }
  function refreshStart() {
    let ok = !!(S.profile && S.division && S.difficulty);
    if (ok && S.mode === "custom") ok = QM.count(S.division, S.filters) > 0;
    $("startBtn").disabled = !ok;
    const pb = $("progressBtn");
    if (pb) pb.hidden = !S.profile;
    const bl = $("bestLine");
    const p = curProfile();
    if (p && S.division && p.best[S.division]) {
      const b = p.best[S.division];
      bl.hidden = false;
      bl.textContent = `${S.profile}'s best in ${cap(S.division)}: ${b.score} points · ${b.items}/${TOTAL_ITEMS} treasures`;
    } else if (S.profile) {
      bl.hidden = false;
      bl.textContent = `Playing as ${S.profile}. Choose a division and clock to begin.`;
    } else {
      bl.hidden = true;
    }
  }

  /* ============================================================
     GAME
     ============================================================ */
  // A run's score is multiplied by how broad its question pool is, so a narrow
  // single-category run scores lower than one drawn from a broad bank — even if
  // the broad run answered fewer correctly.  Log curve, clamped.
  function breadthMultiplier(poolSize) {
    const REF = 1200, FLOOR = 0.5, CAP = 1.25;
    const m = Math.log(poolSize + 1) / Math.log(REF + 1);
    return Math.max(FLOOR, Math.min(CAP, m));
  }
  // Identify the "subcategory" a run belongs to, for the per-category leaderboards.
  // Only single-category (optionally single-chapter) custom runs get their own board.
  // categories whose questions are chapter-tagged — a single-chapter run of one of
  // these gets a chapter-specific leaderboard, e.g. "English ↔ Greek Word — Matthew 5"
  const CHAPTERED_CATS = new Set([
    "random", "gkword", "hbword", "verseloc", "gkstrong", "hbstrong", "gkvine",
    "hboutline", "wordxref", "sectionref", "parallel", "provxref", "sectitle",
    "decalogue", "otlegal", "noparallel",
  ]);
  function runScope() {
    if (S.mode !== "custom") return { key: "overall", label: "Full Quest" };
    const sel = QM.categories(S.division).map((c) => c.key).filter((c) => S.filters.cats.has(c));
    if (sel.length === 1) {
      const c = sel[0];
      if (CHAPTERED_CATS.has(c)) {
        const selCh = QM.chapters(S.division).filter((ch) => S.filters.chapters.has(ch));
        if (selCh.length === 1) return { key: c + ":" + selCh[0], label: QM.catName(c) + " — " + selCh[0] };
      }
      return { key: c, label: QM.catName(c) };
    }
    return { key: "overall", label: "Custom (mixed)" };
  }

  function startGame() {
    const cfg = diffCfg();
    let poolSize;
    if (S.mode === "custom") {
      const pool = QM.filterPool(S.division, S.filters);
      if (!pool.length) return;              // nothing matches — shouldn't happen (guarded)
      S.bands = TIERS.map(() => pool);       // one filtered pool feeds every tier
      poolSize = pool.length;
    } else {
      S.bands = buildPools(S.division);
      poolSize = window.QUIZ_DATA.meta[S.division].count;  // full division
    }
    S.poolSize = poolSize;
    S.breadth = breadthMultiplier(poolSize);
    S.diffMult = cfg.mult;
    S.scoreMult = S.breadth * S.diffMult;   // total points multiplier
    S.scope = runScope();
    S.usedKeys = new Set();
    S.tier = 0; S.itemInTier = 0; S.qIndex = 0;
    S.score = 0; S.streak = 0; S.bestStreak = 0; S.correct = 0; S.attempts = 0;
    S.timeTotal = cfg.perQ;
    S.maxWrong = cfg.maxWrong; S.lives = cfg.maxWrong;
    S.runTime = cfg.runTime; S.runLeft = cfg.runTime;
    S.ended = false;
    S.startTime = Date.now();
    $("playerVal").textContent = S.profile || "—";
    $("breadthVal").textContent = "×" + S.scoreMult.toFixed(2);
    buildCollection();
    renderLives();
    show("game");
    startRunTimer();
    nextQuestion();
  }

  /* ---------- lives ---------- */
  function renderLives() {
    const el = $("lives");
    el.innerHTML = "";
    for (let i = 0; i < S.maxWrong; i++) {
      const h = document.createElement("span");
      const lost = i >= S.lives;
      h.className = "heart" + (lost ? " lost" : "");
      h.innerHTML = lost ? ICONS.heartLost() : ICONS.heart();
      el.appendChild(h);
    }
  }
  function loseLife() {
    S.lives = Math.max(0, S.lives - 1);
    renderLives();
    const justLost = $("lives").children[S.lives];
    if (justLost) justLost.classList.add("pop");
  }

  /* ---------- overall run timer ---------- */
  function startRunTimer() {
    clearInterval(S.runTimer);
    updateRunClock();
    S.runTimer = setInterval(() => {
      S.runLeft -= 1;
      updateRunClock();
      if (S.runLeft <= 0) { clearInterval(S.runTimer); endGame(false, "time"); }
    }, 1000);
  }
  function updateRunClock() {
    const el = $("runClock");
    $("runClockText").textContent = fmtTime(S.runLeft);
    el.classList.toggle("warn", S.runLeft <= 60 && S.runLeft > 20);
    el.classList.toggle("danger", S.runLeft <= 20);
  }

  // decide what happens after the feedback pause on an answered question
  function proceed() {
    if (S.ended) return;
    if (S.lives <= 0) { endGame(false, "lives"); return; }
    if (S.tier >= TIERS.length) { endGame(true); return; }
    nextQuestion();
  }

  function buildCollection() {
    const wrap = $("tiers");
    wrap.innerHTML = "";
    TIERS.forEach((t, ti) => {
      const row = document.createElement("div");
      row.className = "tier-row";
      row.id = "row-" + ti;
      let slots = "";
      for (let i = 0; i < t.count; i++) {
        slots += `<div class="slot" id="slot-${ti}-${i}">${t.icon(i)}</div>`;
      }
      row.innerHTML =
        `<div class="tier-head"><span class="tier-name">${t.name}</span>` +
        `<span class="tier-count" id="count-${ti}">0/${t.count}</span></div>` +
        `<div class="slots">${slots}</div>`;
      wrap.appendChild(row);
    });
    updateCollectionState();
  }

  function updateCollectionState() {
    TIERS.forEach((t, ti) => {
      const row = $("row-" + ti);
      row.classList.toggle("active", ti === S.tier);
      row.classList.toggle("done", ti < S.tier);
    });
  }

  function nextQuestion() {
    if (S.ended) return;
    if (S.tier >= TIERS.length) return endGame(true);
    const tier = TIERS[S.tier];
    const band = S.bands[S.tier];
    // draw from questions not yet used this run, weighted toward the scholar's
    // previously-missed ones; if the band is exhausted, allow reuse
    let cands = band.filter((q) => !S.usedKeys.has(qkey(q)));
    if (cands.length === 0) cands = band;
    S.current = cands[weightedPick(cands)];
    S.usedKeys.add(qkey(S.current));
    S.answered = false;
    S.qIndex++;

    // banner
    $("tierBannerIcon").innerHTML = tier.gems ? ICONS.gem(GEMS[S.itemInTier % GEMS.length]) : tier.icon(0);
    $("tierBannerName").textContent = tier.name;
    $("tierBannerSub").textContent = tier.gems
      ? `Gather all ${tier.count} gemstones — ${GEMS[S.itemInTier % GEMS.length].name} next`
      : `Gather ${plural(tier.count, tier.item)}`;

    // meta + question
    $("qMeta").textContent = `Question ${S.qIndex} · ${tier.name} — ${cap(tier.item)} ${S.itemInTier + 1} of ${tier.count}`;
    const q = S.current;
    const isVerse = /^["“]/.test(q.q);
    $("qText").innerHTML = `<span class="${isVerse ? "lead" : ""}">${mdInline(escapeHtml(q.q))}</span>`;

    // answers
    const ac = $("answers");
    ac.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    q.o.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "answer";
      b.innerHTML = `<span class="letter">${letters[i]}</span><span class="atext">${escapeHtml(opt)}</span>`;
      b.addEventListener("click", () => answer(i, b));
      ac.appendChild(b);
    });

    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    updateHud();
    updateCollectionState();
    startTimer();
  }

  function startTimer() {
    clearInterval(S.timer);
    S.timeLeft = S.timeTotal;
    const bar = $("timerBar");
    bar.style.transition = "none";
    bar.style.width = "100%";
    bar.className = "timer-bar";
    $("timerText").textContent = Math.ceil(S.timeLeft);
    // force reflow then enable transition
    void bar.offsetWidth;
    bar.style.transition = "width .1s linear, background .3s ease";
    const tick = 0.1;
    S.timer = setInterval(() => {
      S.timeLeft -= tick;
      if (S.timeLeft <= 0) {
        S.timeLeft = 0;
        clearInterval(S.timer);
        timeUp();
      }
      const pct = (S.timeLeft / S.timeTotal) * 100;
      bar.style.width = pct + "%";
      $("timerText").textContent = Math.ceil(S.timeLeft);
      bar.classList.toggle("warn", pct <= 50 && pct > 25);
      bar.classList.toggle("danger", pct <= 25);
    }, tick * 1000);
  }

  function answer(i, btn) {
    if (S.answered) return;
    S.answered = true;
    clearInterval(S.timer);
    S.attempts++;
    const correctIdx = S.current.a;
    const buttons = Array.from($("answers").children);
    buttons.forEach((b, bi) => {
      b.disabled = true;
      if (bi === correctIdx) b.classList.add("correct");
      else if (bi === i) b.classList.add("wrong");
      else b.classList.add("dim");
    });

    if (i === correctIdx) {
      S.correct++;
      S.streak++;
      S.bestStreak = Math.max(S.bestStreak, S.streak);
      const timeBonus = Math.round((S.timeLeft / S.timeTotal) * 60);
      const streakBonus = Math.min(S.streak, 10) * 5;
      const gained = Math.round((100 + timeBonus + streakBonus) * S.scoreMult);
      S.score += gained;
      recordOutcome(true);
      const fb = $("feedback");
      fb.className = "feedback good";
      fb.textContent = `✔ Correct!  +${gained}` + (S.streak > 1 ? `  ·  ${S.streak} streak` : "");
      sndGood();
      updateHud();
      earnItem();
    } else {
      S.streak = 0;
      recordOutcome(false);
      loseLife();
      const fb = $("feedback");
      fb.className = "feedback bad";
      fb.textContent = "The answer was " + ["A", "B", "C", "D"][correctIdx] +
        (S.lives > 0 ? "." : ".  Out of chances!");
      sndBad();
      updateHud();
      setTimeout(proceed, 1600);
    }
  }

  function timeUp() {
    if (S.answered) return;
    S.answered = true;
    S.attempts++;
    S.streak = 0;
    recordOutcome(false);
    loseLife();
    const buttons = Array.from($("answers").children);
    buttons.forEach((b, bi) => {
      b.disabled = true;
      if (bi === S.current.a) b.classList.add("correct");
      else b.classList.add("dim");
    });
    const fb = $("feedback");
    fb.className = "feedback bad";
    fb.textContent = "Time! The answer was " + ["A", "B", "C", "D"][S.current.a] +
      (S.lives > 0 ? "." : ".  Out of chances!");
    sndBad();
    updateHud();
    setTimeout(proceed, 1600);
  }

  function earnItem() {
    const ti = S.tier, idx = S.itemInTier;
    const slot = $(`slot-${ti}-${idx}`);
    if (slot) slot.classList.add("filled");
    S.itemInTier++;
    $("count-" + ti).textContent = `${S.itemInTier}/${TIERS[ti].count}`;

    const tierDone = S.itemInTier >= TIERS[ti].count;
    if (tierDone) {
      S.tier++;
      S.itemInTier = 0;
      if (S.tier >= TIERS.length) {
        setTimeout(() => endGame(true), 1200);
        return;
      }
      sndTier();
      const next = TIERS[S.tier];
      const fb = $("feedback");
      setTimeout(() => {
        if (S.ended) return;
        fb.className = "feedback good";
        fb.textContent = `✦ ${TIERS[ti].name} complete! On to ${next.name}.`;
      }, 700);
      setTimeout(proceed, 1900);
    } else {
      setTimeout(proceed, 1300);
    }
  }

  function updateHud() {
    $("scoreVal").textContent = S.score;
    $("streakVal").textContent = S.streak;
    const acc = S.attempts ? Math.round((S.correct / S.attempts) * 100) : 100;
    $("accVal").textContent = acc + "%";
  }

  /* ============================================================
     END SCREEN
     ============================================================ */
  function endGame(won, reason) {
    if (S.ended) return;
    S.ended = true;
    clearInterval(S.timer);
    clearInterval(S.runTimer);
    const itemsEarned = TIERS.slice(0, S.tier).reduce((a, t) => a + t.count, 0) + S.itemInTier;
    const acc = S.attempts ? Math.round((S.correct / S.attempts) * 100) : 0;

    let title, sub, crest;
    if (won) {
      title = "The Treasury is Full!";
      sub = "You have gathered every treasure of the Word — from humble clay to the twelve gemstones of the breastplate. Well done, good and faithful scholar.";
      crest = ICONS.gem(GEMS[0]);
    } else if (reason === "time") {
      title = "Time Has Run Out";
      sub = `The run's clock reached zero. You gathered ${itemsEarned} of ${TOTAL_ITEMS} treasures — take up the quest again to go further.`;
      crest = ICONS.gold();
    } else if (reason === "lives") {
      title = "Out of Chances";
      sub = `You spent your last of ${S.maxWrong} wrong answers. The ${itemsEarned} treasures you gathered are kept in your Treasury — try again.`;
      crest = ICONS.iron();
    } else {
      title = "Quest Paused";
      sub = "You may return and take up the quest again whenever you are ready.";
      crest = ICONS.clay();
    }
    $("endTitle").textContent = title;
    $("endSub").textContent = sub;
    $("endCrest").innerHTML = crest;

    $("endStats").innerHTML = [
      ["Score", S.score],
      ["Treasures", `${itemsEarned}/${TOTAL_ITEMS}`],
      ["Accuracy", acc + "%"],
      ["Points ×", "×" + S.scoreMult.toFixed(2)],
    ].map(([l, n]) => `<div class="end-stat"><span class="n">${n}</span><span class="l">${l}</span></div>`).join("");
    // note the run's focus + how the points multiplier was formed
    const scopeNote = $("endScope");
    if (scopeNote) {
      const focus = (S.scope && S.scope.key !== "overall")
        ? `Focused run: ${S.scope.label} · ${S.poolSize} questions`
        : `Broad run · ${S.poolSize} questions`;
      scopeNote.textContent =
        `${focus}.  Points ×${S.scoreMult.toFixed(2)} = breadth ×${S.breadth.toFixed(2)} × ${cap(S.difficulty)} ×${S.diffMult.toFixed(1)}`;
    }

    // treasury display
    let tre = "";
    TIERS.forEach((t, ti) => {
      const earned = ti < S.tier ? t.count : (ti === S.tier ? S.itemInTier : 0);
      for (let i = 0; i < earned; i++) tre += t.icon(i);
    });
    $("endTreasury").innerHTML = tre || `<span style="color:#b79b6d">No treasures yet — try again!</span>`;

    // record into the scholar's profile
    const p = curProfile();
    if (p) {
      p.runs = (p.runs || 0) + 1;
      const prev = p.best[S.division];
      if (!prev || S.score > prev.score) p.best[S.division] = { score: S.score, items: itemsEarned, won: !!won };
      // per-subcategory best (for the category leaderboards) — only narrow runs
      if (S.scope && S.scope.key !== "overall") {
        p.scopes = p.scopes || {};
        const sk = S.division + "::" + S.scope.key;
        const pv = p.scopes[sk];
        if (!pv || S.score > pv.score) {
          p.scopes[sk] = { score: S.score, items: itemsEarned, label: S.scope.label,
            division: S.division, scope: S.scope.key };
        }
      }
      // per-run history for the progress charts (accuracy over time per category)
      p.history = p.history || [];
      p.history.push({
        t: Date.now(), d: S.division, k: S.scope.key,
        l: (S.scope.key === "overall" ? "Full Quest" : S.scope.label),
        a: acc, s: S.score, won: !!won,
      });
      if (p.history.length > 300) p.history = p.history.slice(-300);
      p.lastPlayed = Date.now();
      saveStore();
    }
    pushToCloud(p);
    if (won) sndWin();
    show("end");
  }

  /* ---------- util ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  // convert **bold** (used in cross-reference / theme questions) to <strong>
  function mdInline(s) {
    return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  /* ============================================================
     CLOUD SYNC UI
     ============================================================ */
  let CLOUD_INDEX = { scholars: {} };

  function updateCloudStatus() {
    const st = $("cloudStatus");
    if (Cloud.hasToken()) {
      st.textContent = "☁ Saving on — this device syncs scores to the cloud";
      st.className = "cloud-status on";
      $("cloudSetupBtn").textContent = "Saving settings";
    } else {
      st.textContent = "☁ Viewing shared scores · saving off on this device";
      st.className = "cloud-status off";
      $("cloudSetupBtn").textContent = "Enable saving";
    }
    $("cloudDisconnectBtn").hidden = !Cloud.hasToken();
  }
  function setupCloudUI() {
    $("cloudHelpLink").href = Cloud.tokenPageUrl;
    $("cloudSetupBtn").addEventListener("click", () => {
      const s = $("cloudSetup"); s.hidden = !s.hidden;
    });
    $("cloudConnectBtn").addEventListener("click", async () => {
      const input = $("cloudTokenInput"), msg = $("cloudMsg");
      const tok = input.value.trim();
      if (!tok) return;
      msg.hidden = false; msg.className = "cloud-msg"; msg.textContent = "Checking…";
      try {
        await Cloud.connect(tok);
        input.value = "";
        msg.className = "cloud-msg ok";
        msg.textContent = "Connected. Scores finished on this device will be saved to the cloud.";
        updateCloudStatus();
      } catch (e) {
        msg.className = "cloud-msg err"; msg.textContent = e.message || "Could not connect.";
      }
    });
    $("cloudDisconnectBtn").addEventListener("click", () => {
      Cloud.clearToken(); updateCloudStatus();
      const msg = $("cloudMsg");
      msg.hidden = false; msg.className = "cloud-msg"; msg.textContent = "Saving turned off on this device.";
    });
    $("lbScope").addEventListener("change", (e) => { LB_SCOPE = e.target.value; renderLeaderboard(); });
    updateCloudStatus();
  }
  async function loadLeaderboard() {
    try { CLOUD_INDEX = await Cloud.getIndex(); } catch (e) { CLOUD_INDEX = { scholars: {} }; }
    renderLeaderboard();
    renderProfiles();
  }
  let LB_SCOPE = "overall";      // which board is being viewed
  function bestOverall(summary) {
    let best = { score: -1, div: null };
    const b = summary.best || {};
    for (const d in b) if (b[d].score > best.score) best = { score: b[d].score, div: d };
    return best;
  }
  // gather the distinct subcategory boards that have any recorded scores
  function collectScopes() {
    const scholars = (CLOUD_INDEX && CLOUD_INDEX.scholars) || {};
    const seen = {};
    Object.keys(scholars).forEach((slug) => {
      const sc = scholars[slug].scopes || {};
      Object.keys(sc).forEach((k) => { if (!seen[k]) seen[k] = { key: k, label: sc[k].label, division: sc[k].division }; });
    });
    return Object.values(seen).sort((a, b) =>
      (a.division || "").localeCompare(b.division || "") || (a.label || "").localeCompare(b.label || ""));
  }
  function renderScopeSelect() {
    const sel = $("lbScope");
    if (!sel) return;
    const scopes = collectScopes();
    const opts = ['<option value="overall">Overall (all runs)</option>'];
    scopes.forEach((s) =>
      opts.push(`<option value="${escapeHtml(s.key)}">${escapeHtml(cap(s.division) + " · " + s.label)}</option>`));
    sel.innerHTML = opts.join("");
    if ([...sel.options].some((o) => o.value === LB_SCOPE)) sel.value = LB_SCOPE; else LB_SCOPE = "overall";
    sel.style.display = scopes.length ? "" : "none";
  }
  function renderLeaderboard() {
    $("leaderboardCard").hidden = false;
    renderScopeSelect();
    const list = $("lbList");
    const scholars = (CLOUD_INDEX && CLOUD_INDEX.scholars) || {};
    let rows;
    if (LB_SCOPE === "overall") {
      rows = Object.keys(scholars).map((slug) => {
        const s = scholars[slug], bo = bestOverall(s);
        return { name: s.name || slug, score: bo.score, tag: bo.div ? cap(bo.div) : "" };
      });
    } else {
      rows = Object.keys(scholars).map((slug) => {
        const s = scholars[slug], e = (s.scopes || {})[LB_SCOPE];
        return e ? { name: s.name || slug, score: e.score, tag: e.items != null ? e.items + "/" + TOTAL_ITEMS : "" } : null;
      }).filter(Boolean);
    }
    rows = rows.filter((r) => r.score >= 0).sort((a, b) => b.score - a.score).slice(0, 8);
    if (rows.length === 0) {
      list.innerHTML = `<li class="lb-empty">No saved scores yet — enable saving and finish a run to appear here.</li>`;
      return;
    }
    list.innerHTML = rows.map((r, i) =>
      `<li class="lb-row"><span class="lb-rank">${i + 1}</span>` +
      `<span class="lb-name">${escapeHtml(r.name)}</span>` +
      `<span class="lb-div">${escapeHtml(r.tag)}</span>` +
      `<span class="lb-score">${r.score}</span></li>`
    ).join("");
  }
  function pushToCloud(p) {
    const el = $("endCloud");
    if (!p) { el.textContent = ""; return; }
    if (!Cloud.hasToken()) {
      el.className = "end-cloud info";
      el.textContent = "Saved on this device. Turn on cloud saving at home to share your scores.";
      return;
    }
    el.className = "end-cloud info"; el.textContent = "Saving to the cloud…";
    const forCloud = Object.assign({ name: S.profile }, p, { name: S.profile });
    const slug = Cloud.slugify(S.profile);
    const summary = { name: S.profile, best: p.best, scopes: p.scopes || {}, runs: p.runs, updatedAt: Date.now() };
    Cloud.saveProfile(slug, forCloud, summary).then(() => {
      el.className = "end-cloud ok";
      el.textContent = "✔ Saved to the cloud — other browsers can see it now.";
    }).catch((e) => {
      el.className = "end-cloud err";
      el.textContent = "Couldn't save to the cloud: " + (e.message || "error") + " (kept on this device).";
    });
  }

  /* ============================================================
     CUSTOM RUN BUILDER
     ============================================================ */
  function defaultFilters(div) {
    return {
      cats: new Set(QM.categories(div).map((c) => c.key)),
      chapters: new Set(QM.chapters(div)),
      summary: "all",
      refs: new Set(),
    };
  }
  function toggleChip(set, key, btn) {
    if (set.has(key)) { set.delete(key); btn.classList.remove("on"); }
    else { set.add(key); btn.classList.add("on"); }
  }
  function renderCustomBuilder(div) {
    if (!div) return;
    S.filters = defaultFilters(div);

    const catBox = $("catChips"); catBox.innerHTML = "";
    QM.categories(div).forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "fchip on"; b.textContent = c.name; b.dataset.cat = c.key;
      b.addEventListener("click", () => { toggleChip(S.filters.cats, c.key, b); afterFilterChange(); });
      catBox.appendChild(b);
    });

    const chs = QM.chapters(div);
    $("chapterGroup").style.display = chs.length ? "" : "none";
    const chBox = $("chapterChips"); chBox.innerHTML = "";
    chs.forEach((ch) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "fchip on"; b.textContent = ch; b.dataset.ch = ch;
      b.addEventListener("click", () => { toggleChip(S.filters.chapters, ch, b); afterFilterChange(); });
      chBox.appendChild(b);
    });

    $("summarySeg").querySelectorAll(".seg-btn").forEach((x) =>
      x.classList.toggle("selected", x.dataset.sum === "all"));

    const list = $("refsList"); list.innerHTML = "";
    QM.references(div).forEach(({ ref, count }) => {
      const row = document.createElement("label");
      row.className = "ref-item"; row.dataset.ref = ref.toLowerCase();
      row.innerHTML = `<input type="checkbox"><span class="rn">${escapeHtml(ref)}</span><span class="rc">${count}</span>`;
      row.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) S.filters.refs.add(ref); else S.filters.refs.delete(ref);
        afterFilterChange();
      });
      list.appendChild(row);
    });
    $("refSearch").value = "";
    afterFilterChange();
  }
  function afterFilterChange() {
    if (S.mode !== "custom" || !S.division) { $("filterCount").textContent = ""; return; }
    const n = QM.count(S.division, S.filters);
    const el = $("filterCount");
    el.textContent = n ? `${n} question${n === 1 ? "" : "s"} match your filters` : "No questions match — widen your filters";
    el.classList.toggle("zero", n === 0);
    refreshStart();
  }
  function selectAllChips(boxId, set, dataKey) {
    const chips = Array.from($(boxId).children);
    const allOn = chips.every((c) => c.classList.contains("on"));
    chips.forEach((c) => {
      const key = c.dataset[dataKey];
      if (allOn) { set.delete(key); c.classList.remove("on"); }
      else { set.add(key); c.classList.add("on"); }
    });
    afterFilterChange();
  }
  function setupCustomUI() {
    $("modes").querySelectorAll(".mode-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        S.mode = tab.dataset.mode;
        $("modes").querySelectorAll(".mode-tab").forEach((t) => t.classList.toggle("selected", t === tab));
        const custom = S.mode === "custom";
        $("customBuilder").hidden = !custom;
        $("startBtn").textContent = custom ? "Begin Custom Run" : "Begin the Quest";
        if (custom) {
          if (S.division) renderCustomBuilder(S.division);
          else $("filterCount").textContent = "Choose a division above to build your run.";
        }
        refreshStart();
      });
    });
    $("catsAll").addEventListener("click", () => selectAllChips("catChips", S.filters.cats, "cat"));
    $("chaptersAll").addEventListener("click", () => selectAllChips("chapterChips", S.filters.chapters, "ch"));
    $("summarySeg").querySelectorAll(".seg-btn").forEach((b) => {
      b.addEventListener("click", () => {
        S.filters.summary = b.dataset.sum;
        $("summarySeg").querySelectorAll(".seg-btn").forEach((x) => x.classList.toggle("selected", x === b));
        afterFilterChange();
      });
    });
    $("refsToggle").addEventListener("click", () => {
      const p = $("refsPanel"), willOpen = p.hidden;
      p.hidden = !willOpen;
      $("refsToggle").setAttribute("aria-expanded", String(willOpen));
    });
    $("refSearch").addEventListener("input", () => {
      const q = $("refSearch").value.trim().toLowerCase();
      $("refsList").querySelectorAll(".ref-item").forEach((it) => {
        it.style.display = it.dataset.ref.includes(q) ? "" : "none";
      });
    });
    $("refsClear").addEventListener("click", () => {
      if (S.filters) S.filters.refs.clear();
      $("refsList").querySelectorAll("input").forEach((cb) => (cb.checked = false));
      afterFilterChange();
    });
  }

  /* ============================================================
     PROGRESS CHARTS  (per-category accuracy over time)
     ============================================================ */
  function openProgress() {
    if (!S.profile) return;
    $("progTitle").textContent = S.profile + " — Progress";
    renderProgressScopes();
    show("progress");
  }
  function progressGroups() {
    const p = curProfile();
    const h = (p && p.history) || [];
    const groups = {};
    h.forEach((r) => {
      const key = r.d + "::" + r.k;
      (groups[key] = groups[key] || { label: r.l, div: r.d, runs: [] }).runs.push(r);
    });
    return groups;
  }
  function renderProgressScopes() {
    const sel = $("progScope"), groups = progressGroups();
    const keys = Object.keys(groups).sort((a, b) => groups[b].runs.length - groups[a].runs.length);
    if (keys.length === 0) {
      sel.innerHTML = ""; sel.style.display = "none";
      $("progEmpty").hidden = false; $("progChart").innerHTML = ""; $("progSummary").textContent = "";
      return;
    }
    $("progEmpty").hidden = true; sel.style.display = "";
    sel.innerHTML = keys.map((k) =>
      `<option value="${escapeHtml(k)}">${escapeHtml(cap(groups[k].div) + " · " + groups[k].label)} (${groups[k].runs.length})</option>`
    ).join("");
    drawProgress(sel.value);
  }
  function drawProgress(fullKey) {
    const g = progressGroups()[fullKey];
    if (!g) return;
    const runs = g.runs.slice().sort((a, b) => a.t - b.t);
    const accs = runs.map((r) => r.a);
    const best = Math.max.apply(null, accs), latest = accs[accs.length - 1];
    const first = accs[0];
    const trend = runs.length > 1 ? (latest - first >= 0 ? "▲ +" + (latest - first) : "▼ " + (latest - first)) + "% since first" : "first run";
    $("progSummary").innerHTML =
      `Best <b>${best}%</b> · Latest <b>${latest}%</b> · ${runs.length} run${runs.length > 1 ? "s" : ""}` +
      ` · <b>${100 - latest}%</b> to mastery · ${trend}`;
    $("progChart").innerHTML = lineChartSVG(runs);
  }
  function lineChartSVG(runs) {
    const W = 640, H = 320, padL = 42, padR = 22, padT = 26, padB = 34;
    const n = runs.length;
    const x = (i) => n <= 1 ? padL + (W - padL - padR) / 2 : padL + (W - padL - padR) * (i / (n - 1));
    const y = (v) => padT + (H - padT - padB) * (1 - v / 100);
    let g = "";
    [0, 25, 50, 75, 100].forEach((v) => {
      const yy = y(v);
      if (v !== 100) g += `<line class="grid" x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}"/>`;
      g += `<text class="ylab" x="${padL - 8}" y="${yy + 4}">${v}</text>`;
    });
    // prominent 100% mastery target
    g += `<line class="target" x1="${padL}" y1="${y(100)}" x2="${W - padR}" y2="${y(100)}"/>` +
         `<text class="tlab" x="${W - padR}" y="${y(100) - 6}" text-anchor="end">100% — mastery</text>`;
    const pts = runs.map((r, i) => [x(i), y(r.a)]);
    // area under the line
    let area = `M ${pts[0][0]} ${y(0)} ` + pts.map((p) => `L ${p[0]} ${p[1]}`).join(" ") +
               ` L ${pts[pts.length - 1][0]} ${y(0)} Z`;
    g += `<path class="area" d="${area}"/>`;
    // the line
    g += `<path class="pline" d="${pts.map((p, i) => (i ? "L" : "M") + ` ${p[0]} ${p[1]}`).join(" ")}"/>`;
    // points; emphasise the latest
    pts.forEach((p, i) => {
      const last = i === pts.length - 1;
      g += `<circle class="pt${last ? " last" : ""}" cx="${p[0]}" cy="${p[1]}" r="${last ? 5 : 3.5}"/>`;
      if (last) g += `<text class="ptlab" x="${p[0]}" y="${p[1] - 11}" text-anchor="middle">${runs[i].a}%</text>`;
    });
    const fmt = (t) => { const d = new Date(t); return (d.getMonth() + 1) + "/" + d.getDate(); };
    g += `<text class="xlab" x="${x(0)}" y="${H - 12}" text-anchor="start">${fmt(runs[0].t)}</text>`;
    if (n > 1) g += `<text class="xlab" x="${x(n - 1)}" y="${H - 12}" text-anchor="end">${fmt(runs[n - 1].t)}</text>`;
    return `<svg class="linechart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Accuracy over time">${g}</svg>`;
  }

  /* ---------- wire up ---------- */
  $("startBtn").addEventListener("click", startGame);
  $("progressBtn").addEventListener("click", openProgress);
  $("endProgressBtn").addEventListener("click", openProgress);
  $("progBack").addEventListener("click", () => { show("start"); refreshStart(); });
  $("progScope").addEventListener("change", (e) => drawProgress(e.target.value));
  $("quitBtn").addEventListener("click", () => {
    S.ended = true; clearInterval(S.timer); clearInterval(S.runTimer);
    show("start"); refreshStart();
  });
  $("againBtn").addEventListener("click", startGame);
  $("homeBtn").addEventListener("click", () => { show("start"); refreshStart(); });

  document.addEventListener("keydown", (e) => {
    if (!screens.game.classList.contains("is-active") || S.answered) return;
    const k = e.key.toUpperCase();
    const map = { A: 0, B: 1, C: 2, D: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
    if (k in map) {
      const btn = $("answers").children[map[k]];
      if (btn) btn.click();
    }
  });

  renderStart();
  refreshStart();
  setupCustomUI();
  setupCloudUI();
  loadLeaderboard();
})();
