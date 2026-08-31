/* ============================================================
   Scripture Quest — question metadata & filtering (Custom Run)
   Exposes window.QM.
   ============================================================ */
window.QM = (function () {
  "use strict";

  const CAT_NAMES = {
    random: "Random Access",
    xref: "Cross-References",
    commandments: "Ten Commandments",
    theme: "Theme of the Passage",
    geo: "Geographical Location",
    names: "Names & Titles of God",
    feasts: "Jewish Feasts",
    unique: "Unique Words",
    words3: "Words in 3–4 Passages",
    words2: "Words in Exactly Two Passages",
    // new (from the Distinctive Words / Direct Quotes workbooks)
    words: "Distinctive Words",
    parallel: "Parallel Passages",
    sectitle: "Section Titles",
    declaw: "Decalogue & OT Legal",
    other: "Other",
  };
  const CAT_ORDER = ["random", "xref", "commandments", "theme", "geo", "names",
    "feasts", "unique", "words3", "words2",
    "words", "parallel", "sectitle", "declaw", "other"];

  // "1 Corinthians 6:10", "Song of Solomon 2:1", "Matthew 5:4"
  const REF_G = /((?:[1-3]\s)?[A-Z][a-z]+(?:\sof\s[A-Z][a-z]+)?)\s(\d+):\d+/g;
  const REF_1 = /((?:[1-3]\s)?[A-Z][a-z]+(?:\sof\s[A-Z][a-z]+)?)\s(\d+):\d+/;

  const setMeta = (div) => (window.QUIZ_DATA.meta[div].setMeta || {});
  // new (xlsx) questions carry their category directly on q.c; markdown ones
  // resolve it from their set number via setMeta.
  const catOf = (div, q) => q.c || ((setMeta(div)[q.s] || {}).c) || "other";

  // caches keyed by question object
  const _refs = new WeakMap();
  const _chap = new WeakMap();

  function refsOf(q) {
    if (_refs.has(q)) return _refs.get(q);
    const hay = q.q + " " + q.o.join("  ");
    const set = new Set();
    let m;
    REF_G.lastIndex = 0;
    while ((m = REF_G.exec(hay))) set.add(m[1] + " " + m[2]);
    const arr = Array.from(set);
    _refs.set(q, arr);
    return arr;
  }
  // the study chapter a question belongs to. New (xlsx) questions carry it on
  // q.ch; random-access questions derive it from their options (all one chapter,
  // precise even for the "Mixed" set); other markdown questions have no chapter.
  function chapterOf(div, q) {
    if (q.ch) return q.ch;
    if (catOf(div, q) !== "random") return null;
    if (_chap.has(q)) return _chap.get(q);
    let ch = null;
    for (const opt of q.o) { const m = REF_1.exec(opt); if (m) { ch = m[1] + " " + m[2]; break; } }
    if (!ch) { const sm = setMeta(div)[q.s]; ch = sm && sm.ch ? sm.ch : null; }
    _chap.set(q, ch);
    return ch;
  }
  const COMMAND_SUM = /Commandment\s*#\d+\s*[—–-]/;
  function hasSummary(q) { return COMMAND_SUM.test(q.q); }

  /* ---- available filter values for a division ---- */
  function categories(div) {
    const present = new Set();
    for (const s in setMeta(div)) present.add(setMeta(div)[s].c);
    window.QUIZ_DATA.data[div].forEach((q) => { if (q.c) present.add(q.c); });
    return CAT_ORDER.filter((c) => present.has(c)).map((c) => ({ key: c, name: CAT_NAMES[c] }));
  }
  function chapters(div) {
    const set = new Set();
    window.QUIZ_DATA.data[div].forEach((q) => { const c = chapterOf(div, q); if (c) set.add(c); });
    return Array.from(set).sort(sortRef);
  }
  function references(div) {
    const counts = {};
    window.QUIZ_DATA.data[div].forEach((q) => {
      refsOf(q).forEach((r) => { counts[r] = (counts[r] || 0) + 1; });
    });
    return Object.keys(counts).sort(sortRef).map((r) => ({ ref: r, count: counts[r] }));
  }
  function sortRef(a, b) {
    const pa = a.match(/^(.*)\s(\d+)$/), pb = b.match(/^(.*)\s(\d+)$/);
    const ba = pa ? pa[1] : a, bb = pb ? pb[1] : b;
    if (ba !== bb) return ba.localeCompare(bb);
    return (pa ? +pa[2] : 0) - (pb ? +pb[2] : 0);
  }

  /* ---- matching / filtering ---- */
  // filters = { cats:Set, chapters:Set, summary:"all"|"with"|"without", refs:Set }
  function matches(div, q, f) {
    const cat = catOf(div, q);
    // types & chapters use explicit selection (a chip must be ON to pass);
    // references are additive (empty set = no restriction).
    if (f.cats && !f.cats.has(cat)) return false;
    // chapter filter gates any question that has a chapter (random-access and the
    // per-chapter workbook questions); chapterless questions are unaffected.
    if (f.chapters) {
      const ch = chapterOf(div, q);
      if (ch != null && !f.chapters.has(ch)) return false;
    }
    if (cat === "commandments" && f.summary && f.summary !== "all") {
      const has = hasSummary(q);
      if (f.summary === "with" && !has) return false;
      if (f.summary === "without" && has) return false;
    }
    if (f.refs && f.refs.size) {
      if (!refsOf(q).some((r) => f.refs.has(r))) return false;
    }
    return true;
  }
  function filterPool(div, f) {
    return window.QUIZ_DATA.data[div].filter((q) => matches(div, q, f));
  }
  function count(div, f) { return filterPool(div, f).length; }

  return {
    CAT_NAMES, catName: (c) => CAT_NAMES[c] || c,
    catOf, chapterOf, refsOf, hasSummary,
    categories, chapters, references,
    matches, filterPool, count,
  };
})();
