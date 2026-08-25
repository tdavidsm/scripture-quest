/* ============================================================
   Scripture Quest — cloud sync
   ------------------------------------------------------------
   Shared, cross-browser scholars stored as files in this repo's
   `data` branch:
       index.json            — leaderboard / directory of scholars
       profiles/<slug>.json   — one scholar's full saved data

   READS are public (raw.githubusercontent.com) and need no token.
   WRITES use the GitHub REST API, authorized by a fine-grained
   token the player pastes once; it is kept only in this browser
   (localStorage) and is never written into the repo.
   ============================================================ */
window.Cloud = (function () {
  "use strict";

  const BRANCH = "data";
  const TOKEN_KEY = "scripture-quest-gh-token";

  // owner/repo — derived from the Pages URL so forks work; falls back
  // to the original repo when running locally.
  function detectRepo() {
    const m = location.hostname.match(/^([^.]+)\.github\.io$/);
    if (m) {
      const seg = location.pathname.split("/").filter(Boolean)[0];
      if (seg) return m[1] + "/" + seg;
    }
    return "tdavidsm/scripture-quest";
  }
  const REPO = detectRepo();

  /* ---------- token ---------- */
  function getToken() { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } }
  function setToken(t) { try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {} }
  function clearToken() { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {} }
  function hasToken() { return !!getToken(); }

  function authHeaders() {
    return {
      "Authorization": "Bearer " + getToken(),
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  /* ---------- helpers ---------- */
  function slugify(name) {
    return (name || "").toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scholar";
  }
  function b64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- reads via the contents API ----------
     Always fresh (unlike the ~5-min raw CDN cache) and CORS-enabled.
     Works with no token (60 requests/hr per IP) or with one (5000/hr). */
  function readHeaders() {
    const h = { "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (hasToken()) h["Authorization"] = "Bearer " + getToken();
    return h;
  }
  function decodeB64Json(content) {
    const bin = atob(content.replace(/\n/g, ""));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function readJson(path) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`,
      { headers: readHeaders(), cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("read failed " + res.status);
    return decodeB64Json((await res.json()).content);
  }
  async function getIndex() {
    try { const j = await readJson("index.json"); return j && j.scholars ? j : { scholars: {} }; }
    catch (e) { return { scholars: {} }; }
  }
  async function getProfile(slug) {
    const j = await readJson("profiles/" + slug + ".json");
    if (!j) throw new Error("not found");
    return j;
  }

  /* ---------- authenticated API reads/writes ---------- */
  async function apiGetFile(path) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`,
      { headers: authHeaders(), cache: "no-store" }
    );
    if (res.status === 404) return { sha: null, json: null };
    if (!res.ok) throw new Error("api get " + path + " -> " + res.status);
    const j = await res.json();
    return { sha: j.sha, json: decodeB64Json(j.content) };
  }
  async function apiPutFile(path, obj, message, sha) {
    const body = { message, content: b64(JSON.stringify(obj, null, 1)), branch: BRANCH };
    if (sha) body.sha = sha;
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, authHeaders()),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      const err = new Error("save failed (" + res.status + ")");
      err.status = res.status; err.detail = t;
      throw err;
    }
    return res.json();
  }

  /* verify a token can reach the repo (metadata read) */
  async function connect(token) {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json" },
    });
    if (res.status === 401) throw new Error("Token was rejected. Check you copied it correctly.");
    if (res.status === 404) throw new Error("Token can't see this repo. Give it access to " + REPO + ".");
    if (!res.ok) throw new Error("Could not verify token (" + res.status + ").");
    setToken(token);
    return true;
  }

  /* write one scholar's profile + upsert their leaderboard entry */
  async function saveProfile(slug, profile, summary) {
    if (!hasToken()) throw new Error("No token connected.");
    // 1) the profile file (last-write-wins on its own file)
    let existingSha = null;
    try { existingSha = (await apiGetFile("profiles/" + slug + ".json")).sha; } catch (e) {}
    await apiPutFile("profiles/" + slug + ".json", profile, `Save scholar: ${profile.name}`, existingSha);

    // 2) upsert into index.json, retrying on concurrent-write conflicts
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const cur = await apiGetFile("index.json");
        const index = cur.json || { scholars: {} };
        index.scholars = index.scholars || {};
        index.scholars[slug] = summary;
        index.updatedAt = Date.now();
        await apiPutFile("index.json", index, `Update leaderboard: ${profile.name}`, cur.sha);
        return;
      } catch (e) {
        if (e.status === 409 && attempt < 3) { await sleep(400 * (attempt + 1)); continue; }
        throw e;
      }
    }
  }

  return {
    repo: REPO, branch: BRANCH,
    slugify, hasToken, getToken, clearToken, connect,
    getIndex, getProfile, saveProfile,
    tokenPageUrl: "https://github.com/settings/personal-access-tokens/new",
  };
})();
