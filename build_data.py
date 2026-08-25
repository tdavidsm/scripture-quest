#!/usr/bin/env python3
"""Parse the National Bible Bee passage test-bank markdown files into the game's
question data (assets/data.js -> window.QUIZ_DATA).

Usage:  python3 build_data.py
"""
import re, json, os

BANKS = {
    "primary": "Primary_Passages_Test_Bank.md",
    "junior":  "Junior_Passages_Test_Bank.md",
    "senior":  "Senior_Passages_Test_Bank.md",
}

def clean(s):
    # normalise the non-breaking hyphen used in answer keys
    return s.replace("‑", "-").strip()

def parse(path):
    lines = open(path, encoding="utf-8").read().splitlines()
    sets, keys, cur, i = {}, {}, None, 0
    qmark   = re.compile(r"^\*\*(\d+)\.\*\*\s*(.*)$")
    setmark = re.compile(r"^#\s*SET\s+(\d+)", re.I)
    keymark = re.compile(r"Answer key\s*[—-]\s*SET\s+(\d+)\s*:\s*(.*)$", re.I)
    while i < len(lines):
        line = lines[i]
        ms = setmark.match(line)
        if ms:
            cur = int(ms.group(1)); sets.setdefault(cur, []); i += 1; continue
        mk = keymark.search(line)
        if mk:
            s = int(mk.group(1)); d = {}
            for pair in clean(mk.group(2)).split(","):
                m2 = re.search(r"(\d+)-([A-D])", clean(pair))   # search, not match:
                if m2:                                          # first pair is bolded
                    d[int(m2.group(1))] = m2.group(2)
            keys[s] = d; i += 1; continue
        mq = qmark.match(line)
        if mq and cur is not None:
            qnum = int(mq.group(1)); qtext = mq.group(2).strip()
            j = i + 1
            while j < len(lines) and lines[j].strip() == "":
                j += 1
            optline = lines[j] if j < len(lines) else ""
            parts = re.split(r"\s*(?:^|\s)([A-D])\)\s*", optline)
            opts = {}
            for k in range(1, len(parts) - 1, 2):
                opts[parts[k]] = parts[k + 1].strip()
            sets[cur].append({"num": qnum, "q": qtext, "opts": opts})
            i = j + 1; continue
        i += 1
    out = []
    for s, ql in sets.items():
        kd = keys.get(s, {})
        for q in ql:
            L = kd.get(q["num"])
            if not L or set(q["opts"].keys()) != {"A", "B", "C", "D"}:
                continue
            order = ["A", "B", "C", "D"]
            out.append({"q": q["q"], "o": [q["opts"][x] for x in order],
                        "a": order.index(L), "s": s})
    return out, (max(sets) if sets else 0)

def main():
    here = os.path.dirname(os.path.abspath(__file__))
    data, meta = {}, {}
    for div, fname in BANKS.items():
        qs, maxset = parse(os.path.join(here, fname))
        data[div] = qs
        meta[div] = {"sets": maxset, "count": len(qs)}
        print(f"{div:8s} {len(qs):5d} questions across {maxset} sets")
    payload = {"meta": meta, "data": data}
    js = "window.QUIZ_DATA=" + json.dumps(payload, ensure_ascii=False,
                                          separators=(",", ":")) + ";"
    out_path = os.path.join(here, "assets", "data.js")
    open(out_path, "w", encoding="utf-8").write(js)
    print(f"wrote {out_path} ({len(js):,} bytes, "
          f"{sum(len(v) for v in data.values())} questions total)")

if __name__ == "__main__":
    main()
