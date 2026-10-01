# Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the whole frontend into a clean, monochrome design with a near-black accent, Geist type, and shared UI components, while keeping routes, data flow, and the app's existing stack.

**Architecture:**
- Semantic design tokens (CSS variables in `src/index.css`, exposed through `tailwind.config.js`) feed a small component set in `src/components/ui/`.
- Each page is then rebuilt on those components, and the legacy purple tokens are deleted last.
- Verification uses Playwright scripts, kept in a scratchpad folder and not committed, run against the Vite dev server with the existing mock data. A throwaway `gallery/` page, excluded from git, renders components that have no route of their own.

**Tech Stack:** React 18.3 + TypeScript, Vite 5, Tailwind CSS 3.4 (PostCSS), React Router 6, MUI icons v6 (`@mui/icons-material`), react-icons v5. Checks use the `playwright` package that is already installed.

**Spec:** `docs/superpowers/specs/2026-09-30-frontend-redesign-design.md`. Read the spec's **Amendments** section too; it overrides the sections above it.

## Global Constraints

**Stack and dependencies**
- Use only the existing stack. **No packages added or removed**, and `package.json` / `package-lock.json` are never modified.

**Tokens and styling**
- **Token values:** `canvas` #F7F6F4, `surface` #FFFFFF, `surface-muted` #F1F0ED, `hairline` #E7E5E1, `hairline-strong` #D6D3CE, `ink` #18181B, `ink-secondary` #52525B, `ink-muted` **#6B6B73**, `positive` #15803D / `positive-bg` #ECFDF3, `warning` #B45309 / `warning-bg` #FFF7ED, `danger` #B91C1C / `danger-bg` #FEF2F2.
- **Accent:** `linear-gradient(180deg, #3F3F46 0%, #18181B 100%)` with white text. Used only on the active nav tab and on primary buttons.
- **Root font size:** stays 14px, so Tailwind rem units are 14px-based. Every pixel value from the spec must use a named token (`text-body`, `h-nav`, `rounded-control`, …) or an arbitrary value (`h-[40px]`), never a rem utility that only approximates it.
- **Fonts:** `font-sans` = Geist, `font-mono` = Geist Mono. Type tokens: `text-display` 36px, `text-title` 28px, `text-heading` 18px, `text-card-title` 17px, `text-body` 14px, `text-small` 13px, `text-meta` 12px.
- **Colors in touched files:** tokens only. No raw `gray-*`, `purple-*`, `violet-*`, `blue-*`, `red-*`, `pink-*`, or `green-*` classes (`text-white` is fine).
- **Accessibility:** interactive elements get `focus-visible:ring-2 focus-visible:ring-ink` (plus `ring-offset-2` where there's room).

**Icons**
- Keep existing glyphs from their current libraries. Any new icon is an MUI Outlined icon (or the MUI names listed in a task).
- Always size icons in pixels: `sx={{ fontSize: N }}` for MUI, `size={N}` for react-icons.

**Scope**
- **Never modify:** `src/pages/MainPage.tsx`, any `*.stories.tsx` file, `package.json`, or the auth-bypass lines in `src/App.tsx`.
- **Behavior changes allowed:** only these five.
  - the `/` search shortcut;
  - professor-name links on the detail page;
  - the search result count;
  - the "Clear all" chip action;
  - the Paid/Unpaid matching fix.
  
  All other logic (fetching, state, handlers) is copied unchanged.

**Git**
- Stage files **by explicit path only**. Never `git add -A`, `git add .`, or `git commit -a`.
- **Never stage `src/data/devMockProfessors.ts`.** `src/pages/ProfessorProfile.tsx` is staged only via the special procedure in Task 7.
- Never push.
- **Commit message style:** a short imperative sentence (e.g. "Add design tokens and Geist fonts"), a blank line, one "why" line, a blank line, then `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Tooling**
- The Write tool requires that you Read an existing file before overwriting it.
- **Checks directory:** `CHECKS=C:/Users/Bryan/AppData/Local/Temp/claude/c--Users-Bryan-Downloads-CMU-Research/5ac71def-0bf8-4853-b02a-78debe604ff1/scratchpad/redesign-checks`. Shell state does not persist between Bash calls, so **start every Bash command that uses `$CHECKS` with `CHECKS=<that path>;`**. Commands below write this as `CHECKS=...;`, which always means that full assignment.
- **Working directory:** the repo root is `C:/Users/Bryan/Downloads/CMU Research/ResearchStarter`. Use absolute paths or stay in the root, and never leave the shell `cd`'d elsewhere.
- **Dev server:** `http://127.0.0.1:5173`, started with `npm run dev -- --port 5173 --strictPort --host 0.0.0.0`. It must bind `0.0.0.0`, because by default Vite binds only IPv6 `::1`, which Playwright's Chromium cannot reach.
- **Flaky first run:** if a check fails with "Execution context was destroyed" or a navigation error right after you add a new icon import, Vite re-optimized its dependencies and reloaded the page. Rerun the check once.

## Review Focus

These are the input cases the spec implies but doesn't spell out. Each one gets a test in the owning task:

1. **Very long titles, names, and many tags** (Task 5): cards wrap or truncate and never overflow horizontally, and they show at most 3 tags.
2. **Opportunity records missing optional fields** (no date, pay, college, position, or description) (Task 3 `MetaRow`, Task 5 card): no dangling "·" separators, no empty badges, and never the text "undefined".
3. **Keyboard-only filtering** (Task 5): Tab reaches each visually hidden native checkbox, Space toggles it, and a focus ring is visible on the custom box.
4. **Nav hides and shows while the results list scrolls** (Task 5): the filter panel and results column follow the nav: `top: 0` when it is hidden, `top: 56px` when it is shown.
5. **Muted metadata text on the off-white canvas** (Task 2): meets 4.5:1 contrast. This is why `ink-muted` is #6B6B73 and not the spec's original #71717A, which measures 4.48:1 on canvas.

---

### Task 1: Check harness, gallery scaffold, and baselines

This task creates the verification tools and records "before" baselines. **Nothing is committed.**

**Files:**
- Create: `$CHECKS/lib.cjs`, `$CHECKS/run.sh`, `$CHECKS/verify.sh`, `$CHECKS/shoot.cjs` (scratchpad, outside the repo)
- Create: `gallery/index.html`, `gallery/main.tsx` (in the repo, git-excluded)
- Modify: `.git/info/exclude`

**Interfaces:**
- Produces:
  - `withPage(route, fn)`, `check(name, cond, detail)`, `done()` from `$CHECKS/lib.cjs`.
  - `bash "$CHECKS/run.sh" <name> [args]`, which runs `$CHECKS/<name>.cjs`.
  - `bash "$CHECKS/verify.sh"`, which runs the type check, lint, and build and compares them against the baselines.
  - The gallery page at `/gallery/index.html`, which renders `SignInPage` when the URL has `?view=signin` and otherwise renders `<main>` sections. Later tasks add sections by replacing the anchor text `<p>Gallery</p>`.

- [ ] **Step 1: Confirm the starting state**

Run: `git branch --show-current && git status --short`
Expected: `frontend-redesign`, then exactly these two lines (the user's uncommitted dev mocks, which must stay that way):
```
 M src/pages/ProfessorProfile.tsx
?? src/data/devMockProfessors.ts
```

- [ ] **Step 2: Make sure the dev server is running**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5173/`
If the output is not `200`, start it with the Bash tool using `run_in_background: true`: `npm run dev -- --port 5173 --strictPort --host 0.0.0.0`. Then rerun the curl until it prints `200`.

- [ ] **Step 3: Write `$CHECKS/lib.cjs`**

```js
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173';
let failures = 0;

function check(name, cond, detail = '') {
  if (cond) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${name}${detail ? `  -> ${detail}` : ''}`);
  }
}

async function withPage(route, fn) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  try {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('#root > *', { timeout: 60000 });
    await page.waitForTimeout(800);
    await fn(page);
  } catch (e) {
    check(`checks on ${route} ran to completion`, false, String(e.message).split('\n')[0]);
  } finally {
    check(`no uncaught page errors on ${route}`, pageErrors.length === 0, pageErrors.join(' | '));
    await browser.close();
  }
}

function done() {
  console.log(failures ? `\n${failures} check(s) FAILED` : '\nALL CHECKS PASSED');
  process.exit(failures ? 1 : 0);
}

module.exports = { BASE, check, withPage, done };
```

- [ ] **Step 4: Write `$CHECKS/run.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
NODE_PATH="C:/Users/Bryan/Downloads/CMU Research/ResearchStarter/node_modules" node "$DIR/$1.cjs" "${@:2}"
```

- [ ] **Step 5: Write `$CHECKS/verify.sh`**

ESLint in this repo only lints `.js`/`.jsx` files, so the type check is the main static check. Both checks are compared against baselines, so the existing errors (48 lint, 3 type) don't count.

```bash
#!/usr/bin/env bash
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "C:/Users/Bryan/Downloads/CMU Research/ResearchStarter"
export LC_ALL=C
status=0

tsc_src() {
  rm -rf dist
  npx tsc --noEmit -p . --ignoreDeprecations 6.0 2>&1 | grep "^src/" | grep -v "\.stories\.tsx" | sed -E 's/\([0-9]+,[0-9]+\)//' | sort
}

lint_errors() {
  npx eslint . --ignore-pattern "gallery/**" -f json 2>/dev/null | node -e '
let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  const out = [];
  for (const f of JSON.parse(s)) {
    const rel = f.filePath.replace(/\\/g, "/").split("/ResearchStarter/")[1];
    for (const m of f.messages) if (m.severity === 2) out.push(`${rel}: ${m.ruleId} ${m.message}`);
  }
  console.log(out.join("\n"));
});' | sort
}

if [ "${1:-}" = "--baseline" ]; then
  tsc_src > "$DIR/tsc-baseline-src.txt"
  lint_errors > "$DIR/lint-baseline-src.txt"
  echo "baseline: $(grep -c . "$DIR/tsc-baseline-src.txt") type errors, $(grep -c . "$DIR/lint-baseline-src.txt") lint errors"
  exit 0
fi

echo "== type check (src, excluding stories) =="
tsc_src > "$DIR/tsc-now.txt"
new_tsc=$(comm -13 "$DIR/tsc-baseline-src.txt" "$DIR/tsc-now.txt")
if [ -n "$new_tsc" ]; then echo "NEW TYPE ERRORS:"; echo "$new_tsc"; status=1; else echo "no new type errors"; fi

echo "== lint =="
lint_errors > "$DIR/lint-now.txt"
new_lint=$(comm -13 "$DIR/lint-baseline-src.txt" "$DIR/lint-now.txt")
if [ -n "$new_lint" ]; then echo "NEW LINT ERRORS:"; echo "$new_lint"; status=1; else echo "no new lint errors"; fi

echo "== build =="
if npm run build > "$DIR/build-now.txt" 2>&1; then echo "build OK"; else echo "BUILD FAILED"; tail -20 "$DIR/build-now.txt"; status=1; fi

exit $status
```

(`rm -rf dist` deletes only Vite's git-ignored build output. The build step recreates it. Without it, `tsc` would also type-check the huge bundled JS and take minutes.)

- [ ] **Step 6: Write `$CHECKS/shoot.cjs`**

```js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173';
const label = process.argv[2];
const only = process.argv[3];
if (!label) {
  console.error('usage: run.sh shoot <before|after> [routeName]');
  process.exit(2);
}

const routes = [
  ['search', '/'],
  ['info', '/info/mock-1'],
  ['professor', '/professor/ajones'],
  ['student-profile', '/dashboard'],
  ['professor-dashboard', '/professor-dashboard'],
  ['not-found', '/does-not-exist'],
  ['sign-in', '/gallery/index.html?view=signin'],
];

(async () => {
  const outDir = path.join(__dirname, 'shots', label);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const [name, route] of routes) {
    if (only && only !== name) continue;
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('#root > *', { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
    console.log(`shot ${label}/${name}.png`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 7: Create the gallery scaffold and exclude it from git**

`gallery/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>UI gallery</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

`gallery/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../src/index.css";
import SignInPage from "../src/pages/SignInPage";

const view = new URLSearchParams(window.location.search).get("view");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {view === "signin" ? (
      <SignInPage />
    ) : (
      <BrowserRouter>
        <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, display: "grid", gap: 40 }}>
          <p>Gallery</p>
        </main>
      </BrowserRouter>
    )}
  </StrictMode>
);
```

Run: `printf '\ngallery/\n' >> .git/info/exclude && git status --short`
Expected: still only the two dev-mock lines from Step 1, with no `gallery/`.

- [ ] **Step 8: Record baselines**

Run: `CHECKS=C:/Users/Bryan/AppData/Local/Temp/claude/c--Users-Bryan-Downloads-CMU-Research/5ac71def-0bf8-4853-b02a-78debe604ff1/scratchpad/redesign-checks; bash "$CHECKS/verify.sh" --baseline`
(Use a Bash timeout of 600000.)
Expected: `baseline: 3 type errors, 48 lint errors`. The 3 type errors are in `NavBar.tsx` (`isProfessor`), `PreviousExperiencesSection.tsx` (missing `endDate`), and `utils.ts`.

- [ ] **Step 9: Take "before" screenshots and look at them**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot before` (Bash timeout 600000)
Expected: seven `shot before/<name>.png` lines. Open `$CHECKS/shots/before/search.png` and `$CHECKS/shots/before/sign-in.png` with the Read tool and confirm they show the current purple UI, not a blank page or an error overlay.

---

### Task 2: Design tokens and fonts

**Files:**
- Modify: `tailwind.config.js` (full rewrite; legacy tokens stay until Task 10)
- Modify: `src/index.css` (full rewrite)
- Test: `$CHECKS/tokens.cjs`

**Interfaces:**
- Produces these Tailwind names, used by every later task:
  - **Colors:** `canvas`, `surface`, `surface-muted`, `hairline`, `hairline-strong`, `ink`, `ink-secondary`, `ink-muted`, `positive`, `positive-bg`, `warning`, `warning-bg`, `danger`, `danger-bg`.
  - **Font sizes:** `text-display|title|heading|card-title|body|small|meta`.
  - **Radii:** `rounded-surface|control|chip`.
  - **Shadows:** `shadow-card-hover|popover|accent`.
  - **Other:** `bg-accent`, spacing `nav` (`h-nav`, `top-nav`, `pt-nav`), and the utility `.bg-hairline-texture`.
  - **CSS variables:** `--nav-h: 56px`, plus `--<token>` as space-separated RGB channels.

- [ ] **Step 1: Write the failing check `$CHECKS/tokens.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

const lum = (rgb) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

(async () => {
  await withPage('/', async (page) => {
    const vars = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const names = ['canvas', 'surface', 'ink', 'ink-secondary', 'ink-muted', 'positive', 'positive-bg', 'warning', 'warning-bg', 'danger', 'danger-bg'];
      const out = { navH: cs.getPropertyValue('--nav-h').trim() };
      for (const n of names) out[n] = cs.getPropertyValue(`--${n}`).trim().split(/\s+/).map(Number);
      return out;
    });
    check('--nav-h is 56px', vars.navH === '56px', vars.navH);

    const body = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return { bg: cs.backgroundColor, font: cs.fontFamily, color: cs.color };
    });
    check('body background is canvas', body.bg === 'rgb(247, 246, 244)', body.bg);
    check('body text is ink', body.color === 'rgb(24, 24, 27)', body.color);
    check('body font is Geist', body.font.startsWith('Geist'), body.font);

    const loaded = await page.evaluate(async () => ({
      sans: (await document.fonts.load('600 16px Geist')).length > 0,
      mono: (await document.fonts.load('400 12px "Geist Mono"')).length > 0,
    }));
    check('Geist loads', loaded.sans);
    check('Geist Mono loads', loaded.mono);

    const pairs = [['ink-muted', 'canvas'], ['ink-muted', 'surface'], ['ink-secondary', 'canvas'], ['positive', 'positive-bg'], ['warning', 'warning-bg'], ['danger', 'danger-bg']];
    for (const [fg, bg] of pairs) {
      const ok = vars[fg].length === 3 && vars[bg].length === 3;
      const ratio = ok ? contrast(vars[fg], vars[bg]) : 0;
      check(`${fg} on ${bg} meets 4.5:1`, ratio >= 4.5, ratio.toFixed(2));
    }
  });
  done();
})();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" tokens`
Expected: `FAIL  --nav-h is 56px`, `FAIL  body background is canvas`, and FAILs on every contrast pair, ending with `check(s) FAILED`.

- [ ] **Step 3: Rewrite `tailwind.config.js`**

```js
import { Opacity } from "@mui/icons-material";

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        jersey: ['"Jersey 25"', "sans-serif"],
      },
      fontSize: {
        display: ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "600" }],
        title: ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "600" }],
        heading: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "card-title": ["17px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "22px" }],
        small: ["13px", { lineHeight: "19px" }],
        meta: ["12px", { lineHeight: "16px" }],
      },
      colors: {
        canvas: token("canvas"),
        surface: { DEFAULT: token("surface"), muted: token("surface-muted") },
        hairline: { DEFAULT: token("hairline"), strong: token("hairline-strong") },
        ink: { DEFAULT: token("ink"), secondary: token("ink-secondary"), muted: token("ink-muted") },
        positive: { DEFAULT: token("positive"), bg: token("positive-bg") },
        warning: { DEFAULT: token("warning"), bg: token("warning-bg") },
        danger: { DEFAULT: token("danger"), bg: token("danger-bg") },
        "pink-hippo": "#fae0eb",
        "magenta-hippo": "#ac316a",
        "magenta-dark-hippo": "#4a152e",
        "transparent-white": "rgba(239, 239, 239, 0.7)",
        "transparent-white-md": "rgba(239, 239, 239, 0.9)",
        "violet-100": "#F1E9FF",
        "magenta-100": "#EADDFF",
        "light-color": "#EBDEFF",
        "violet-300": "#E2CFFF",
        "violet-400": "#DCC5FF",
        "dark-color": "#D3B7FF",
        "violet-600": "#C0A7E8",
        "violet-700": "#9682B5",
        "card-highlight": "#7E55B2",
        "tag-dark-color": "#9E63FF",
        "bookmark-color": "#21272A",
        "grey-blue-color": "#6D758F",
        "nav-border-color": "#DDE1E6",
        "learn-more-color": "#c9c8c8",
        "brand-50": "#f5efff",
        "brand-300": "#be96ff",
        "brand-400": "#b182ff",
        "brand-500": "#9e63ff",
        "brand-600": "#905ae8",
      },
      borderRadius: {
        surface: "14px",
        control: "10px",
        chip: "6px",
      },
      boxShadow: {
        "card-hover": "0 1px 2px rgb(24 24 27 / 0.04), 0 4px 16px rgb(24 24 27 / 0.06)",
        popover: "0 8px 24px rgb(24 24 27 / 0.10), 0 2px 6px rgb(24 24 27 / 0.06)",
        accent: "inset 0 1px 0 rgb(255 255 255 / 0.12), 0 1px 2px rgb(24 24 27 / 0.24), 0 4px 12px rgb(24 24 27 / 0.18)",
      },
      spacing: {
        nav: "var(--nav-h)",
      },
      backgroundImage: {
        accent: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)",
        "hippo-bg": "url(/src/assets/images/Hippo_Planet.png)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%) scaleY(1.25) scaleX(1.20)" },
          "100%": { transform: "translateX(0%) scaleY(1.25) scaleX(1.20)" },
        },
        dropIn: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        slidingIn: "slideIn 0.5s linear",
        dropIn: "dropIn 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Rewrite `src/index.css`**

Jersey 25 stays in the font import until Task 10, because pages that haven't been restyled yet still use it.

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Jersey+25&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --canvas: 247 246 244;
  --surface: 255 255 255;
  --surface-muted: 241 240 237;
  --hairline: 231 229 225;
  --hairline-strong: 214 211 206;
  --ink: 24 24 27;
  --ink-secondary: 82 82 91;
  --ink-muted: 107 107 115;
  --positive: 21 128 61;
  --positive-bg: 236 253 243;
  --warning: 180 83 9;
  --warning-bg: 255 247 237;
  --danger: 185 28 28;
  --danger-bg: 254 242 242;
  --nav-h: 56px;
}

html {
  font-size: 14px;
}

@layer base {
  body {
    @apply bg-canvas font-sans text-ink antialiased;
  }
}

@layer utilities {
  .bg-hairline-texture {
    background-image: repeating-linear-gradient(
      135deg,
      rgb(24 24 27 / 0.035) 0 1px,
      transparent 1px 12px
    );
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-minimal {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--hairline-strong)) transparent;
}

.scrollbar-minimal::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-minimal::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-minimal::-webkit-scrollbar-thumb {
  background-color: rgb(var(--hairline-strong));
  border-radius: 9999px;
}
```

- [ ] **Step 5: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" tokens`
Expected: all PASS, ending with `ALL CHECKS PASSED`.

- [ ] **Step 6: Run static checks**

Run: `CHECKS=...; bash "$CHECKS/verify.sh"` (Bash timeout 600000)
Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "$(cat <<'EOF'
Add design tokens and Geist fonts

Gives every later restyle one source for color, type, radius and shadow values.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Shared UI components

**Files:**
- Create in `src/components/ui/`: `cx.ts`, `Button.tsx`, `IconButton.tsx`, `Input.tsx`, `Surface.tsx`, `Badge.tsx`, `Meta.tsx`, `SectionLabel.tsx`, `DetailsTable.tsx`, `Avatar.tsx`, `EmptyState.tsx`, `Spinner.tsx`, `Kbd.tsx`, `SegmentedControl.tsx`, `Modal.tsx`, `useSlashToFocus.ts`
- Modify: `src/components/Tag.tsx` (restyled in place, keeping its path because the set-aside `MainPage.tsx` imports it)
- Test: `gallery/UiSection.tsx`, `gallery/main.tsx`, `$CHECKS/ui.cjs`

**Interfaces:**
- Consumes: the Task 2 Tailwind names.
- Produces (exact signatures later tasks rely on):
  - `cx(...classes: Array<string | false | null | undefined>): string`, a named export of `ui/cx.ts`.
  - `Button` (default): `{ variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md"; icon?: ReactNode; iconRight?: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>`. The default variant is `"secondary"`, the default size `"md"`, and the default `type` `"button"`.
  - `ButtonLink` (named, from `ui/Button.tsx`): the same style props plus react-router `LinkProps`.
  - `IconButton` (default): `{ "aria-label": string; size?: "sm" | "md"; pressed?: boolean; bordered?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>`.
  - `Input` (default, `forwardRef<HTMLInputElement>`): `{ icon?: ReactNode; trailing?: ReactNode; inputSize?: "sm" | "md"; containerClassName?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "size">`. `className` applies to the `<input>`.
  - `fieldClass: string` (named, from `ui/Input.tsx`): classes for raw `<textarea>`/`<select>`/`<input>`.
  - `Surface` (default): `{ as?: "div" | "section" | "aside" | "article"; interactive?: boolean } & HTMLAttributes<HTMLElement>`.
  - `Badge` (default): `{ tone?: "neutral" | "positive" | "warning" | "danger"; icon?: ReactNode; children: ReactNode; className?: string }`.
  - `Meta` and `MetaRow` (named, from `ui/Meta.tsx`):
    - `Meta`: `{ icon?: ReactNode; children: ReactNode; className?: string }`.
    - `MetaRow`: `{ children: ReactNode; className?: string }`. It puts `·` between its non-empty children.
  - `SectionLabel` (default): `{ children: ReactNode; as?: "h2" | "h3" | "p"; collapsed?: boolean; onToggle?: () => void; action?: ReactNode; className?: string }`.
  - `DetailsTable` (default): `{ rows: DetailRow[]; className?: string }`, with the named type `DetailRow = { label: string; value: ReactNode; icon?: ReactNode }`.
  - `Avatar` (default): `{ name: string; src?: string; size?: "sm" | "md" | "lg"; className?: string }`.
  - `EmptyState` (default): `{ title: string; icon?: ReactNode; message?: ReactNode; action?: ReactNode; className?: string }`.
  - `Spinner` (default): `{ size?: "sm" | "md"; label?: string; className?: string }`.
  - `Kbd` (default): `{ children: ReactNode; className?: string }`.
  - `SegmentedControl<T extends string>` (default): `{ value: T; onChange: (value: T) => void; options: { value: T; label: string }[]; "aria-label": string; className?: string }`. It renders `role="group"` with `aria-pressed` buttons.
  - `Modal` (default): `{ title: string; children: ReactNode; footer: ReactNode; className?: string }`. The caller mounts it conditionally. It renders `role="dialog"` labelled by its title.
  - `useSlashToFocus(ref: RefObject<HTMLInputElement>): void`, a named export of `ui/useSlashToFocus.ts`.
  - `Tag` (default, `src/components/Tag.tsx`): `{ keyword: string; className?: string; onRemove?: () => void }`. With `onRemove`, it renders a button labelled `Remove <label>`, where `<label>` is the college-abbreviated text.

- [ ] **Step 1: Write the gallery section `gallery/UiSection.tsx`**

```tsx
import { useRef, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import Button, { ButtonLink } from "../src/components/ui/Button";
import IconButton from "../src/components/ui/IconButton";
import Input from "../src/components/ui/Input";
import Surface from "../src/components/ui/Surface";
import Badge from "../src/components/ui/Badge";
import { Meta, MetaRow } from "../src/components/ui/Meta";
import SectionLabel from "../src/components/ui/SectionLabel";
import DetailsTable from "../src/components/ui/DetailsTable";
import Avatar from "../src/components/ui/Avatar";
import EmptyState from "../src/components/ui/EmptyState";
import Spinner from "../src/components/ui/Spinner";
import Kbd from "../src/components/ui/Kbd";
import SegmentedControl from "../src/components/ui/SegmentedControl";
import Modal from "../src/components/ui/Modal";
import Tag from "../src/components/Tag";
import { useSlashToFocus } from "../src/components/ui/useSlashToFocus";

const UiSection = () => {
  const [pressed, setPressed] = useState(false);
  const [tags, setTags] = useState(["School of Computer Science", "Robotics"]);
  const [open, setOpen] = useState(true);
  const [pay, setPay] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const slashRef = useRef<HTMLInputElement>(null);
  useSlashToFocus(slashRef);

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button data-testid="btn-primary" variant="primary">Primary</Button>
        <Button data-testid="btn-primary-disabled" variant="primary" disabled>Disabled</Button>
        <Button data-testid="btn-secondary-sm" variant="secondary" size="sm">Secondary</Button>
        <Button data-testid="btn-ghost" variant="ghost">Ghost</Button>
        <Button data-testid="btn-danger" variant="danger">Danger</Button>
        <ButtonLink data-testid="btn-link" to="/x">Link</ButtonLink>
        <IconButton data-testid="iconbtn" aria-label="Bookmark" pressed={pressed} onClick={() => setPressed((p) => !p)}>
          <BookmarkBorderOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </div>

      <Input
        data-testid="slash-target"
        ref={slashRef}
        placeholder="Search…"
        icon={<SearchOutlinedIcon sx={{ fontSize: 16 }} />}
        trailing={<Kbd>/</Kbd>}
      />
      <input data-testid="other-input" aria-label="Other input" />
      <label>
        <input data-testid="gallery-checkbox" type="checkbox" /> A checkbox
      </label>

      <div data-testid="tags" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {tags.map((t) => (
          <Tag key={t} keyword={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))} />
        ))}
        <span data-testid="tag-count">{tags.length}</span>
      </div>

      <div data-testid="badges" style={{ display: "flex", gap: 8 }}>
        <Badge tone="positive">Paid</Badge>
        <Badge>Unpaid</Badge>
        <Badge tone="warning">Soon</Badge>
        <Badge tone="danger">Error</Badge>
      </div>

      <div data-testid="metarow-sparse">
        <MetaRow>
          <Meta>A</Meta>
          {null}
          {false}
          {""}
          <Meta>B</Meta>
        </MetaRow>
      </div>

      <div data-testid="section-label">
        <SectionLabel collapsed={!open} onToggle={() => setOpen((o) => !o)} action={<button type="button">Reset</button>}>
          College
        </SectionLabel>
        {open ? <p data-testid="section-content">Section content</p> : null}
      </div>

      <div data-testid="details">
        <DetailsTable
          rows={[
            { label: "College", value: "School of Computer Science" },
            { label: "Department", value: "HCII" },
            { label: "Email", value: <span className="font-mono">x@andrew.cmu.edu</span> },
          ]}
        />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span data-testid="avatar-initials"><Avatar name="Lauren Herckis" /></span>
        <span data-testid="avatar-empty"><Avatar name="" /></span>
        <span data-testid="avatar-lg"><Avatar name="Aaron Jones" size="lg" /></span>
      </div>

      <Surface data-testid="surface-interactive" interactive style={{ padding: 20 }}>
        Hover me
      </Surface>

      <div data-testid="empty">
        <EmptyState
          icon={<SearchOutlinedIcon sx={{ fontSize: 20 }} />}
          title="No opportunities match"
          message="Try removing a filter"
          action={<Button size="sm">Clear filters</Button>}
        />
      </div>

      <div data-testid="spinner"><Spinner /></div>

      <div data-testid="segmented">
        <SegmentedControl
          aria-label="Compensation"
          value={pay}
          onChange={setPay}
          options={[
            { value: "", label: "Any" },
            { value: "Paid", label: "Paid" },
            { value: "Unpaid", label: "Unpaid" },
          ]}
        />
      </div>

      <Button data-testid="open-modal" onClick={() => setModalOpen(true)}>Open modal</Button>
      {modalOpen ? (
        <Modal
          title="Discard changes?"
          footer={
            <>
              <Button onClick={() => setModalOpen(false)}>Keep editing</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Discard</Button>
            </>
          }
        >
          You have unsaved changes.
        </Modal>
      ) : null}
    </section>
  );
};

export default UiSection;
```

Then edit `gallery/main.tsx`:
- replace `import SignInPage from "../src/pages/SignInPage";` with:
  ```tsx
  import SignInPage from "../src/pages/SignInPage";
  import UiSection from "./UiSection";
  ```
- replace `<p>Gallery</p>` with `<UiSection />`.

- [ ] **Step 2: Write the failing check `$CHECKS/ui.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

(async () => {
  await withPage('/gallery/index.html', async (page) => {
    const style = (sel, prop) => page.$eval(sel, (el, p) => getComputedStyle(el)[p], prop);
    const box = (sel) => page.$eval(sel, (el) => el.getBoundingClientRect().toJSON());
    const isActive = (sel) => page.$eval(sel, (el) => el === document.activeElement);

    check('primary button uses the accent gradient', (await style('[data-testid=btn-primary]', 'backgroundImage')).includes('linear-gradient'));
    check('primary button text is white', (await style('[data-testid=btn-primary]', 'color')) === 'rgb(255, 255, 255)');
    check('md button is 40px tall', Math.round((await box('[data-testid=btn-primary]')).height) === 40);
    check('sm button is 32px tall', Math.round((await box('[data-testid=btn-secondary-sm]')).height) === 32);
    check('disabled button is dimmed', (await style('[data-testid=btn-primary-disabled]', 'opacity')) === '0.5');
    check('danger button is solid danger red', (await style('[data-testid=btn-danger]', 'backgroundColor')) === 'rgb(185, 28, 28)');
    check('ButtonLink renders an anchor to /x', await page.$eval('[data-testid=btn-link]', (el) => el.tagName === 'A' && el.getAttribute('href') === '/x'));

    await page.click('[data-testid=iconbtn]');
    check('IconButton toggles aria-pressed', (await page.getAttribute('[data-testid=iconbtn]', 'aria-pressed')) === 'true');

    await page.focus('[data-testid=slash-target]');
    const focusBorder = await page.$eval('[data-testid=slash-target]', (el) => getComputedStyle(el.parentElement).borderColor);
    check('focused Input container border turns ink', focusBorder === 'rgb(24, 24, 27)', focusBorder);

    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('/');
    check('"/" focuses the search input from the page body', await isActive('[data-testid=slash-target]'));
    check('"/" used as a shortcut is not typed into the input', (await page.inputValue('[data-testid=slash-target]')) === '');
    await page.click('[data-testid=other-input]');
    await page.keyboard.type('a/b');
    check('typing "/" in another text field stays in that field', (await page.inputValue('[data-testid=other-input]')) === 'a/b' && (await isActive('[data-testid=other-input]')));
    await page.focus('[data-testid=gallery-checkbox]');
    await page.keyboard.press('/');
    check('"/" from a focused checkbox still jumps to search', await isActive('[data-testid=slash-target]'));

    await page.click('button[aria-label="Remove SCS"]');
    check('Tag abbreviates colleges and onRemove fires', (await page.textContent('[data-testid=tag-count]')) === '1');

    check('positive badge uses the positive color', (await page.$eval('[data-testid=badges] > span:first-child', (el) => getComputedStyle(el).color)) === 'rgb(21, 128, 61)');

    const sparse = await page.textContent('[data-testid=metarow-sparse]');
    check('MetaRow skips empty children (exactly one separator)', sparse.replace(/\s/g, '') === 'A·B', sparse);

    const toggle = '[data-testid=section-label] button[aria-expanded]';
    check('SectionLabel starts expanded', (await page.getAttribute(toggle, 'aria-expanded')) === 'true');
    await page.click(toggle);
    check('SectionLabel collapses', (await page.getAttribute(toggle, 'aria-expanded')) === 'false' && (await page.$('[data-testid=section-content]')) === null);

    check('DetailsTable renders one row per entry', (await page.$$('[data-testid=details] dt')).length === 3);
    check('Avatar shows initials', (await page.textContent('[data-testid=avatar-initials]')).trim() === 'LH');
    check('Avatar without a name shows the person icon', (await page.$('[data-testid=avatar-empty] svg[data-testid=PersonIcon]')) !== null);
    check('lg Avatar is 96px', Math.round((await box('[data-testid=avatar-lg] > span')).width) === 96);

    await page.hover('[data-testid=surface-interactive]');
    await page.waitForTimeout(300);
    check('interactive Surface gains a hover shadow', (await style('[data-testid=surface-interactive]', 'boxShadow')) !== 'none');

    check('EmptyState renders its title', (await page.textContent('[data-testid=empty]')).includes('No opportunities match'));
    check('Spinner exposes role=status', (await page.$('[data-testid=spinner] [role=status]')) !== null);

    const seg = page.locator('[data-testid=segmented]');
    await seg.getByRole('button', { name: 'Paid', exact: true }).click();
    check('SegmentedControl marks the chosen option pressed', (await seg.getByRole('button', { name: 'Paid', exact: true }).getAttribute('aria-pressed')) === 'true');
    check('SegmentedControl unmarks the previous option', (await seg.getByRole('button', { name: 'Any', exact: true }).getAttribute('aria-pressed')) === 'false');

    await page.click('[data-testid=open-modal]');
    const labelled = await page.$eval('[role=dialog]', (el) => document.getElementById(el.getAttribute('aria-labelledby')).textContent);
    check('Modal is labelled by its title', labelled === 'Discard changes?', labelled);
    await page.getByRole('button', { name: 'Keep editing' }).click();
    check('Modal closes', (await page.$('[role=dialog]')) === null);
  });
  done();
})();
```

- [ ] **Step 3: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" ui`
Expected: `FAIL  checks on /gallery/index.html ran to completion` (the gallery can't compile yet because the `ui/` files don't exist), ending with `check(s) FAILED`.

- [ ] **Step 4: Create `src/components/ui/cx.ts`**

```ts
export const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");
```

- [ ] **Step 5: Create `src/components/ui/Button.tsx`**

```tsx
import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-accent hover:opacity-90",
  secondary: "border border-hairline-strong bg-surface text-ink hover:bg-surface-muted",
  ghost: "text-ink-secondary hover:bg-surface-muted hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-[32px] px-3 text-small",
  md: "h-[40px] px-4 text-body",
};

const buttonClasses = (variant: Variant = "secondary", size: Size = "md", className?: string) =>
  cx(base, variants[variant], sizes[size], className);

interface StyleProps {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

interface ButtonProps extends StyleProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ variant, size, icon, iconRight, className, children, type = "button", ...rest }: ButtonProps) => (
  <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
    {icon}
    {children}
    {iconRight}
  </button>
);

interface ButtonLinkProps extends StyleProps, Omit<LinkProps, "className"> {
  className?: string;
}

export const ButtonLink = ({ variant, size, icon, iconRight, className, children, ...rest }: ButtonLinkProps) => (
  <Link className={buttonClasses(variant, size, className)} {...rest}>
    {icon}
    {children}
    {iconRight}
  </Link>
);

export default Button;
```

- [ ] **Step 6: Create `src/components/ui/IconButton.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  size?: "sm" | "md";
  pressed?: boolean;
  bordered?: boolean;
}

const IconButton = ({ size = "md", pressed, bordered = false, className, type = "button", children, ...rest }: IconButtonProps) => (
  <button
    type={type}
    aria-pressed={pressed}
    className={cx(
      "inline-flex shrink-0 items-center justify-center rounded-control transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
      size === "sm" ? "h-[32px] w-[32px]" : "h-[36px] w-[36px]",
      pressed ? "text-ink" : "text-ink-muted hover:text-ink",
      bordered ? "border border-hairline-strong bg-surface hover:bg-surface-muted" : "hover:bg-surface-muted",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default IconButton;
```

- [ ] **Step 7: Create `src/components/ui/Input.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

export const fieldClass =
  "block w-full rounded-control border border-hairline-strong bg-surface px-3 py-2 text-body text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-ink-muted focus:border-ink focus:ring-2 focus:ring-ink/10";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  inputSize?: "sm" | "md";
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, trailing, inputSize = "md", className, containerClassName, ...rest }, ref) => (
    <div
      className={cx(
        "flex items-center gap-2 rounded-control border border-hairline-strong bg-surface px-3 transition-[border-color,box-shadow] duration-150 ease-out focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/10",
        inputSize === "sm" ? "h-[32px]" : "h-[40px]",
        containerClassName
      )}
    >
      {icon ? <span className="flex shrink-0 text-ink-muted">{icon}</span> : null}
      <input
        ref={ref}
        className={cx(
          "h-full w-full min-w-0 border-none bg-transparent p-0 text-body text-ink outline-none placeholder:text-ink-muted",
          className
        )}
        {...rest}
      />
      {trailing}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
```

- [ ] **Step 8: Create `src/components/ui/Surface.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

type SurfaceElement = "div" | "section" | "aside" | "article";

interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as?: SurfaceElement;
  interactive?: boolean;
}

const Surface = ({ as: Component = "div", interactive = false, className, ...rest }: SurfaceProps) => (
  <Component
    className={cx(
      "rounded-surface border border-hairline bg-surface",
      interactive &&
        "transition-[border-color,box-shadow] duration-200 ease-out hover:border-hairline-strong hover:shadow-card-hover",
      className
    )}
    {...rest}
  />
);

export default Surface;
```

- [ ] **Step 9: Create `src/components/ui/Badge.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

type Tone = "neutral" | "positive" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-secondary",
  positive: "bg-positive-bg text-positive",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

interface BadgeProps {
  tone?: Tone;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ tone = "neutral", icon, children, className }: BadgeProps) => (
  <span className={cx("inline-flex items-center gap-1 rounded-chip px-2 py-[2px] text-meta font-medium", tones[tone], className)}>
    {icon}
    {children}
  </span>
);

export default Badge;
```

- [ ] **Step 10: Create `src/components/ui/Meta.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

interface MetaProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Meta = ({ icon, children, className }: MetaProps) => (
  <span className={cx("inline-flex min-w-0 items-center gap-1 font-mono text-meta text-ink-muted", className)}>
    {icon ? <span className="flex shrink-0">{icon}</span> : null}
    <span className="truncate">{children}</span>
  </span>
);

interface MetaRowProps {
  children: React.ReactNode;
  className?: string;
}

export const MetaRow = ({ children, className }: MetaRowProps) => {
  const items = React.Children.toArray(children).filter((item) => item !== "");
  return (
    <div className={cx("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span aria-hidden="true" className="text-ink-muted">
              ·
            </span>
          ) : null}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};
```

- [ ] **Step 11: Create `src/components/ui/SectionLabel.tsx`**

```tsx
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { cx } from "./cx";

interface SectionLabelProps {
  children: React.ReactNode;
  as?: "h2" | "h3" | "p";
  collapsed?: boolean;
  onToggle?: () => void;
  action?: React.ReactNode;
  className?: string;
}

const labelText = "font-mono text-meta font-medium text-ink-muted";

const SectionLabel = ({ children, as: Heading = "h3", collapsed = false, onToggle, action, className }: SectionLabelProps) => (
  <div className={cx("flex min-h-[24px] items-center justify-between gap-2", className)}>
    <Heading className="m-0 min-w-0">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className={cx(
            labelText,
            "inline-flex items-center gap-1 rounded transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          )}
        >
          {children}
          <KeyboardArrowDownIcon
            sx={{ fontSize: 16 }}
            className={cx("transition-transform duration-200 ease-out", collapsed && "-rotate-90")}
          />
        </button>
      ) : (
        <span className={cx(labelText, "inline-flex items-center gap-1.5")}>{children}</span>
      )}
    </Heading>
    {action}
  </div>
);

export default SectionLabel;
```

- [ ] **Step 12: Create `src/components/ui/DetailsTable.tsx`**

```tsx
import React from "react";
import Surface from "./Surface";
import { cx } from "./cx";

export interface DetailRow {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

interface DetailsTableProps {
  rows: DetailRow[];
  className?: string;
}

const DetailsTable = ({ rows, className }: DetailsTableProps) => (
  <Surface className={cx("overflow-hidden", className)}>
    <dl className="m-0 divide-y divide-hairline">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[minmax(140px,36%)_1fr]">
          <dt className="flex items-center gap-2 border-r border-hairline px-4 py-3 text-small text-ink-muted">
            {row.icon ? <span className="flex shrink-0">{row.icon}</span> : null}
            {row.label}
          </dt>
          <dd className="m-0 flex min-w-0 items-center break-words px-4 py-3 text-small text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  </Surface>
);

export default DetailsTable;
```

- [ ] **Step 13: Create `src/components/ui/Avatar.tsx`**

```tsx
import PersonIcon from "@mui/icons-material/Person";
import { cx } from "./cx";

type AvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-[28px] w-[28px] text-[11px]",
  md: "h-[40px] w-[40px] text-[14px]",
  lg: "h-[96px] w-[96px] text-[30px]",
};

const iconSizes: Record<AvatarSize, number> = { sm: 16, md: 22, lg: 48 };

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const Avatar = ({ name, src, size = "md", className }: AvatarProps) => {
  const initials = initialsOf(name);
  return (
    <span
      role={src ? undefined : "img"}
      aria-label={src ? undefined : name || "User"}
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline bg-surface-muted font-medium text-ink-secondary",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <PersonIcon aria-hidden="true" sx={{ fontSize: iconSizes[size] }} className="text-ink-muted" />
      )}
    </span>
  );
};

export default Avatar;
```

- [ ] **Step 14: Create `src/components/ui/EmptyState.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

interface EmptyStateProps {
  title: string;
  icon?: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({ title, icon, message, action, className }: EmptyStateProps) => (
  <div
    className={cx(
      "flex flex-col items-center justify-center gap-2 rounded-surface border border-hairline bg-canvas bg-hairline-texture px-6 py-14 text-center",
      className
    )}
  >
    {icon ? (
      <span className="mb-1 flex h-[40px] w-[40px] items-center justify-center rounded-control border border-hairline bg-surface text-ink-muted">
        {icon}
      </span>
    ) : null}
    <p className="text-heading text-ink">{title}</p>
    {message ? <p className="max-w-sm text-body text-ink-secondary">{message}</p> : null}
    {action ? <div className="mt-3">{action}</div> : null}
  </div>
);

export default EmptyState;
```

- [ ] **Step 15: Create `src/components/ui/Spinner.tsx`**

```tsx
import { cx } from "./cx";

interface SpinnerProps {
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

const Spinner = ({ size = "md", label = "Loading", className }: SpinnerProps) => (
  <span role="status" className={cx("inline-flex items-center justify-center", className)}>
    <span
      aria-hidden="true"
      className={cx(
        "animate-spin rounded-full border-2 border-ink/20 border-t-ink",
        size === "sm" ? "h-[20px] w-[20px]" : "h-[32px] w-[32px]"
      )}
    />
    <span className="sr-only">{label}</span>
  </span>
);

export default Spinner;
```

- [ ] **Step 16: Create `src/components/ui/Kbd.tsx`**

```tsx
import React from "react";
import { cx } from "./cx";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

const Kbd = ({ children, className }: KbdProps) => (
  <kbd
    className={cx(
      "inline-flex h-[20px] min-w-[20px] items-center justify-center rounded border border-hairline bg-surface-muted px-1 font-mono text-[11px] text-ink-muted",
      className
    )}
  >
    {children}
  </kbd>
);

export default Kbd;
```

- [ ] **Step 17: Create `src/components/ui/SegmentedControl.tsx`**

```tsx
import { cx } from "./cx";

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  "aria-label": string;
  className?: string;
}

function SegmentedControl<T extends string>({ value, onChange, options, className, "aria-label": ariaLabel }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx("inline-flex items-center gap-[2px] rounded-control bg-surface-muted p-[2px]", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "h-[28px] rounded-[8px] px-3 text-small transition-[background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
              active
                ? "bg-surface font-medium text-ink shadow-[0_1px_2px_rgb(24_24_27/0.08),0_0_0_1px_rgb(var(--hairline))]"
                : "text-ink-secondary hover:text-ink"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
```

- [ ] **Step 18: Create `src/components/ui/Modal.tsx`**

```tsx
import React, { useId } from "react";
import Surface from "./Surface";
import { cx } from "./cx";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}

const Modal = ({ title, children, footer, className }: ModalProps) => {
  const titleId = useId();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <Surface
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cx("w-full max-w-sm animate-dropIn p-6 shadow-popover", className)}
      >
        <h2 id={titleId} className="mb-3 text-heading text-ink">
          {title}
        </h2>
        <div className="text-body text-ink-secondary">{children}</div>
        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </Surface>
    </div>
  );
};

export default Modal;
```

- [ ] **Step 19: Create `src/components/ui/useSlashToFocus.ts`**

```ts
import { RefObject, useEffect } from "react";

const NON_TEXT_INPUTS = new Set(["checkbox", "radio", "button", "submit", "reset", "range", "color", "file", "image"]);

const isTextEntry = (el: Element | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  if (el instanceof HTMLInputElement) return !NON_TEXT_INPUTS.has(el.type);
  return el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
};

export function useSlashToFocus(ref: RefObject<HTMLInputElement>) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Shift is not checked: several keyboard layouts need it to type "/".
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTextEntry(document.activeElement)) return;
      e.preventDefault();
      ref.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref]);
}
```

- [ ] **Step 20: Rewrite `src/components/Tag.tsx`**

```tsx
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { cx } from "./ui/cx";

interface TagProps {
  keyword: string;
  className?: string;
  onRemove?: () => void;
}

const collegeAbr: Record<string, string> = {
  "College of Engineering": "Engineering",
  "College of Fine Arts": "CFA",
  "Dietrich College of Humanities & Social Sciences": "Dietrich",
  "Heinz College of Information Systems and Public Policy": "Heinz",
  "Mellon College of Science": "MCS",
  "School of Computer Science": "SCS",
  "Tepper School of Business": "Tepper",
  "Electrical & Computer Engineering": "ECE",
  "Artificial Intelligence": "AI",
};

const Tag = ({ keyword, className, onRemove }: TagProps) => {
  const label = collegeAbr[keyword] ?? keyword;
  return (
    <span
      title={label}
      className={cx(
        "inline-flex max-w-full items-center gap-1 rounded-chip bg-surface-muted px-2 py-[3px] text-small text-ink-secondary",
        className
      )}
    >
      <span className="truncate">{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="-mr-1 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-ink-muted transition-colors duration-150 hover:bg-hairline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <CloseOutlinedIcon sx={{ fontSize: 12 }} />
        </button>
      ) : null}
    </span>
  );
};

export default Tag;
```

- [ ] **Step 21: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" ui`
Expected: all PASS, ending with `ALL CHECKS PASSED`.

- [ ] **Step 22: Look at the gallery**

Run: `CHECKS=...; NODE_PATH="C:/Users/Bryan/Downloads/CMU Research/ResearchStarter/node_modules" node -e "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});await p.goto('http://127.0.0.1:5173/gallery/index.html',{waitUntil:'domcontentloaded',timeout:90000});await p.waitForTimeout(2000);await p.screenshot({path:process.env.CHECKS+'/shots/gallery-ui.png',fullPage:true});await b.close();})()"`
Open `$CHECKS/shots/gallery-ui.png` with Read and check it against spec §1–§2:
- a black gradient primary button;
- gray chips;
- mono meta text;
- a hairline details table with row dividers;
- initials avatars;
- a dashed/textured empty state.

Fix anything that looks off before committing.

- [ ] **Step 23: Run static checks**

Run: `CHECKS=...; bash "$CHECKS/verify.sh"` (Bash timeout 600000)
Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 24: Commit**

```bash
git add src/components/ui/cx.ts src/components/ui/Button.tsx src/components/ui/IconButton.tsx src/components/ui/Input.tsx src/components/ui/Surface.tsx src/components/ui/Badge.tsx src/components/ui/Meta.tsx src/components/ui/SectionLabel.tsx src/components/ui/DetailsTable.tsx src/components/ui/Avatar.tsx src/components/ui/EmptyState.tsx src/components/ui/Spinner.tsx src/components/ui/Kbd.tsx src/components/ui/SegmentedControl.tsx src/components/ui/Modal.tsx src/components/ui/useSlashToFocus.ts src/components/Tag.tsx
git commit -m "$(cat <<'EOF'
Add shared UI components for the redesign

Pages get one set of token-based building blocks instead of repeating class strings.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: App shell (nav, footer, routes)

**Files:**
- Modify: `src/components/NavBar.tsx` (full rewrite)
- Modify: `src/components/NavButton.tsx` (full rewrite)
- Modify: `src/components/Footer.tsx` (full rewrite)
- Modify: `src/App.tsx` (full rewrite: removes the `MainPage` import and the `/main` route; the auth-bypass lines are unchanged)
- Modify: `src/pages/FilterPage.tsx:283,285` and `src/components/FilterSection.tsx:68` (nav offsets only)
- Test: `$CHECKS/layout.cjs`

**Interfaces:**
- Consumes: `Avatar`, `cx` (Task 3); the tokens `h-nav`, `bg-accent`, `shadow-accent`, `shadow-popover` (Task 2).
- Produces:
  - The nav is a fixed `<nav>`, 56px tall, followed by an `h-nav` spacer.
  - The logo link has `aria-label="CMU Research home"` and `to="/"`.
  - The avatar button has `aria-label="Open user menu"` and opens `role="menu"`.
  - The footer is a `<footer>` element.

- [ ] **Step 1: Write the failing check `$CHECKS/layout.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

(async () => {
  await withPage('/info/mock-1', async (page) => {
    const nav = await page.$eval('nav', (el) => ({ h: el.getBoundingClientRect().height, bg: getComputedStyle(el).backgroundColor }));
    check('nav is 56px tall', Math.round(nav.h) === 56, String(nav.h));
    check('nav background is surface white', nav.bg === 'rgb(255, 255, 255)', nav.bg);
    check('logo links to the search page', (await page.$eval('nav a[aria-label="CMU Research home"]', (el) => new URL(el.href).pathname)) === '/');
    check('footer is shown on detail pages', (await page.$('footer')) !== null);

    await page.click('button[aria-label="Open user menu"]');
    check('avatar menu opens', (await page.$('[role=menu]')) !== null);
    check('avatar menu offers Sign out', (await page.getByRole('menuitem', { name: 'Sign out' }).count()) === 1);
    await page.mouse.click(640, 500);
    check('avatar menu closes on outside click', (await page.$('[role=menu]')) === null);

    await page.evaluate(() => window.scrollTo(0, 10));
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    const transform = await page.$eval('nav', (el) => getComputedStyle(el).transform);
    check('nav hides when scrolling down', transform.includes('-56'), transform);
  });

  await withPage('/', async (page) => {
    const tab = page.locator('nav a', { hasText: 'Search' });
    check('active Search tab uses the accent pill', (await tab.evaluate((el) => getComputedStyle(el).backgroundImage)).includes('linear-gradient'));
    check('active Search tab text is white', (await tab.evaluate((el) => getComputedStyle(el).color)) === 'rgb(255, 255, 255)');
    check('footer is hidden on the search page', (await page.$('footer')) === null);

    let onTab = false;
    for (let i = 0; i < 6 && !onTab; i++) {
      await page.keyboard.press('Tab');
      onTab = await page.evaluate(() => document.activeElement?.tagName === 'A' && document.activeElement.textContent.trim() === 'Search');
    }
    check('Tab reaches the Search tab', onTab);
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement).boxShadow);
    check('keyboard focus on a nav tab shows a ring', ring !== 'none', ring);
  });

  await withPage('/main', async (page) => {
    check('/main falls through to the 404 page', (await page.textContent('body')).includes("this page doesn't exist"));
  });

  done();
})();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" layout`
Expected: FAIL on `nav is 56px tall`, `logo links to the search page`, `footer is shown on detail pages`, `active Search tab uses the accent pill`, and `/main falls through to the 404 page`.

- [ ] **Step 3: Rewrite `src/components/NavButton.tsx`**

```tsx
import React from "react";
import { NavLink, NavLinkRenderProps } from "react-router-dom";

type NavButtonProps = {
  name: string;
  links: string;
  Icon: React.ElementType;
  linkClass: (props: NavLinkRenderProps) => string;
};

const NavButton = ({ name, links, Icon, linkClass }: NavButtonProps) => (
  <NavLink to={links} className={linkClass}>
    <Icon sx={{ fontSize: 18 }} />
    {name}
  </NavLink>
);

export default NavButton;
```

- [ ] **Step 4: Rewrite `src/components/NavBar.tsx`**

Keep the `session?.user?.isProfessor` expression exactly as written. It is one of the 3 baseline type errors, and `verify.sh` compares by message.

```tsx
import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSession, signOut } from "../lib/authClient";
import NavButton from "./NavButton";
import Avatar from "./ui/Avatar";
import { cx } from "./ui/cx";
import { useNavBarHidden } from "../contexts/NavBarContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";

const menuItemClass =
  "flex w-full items-center gap-2 px-4 py-2 text-body text-ink-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-ink focus-visible:bg-surface-muted focus-visible:outline-none";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "flex h-[36px] items-center gap-2 rounded-control px-3 text-body font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98]",
    focusRing,
    isActive ? "bg-accent text-white shadow-accent" : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
  );

const NavBar = () => {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const image = session?.user?.image ?? undefined;
  const isProfessor = session?.user?.isProfessor ?? false;
  const dashboardLink = isProfessor ? "/professor-dashboard" : "/dashboard";

  const [open, setOpen] = useState(false);
  const hidden = useNavBarHidden();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={cx(
          "fixed inset-x-0 top-0 z-20 h-nav border-b border-hairline bg-surface transition-transform duration-300 ease-out",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-6">
          <NavLink to="/" aria-label="CMU Research home" className={cx("flex items-center justify-self-start rounded-[6px]", focusRing)}>
            <img src={logo} alt="" className="h-[28px] w-auto object-contain" />
          </NavLink>

          <div className="flex items-center gap-1">
            {isProfessor && (
              <NavButton name="Dashboard" Icon={HomeOutlinedIcon} links={dashboardLink} linkClass={linkClass} />
            )}
            <NavButton name="Search" Icon={SearchOutlinedIcon} links="/" linkClass={linkClass} />
          </div>

          <div className="relative justify-self-end" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Open user menu"
              aria-expanded={open}
              aria-haspopup="menu"
              className={cx(
                "flex items-center gap-1 rounded-full py-1 pl-1 pr-2 transition-colors duration-150 ease-out hover:bg-surface-muted active:scale-[0.98]",
                focusRing
              )}
            >
              <Avatar name={name} src={image} size="sm" />
              <KeyboardArrowDownIcon
                sx={{ fontSize: 18 }}
                className={cx(
                  "text-ink-muted transition-transform duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]",
                  open && "rotate-180"
                )}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 top-[44px] z-50 w-64 origin-top-right animate-dropIn rounded-surface border border-hairline bg-surface py-1 shadow-popover"
              >
                <div className="border-b border-hairline px-4 py-3">
                  <p className="truncate text-body font-medium text-ink">{name || "Signed in"}</p>
                  {email ? <p className="truncate font-mono text-meta text-ink-muted">{email}</p> : null}
                </div>
                <NavLink role="menuitem" to="/profile" onClick={() => setOpen(false)} className={menuItemClass}>
                  <AccountCircleOutlinedIcon sx={{ fontSize: 16 }} />
                  Manage account
                </NavLink>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className={menuItemClass}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-nav w-full" />
    </>
  );
};

export default NavBar;
```

- [ ] **Step 5: Rewrite `src/components/Footer.tsx`**

```tsx
const Footer = () => (
  <footer className="border-t border-hairline px-6 py-6">
    <p className="text-small text-ink-muted">
      Designed, developed and maintained with <span aria-label="love">♥</span> by{" "}
      <a
        href="https://scottylabs.org"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-ink underline underline-offset-2 transition-opacity duration-150 hover:opacity-80"
      >
        ScottyLabs
      </a>
      .
    </p>
  </footer>
);

export default Footer;
```

- [ ] **Step 6: Rewrite `src/App.tsx`**

```tsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import FilterPage from "./pages/FilterPage";
import Dashboard from "./pages/StudentDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProfessorProfile from "./pages/ProfessorProfile";

import InfoPage from "./pages/InfoPage";
import { useSession } from "./lib/authClient";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<FilterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Dashboard />} />
      <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
      <Route path="/professor/:andrewId" element={<ProfessorProfile />} />
      <Route path="/info/:id" element={<InfoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  const { data: session, isPending } = useSession();

  // temporary bypass for auth since database is down, REMEMBER TO REMOVE
  return <RouterProvider router={router} />;

  if (isPending) return null;

  return session ? <RouterProvider router={router} /> : <SignInPage />;
};

export default App;
```

- [ ] **Step 7: Point the search page's fixed offsets at the new nav height**

In `src/components/FilterSection.tsx`, replace
`      style={{ top: navHidden ? 0 : "10vh", height: navHidden ? "100vh" : "90vh" }}`
with
`      style={{ top: navHidden ? 0 : "var(--nav-h)", height: navHidden ? "100vh" : "calc(100vh - var(--nav-h))" }}`

In `src/pages/FilterPage.tsx`:
- replace `          top: navHidden ? 0 : "10vh",` with `          top: navHidden ? 0 : "var(--nav-h)",`;
- replace `          height: navHidden ? "100vh" : "90vh",` with `          height: navHidden ? "100vh" : "calc(100vh - var(--nav-h))",`.

- [ ] **Step 8: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" layout`
Expected: `ALL CHECKS PASSED`.

- [ ] **Step 9: Visual check and static checks**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot after search && bash "$CHECKS/run.sh" shoot after info`
Open both PNGs with Read and confirm:
- a white nav with a hairline bottom border;
- the logo on the left;
- a black pill for the active "Search" tab;
- an avatar circle on the right.

Then run `bash "$CHECKS/verify.sh"` (timeout 600000). Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 10: Commit**

```bash
git add src/components/NavBar.tsx src/components/NavButton.tsx src/components/Footer.tsx src/App.tsx src/components/FilterSection.tsx src/pages/FilterPage.tsx
git commit -m "$(cat <<'EOF'
Restyle the app shell and make search the home page

The nav, footer and logo link now use the new tokens, and /main no longer has a route.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Search page

**Files:**
- Modify: `src/components/FilterSection.tsx` (full rewrite)
- Modify: `src/pages/FilterPage.tsx` (full rewrite; fetch and filter logic copied unchanged except the compensation fix)
- Modify: `src/components/Card.tsx` (full rewrite; bookmark logic unchanged)
- Modify: `src/utils.ts` (append `matchesCompensation`)
- Test: `gallery/CardSection.tsx`, `gallery/main.tsx`, `$CHECKS/search.cjs`

**Interfaces:**
- Consumes: `Button`, `IconButton`, `Input`, `Surface`, `Badge`, `Meta`, `MetaRow`, `SectionLabel`, `EmptyState`, `Spinner`, `Kbd`, `SegmentedControl`, `useSlashToFocus`, `Tag` (Task 3).
- Produces:
  - `matchesCompensation(value: string | undefined, selected: "Paid" | "Unpaid"): boolean` in `src/utils.ts`.
  - `Card` keeps its props `{ research: ResearchType; showApplyButton?: boolean; onApply?: (researchId: string) => void }` and renders an `<article>`. Its title link covers the whole card; the bookmark and Apply buttons sit above that link.
  - The filter panel is `<aside aria-label="Filters">`.
  - The results scroller is `role="region" aria-label="Search results"`.

- [ ] **Step 1: Add the gallery cards for the edge cases**

`gallery/CardSection.tsx`:
```tsx
import Card from "../src/components/Card";
import { ResearchType } from "../src/DataTypes";

const longResearch: ResearchType = {
  _id: "gallery-long",
  projectTitle:
    "An Extremely Long Research Opportunity Title That Keeps Going To Test Wrapping Behaviour Across Multiple Lines Without Overflowing The Card Container",
  contact: { "Professor Maximilian Alexander Featherstonehaugh-Worthington": "mafw", "Dr. Second Contact": "sc" },
  department: ["Human-Computer Interaction Institute", "Electrical & Computer Engineering"],
  description: "Lorem ipsum dolor sit amet. ".repeat(40),
  paidUnpaid: "Paid",
  position: "Graduate Research Assistant (Computational Neuroscience)",
  timeAdded: "5/12/26",
  anticipatedEndDate: "Spring 2027",
  keywords: [
    "Supercalifragilisticexpialidociousandthensomemorewithoutspaces",
    "Robotics",
    "Machine Learning",
    "Accessibility",
    "Extra 1",
    "Extra 2",
  ],
  college: ["School of Computer Science", "College of Engineering"],
};

const minimalResearch: ResearchType = {
  _id: "gallery-minimal",
  projectTitle: "Minimal record",
  contact: {},
  department: [],
  description: "",
};

const CardSection = () => (
  <section style={{ display: "grid", gap: 16, maxWidth: 720 }}>
    <div data-testid="card-long">
      <Card research={longResearch} showApplyButton />
    </div>
    <div data-testid="card-minimal">
      <Card research={minimalResearch} />
    </div>
  </section>
);

export default CardSection;
```

In `gallery/main.tsx`:
- replace `import UiSection from "./UiSection";` with:
  ```tsx
  import UiSection from "./UiSection";
  import CardSection from "./CardSection";
  ```
- replace `<UiSection />` with:
  ```tsx
  <UiSection />
            <CardSection />
  ```

- [ ] **Step 2: Write the failing check `$CHECKS/search.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

const SEARCH = 'input[placeholder="Search for research opportunities..."]';
const cardCount = (page) => page.$$eval('article', (els) => els.length);
const toggleFilter = (page, name) => page.locator('aside label', { hasText: new RegExp(`^${name}$`) }).click();

(async () => {
  await withPage('/', async (page) => {
    await page.waitForSelector('article', { timeout: 30000 });
    check('mock data renders 5 result cards', (await cardCount(page)) === 5, String(await cardCount(page)));
    check('result count is shown next to the title', (await page.textContent('body')).includes('5 results'));

    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('/');
    check('"/" focuses the search field', await page.evaluate((sel) => document.activeElement === document.querySelector(sel), SEARCH));
    await page.keyboard.type('a/b');
    check('"/" typed inside the search field is kept', (await page.inputValue(SEARCH)) === 'a/b');
    await page.fill(SEARCH, '');

    const collegeToggle = page.getByRole('button', { name: 'College', exact: true });
    check('College group starts expanded', (await collegeToggle.getAttribute('aria-expanded')) === 'true');
    await collegeToggle.click();
    check('College group collapses', (await page.getByRole('checkbox', { name: 'School of Computer Science' }).count()) === 0);
    await collegeToggle.click();

    await toggleFilter(page, 'School of Computer Science');
    check('checking a college adds a chip', (await page.$('button[aria-label="Remove SCS"]')) !== null);
    await page.getByRole('button', { name: 'Reset college filters' }).click();
    check('college Reset clears the chip', (await page.$('button[aria-label="Remove SCS"]')) === null);
    check('college Reset unchecks the box', !(await page.getByRole('checkbox', { name: 'School of Computer Science' }).isChecked()));

    await toggleFilter(page, 'Masters');
    await page.click('button[aria-label="Remove Masters"]');
    check('removing a chip unchecks its filter', !(await page.getByRole('checkbox', { name: 'Masters' }).isChecked()));

    const comp = page.getByRole('group', { name: 'Compensation' });
    await comp.getByRole('button', { name: 'Paid', exact: true }).click();
    await page.waitForTimeout(200);
    check('Paid shows only paid opportunities (3)', (await cardCount(page)) === 3, String(await cardCount(page)));
    await comp.getByRole('button', { name: 'Unpaid', exact: true }).click();
    await page.waitForTimeout(200);
    check('Unpaid shows only unpaid opportunities (2)', (await cardCount(page)) === 2, String(await cardCount(page)));
    await comp.getByRole('button', { name: 'Any', exact: true }).click();
    await page.waitForTimeout(200);
    check('Any restores all opportunities', (await cardCount(page)) === 5);

    await page.getByRole('button', { name: 'Hide filters' }).focus();
    let reached = false;
    for (let i = 0; i < 40 && !reached; i++) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.getAttribute('type') === 'checkbox' && el.closest('label')?.textContent?.trim() === 'Undergraduate';
      });
    }
    check('Tab reaches the Undergraduate checkbox', reached);
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement.nextElementSibling).boxShadow);
    check('keyboard focus shows a ring on the custom checkbox box', ring !== 'none', ring);
    await page.keyboard.press('Space');
    check('Space toggles the focused checkbox', (await page.$('button[aria-label="Remove Undergraduate"]')) !== null);
    await page.click('button[aria-label="Remove Undergraduate"]');

    const scroller = '[role=region][aria-label="Search results"]';
    await page.$eval(scroller, (el) => { el.scrollTop = 10; });
    await page.waitForTimeout(150);
    await page.$eval(scroller, (el) => { el.scrollTop = 400; });
    await page.waitForTimeout(600);
    const hiddenTop = await page.$eval('aside[aria-label="Filters"]', (el) => Math.round(el.getBoundingClientRect().top));
    check('filter panel moves to the top when the nav hides', hiddenTop === 0, String(hiddenTop));
    await page.$eval(scroller, (el) => { el.scrollTop = 0; });
    await page.waitForTimeout(600);
    const shownTop = await page.$eval('aside[aria-label="Filters"]', (el) => Math.round(el.getBoundingClientRect().top));
    check('filter panel sits under the nav when it shows', shownTop === 56, String(shownTop));

    await page.fill(SEARCH, 'zzzzqqq');
    check('no-results empty state appears', (await page.textContent('body')).includes('No opportunities match'));
    await toggleFilter(page, 'PhD');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    check('Clear filters removes active filter chips', (await page.$('button[aria-label="Remove PhD"]')) === null);
  });

  await withPage('/gallery/index.html', async (page) => {
    const overflow = await page.$eval('[data-testid=card-long] article', (el) => el.scrollWidth - el.clientWidth);
    check('long title, names and tags do not overflow the card', overflow <= 1, String(overflow));
    check('card shows at most 3 tags', (await page.$$('[data-testid=card-long] article span[title]')).length <= 3);
    const minimal = await page.textContent('[data-testid=card-minimal] article');
    check('card with missing fields has no dangling separators', !minimal.includes('·'), minimal);
    check('card with missing fields never prints "undefined"', !minimal.includes('undefined'), minimal);
    check('card with missing fields has no "Posted" label', !minimal.includes('Posted'), minimal);
  });

  done();
})();
```

- [ ] **Step 3: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" search`
Expected: `FAIL  checks on / ran to completion` (the current cards are not `<article>` elements) and FAILs in the gallery block, ending with `check(s) FAILED`.

- [ ] **Step 4: Append `matchesCompensation` to `src/utils.ts`**

Replace:
```ts
  return stringEntries.map(([, v]) => stripHtmlToPlainText(v)).join("\n\n");
}
```
with:
```ts
  return stringEntries.map(([, v]) => stripHtmlToPlainText(v)).join("\n\n");
}

export function matchesCompensation(value: string | undefined, selected: "Paid" | "Unpaid"): boolean {
  const v = (value ?? "").toLowerCase();
  if (selected === "Unpaid") return v.includes("unpaid");
  return v.includes("paid") && !v.includes("unpaid");
}
```

- [ ] **Step 5: Rewrite `src/components/Card.tsx`**

```tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import { BsEyeglasses } from "react-icons/bs";
import { FaHouse, FaBook } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { TbCoin } from "react-icons/tb";
import { ResearchType } from "../DataTypes";
import { matchesCompensation } from "../utils";
import { useSession } from "../lib/authClient";
import Tag from "./Tag";
import Surface from "./ui/Surface";
import IconButton from "./ui/IconButton";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { Meta, MetaRow } from "./ui/Meta";

interface CardProps {
  research: ResearchType;
  showApplyButton?: boolean;
  onApply?: (researchId: string) => void;
}

const iconClass = "shrink-0 text-ink-muted";

const Card = ({ research, showApplyButton, onApply }: CardProps) => {
  const { data: session } = useSession();
  const id = session?.user?.id ?? undefined;

  const [bookmark, setBookmark] = useState(false);

  async function saveUserBookmark(bookmark: boolean, id: string) {
    const response = await fetch(`/api/users/saved/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        opportunityId: research._id,
        action: bookmark ? "add" : "remove",
      }),
    });
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    console.log(response);
  }

  // Fetch bookmark status
  useEffect(() => {
    async function fetchBookmark() {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const userData = await response.json();
      setBookmark(userData.saved.includes(research._id));
    }

    fetchBookmark();
    return;
  }, []);

  function bookmarkOpportunity() {
    if (id != undefined) {
      setBookmark(!bookmark);
      saveUserBookmark(!bookmark, id);
    } else {
      console.log("Unable to set bookmark due to no user id!");
    }
  }

  const professorName = Object.keys(research.contact ?? {}).join(", ");
  const college = Array.isArray(research.college) ? research.college.join(", ") : "";
  const allKeywords = [
    ...(Array.isArray(research.keywords) ? research.keywords : []),
    ...(Array.isArray(research.department) ? research.department : []),
  ];

  return (
    <Surface as="article" interactive className="relative p-[20px]">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="min-w-0 break-words text-card-title text-ink">
          <Link
            to={`/info/${research._id}`}
            className="after:absolute after:inset-0 after:rounded-surface focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ink"
          >
            {research.projectTitle}
          </Link>
        </h3>
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          {research.timeAdded ? <Meta>Posted {research.timeAdded}</Meta> : null}
          <IconButton
            size="sm"
            aria-label={bookmark ? "Remove bookmark" : "Bookmark"}
            pressed={bookmark}
            onClick={bookmarkOpportunity}
          >
            {bookmark ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkIconUnfilled sx={{ fontSize: 20 }} />}
          </IconButton>
        </div>
      </div>

      {professorName || college || research.position ? (
        <MetaRow className="mb-2 text-small text-ink-secondary">
          {professorName ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <BsEyeglasses size={16} className={iconClass} />
              {professorName}
            </span>
          ) : null}
          {college ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <FaHouse size={13} className={iconClass} />
              {college}
            </span>
          ) : null}
          {research.position ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <FaBook size={13} className={iconClass} />
              {research.position}
            </span>
          ) : null}
        </MetaRow>
      ) : null}

      {research.anticipatedEndDate || research.paidUnpaid ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {research.anticipatedEndDate ? <Meta icon={<CiCalendar size={15} />}>{research.anticipatedEndDate}</Meta> : null}
          {research.paidUnpaid ? (
            <Badge tone={matchesCompensation(research.paidUnpaid, "Paid") ? "positive" : "neutral"} icon={<TbCoin size={13} />}>
              {research.paidUnpaid}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {research.description ? (
        <p className="mb-4 line-clamp-3 text-body text-ink-secondary">{research.description}</p>
      ) : null}

      {allKeywords.length > 0 || showApplyButton ? (
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {allKeywords.slice(0, 3).map((keyword, i) => (
              <Tag key={`${keyword}-${i}`} keyword={keyword} />
            ))}
          </div>
          {showApplyButton ? (
            <Button
              size="sm"
              className="relative z-10 shrink-0"
              iconRight={<span aria-hidden="true">→</span>}
              onClick={() => onApply?.(research._id)}
            >
              Apply
            </Button>
          ) : null}
        </div>
      ) : null}
    </Surface>
  );
};

export default Card;
```

- [ ] **Step 6: Rewrite `src/components/FilterSection.tsx`**

```tsx
import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CheckIcon from "@mui/icons-material/Check";
import { departmentOptions } from "../FilterData";
import Button from "./ui/Button";
import SectionLabel from "./ui/SectionLabel";
import SegmentedControl from "./ui/SegmentedControl";

interface FilterSectionProps {
  navHidden?: boolean;
  visible: boolean;
  onToggleVisible: () => void;
  collegeChecks: Record<string, boolean>;
  onCollegeCheck: (name: string, checked: boolean) => void;
  onCollegeReset: () => void;
  selectedDepartment: string[];
  onDepartmentChange: (value: string[]) => void;
  selectedEducation: string[];
  onEducationChange: (value: string[]) => void;
  selectedCompensation: string;
  onCompensationChange: (value: string) => void;
  selectedSemester: string[];
  onSemesterChange: (value: string[]) => void;
  onResetAll: () => void;
}

const colleges = [
  "All",
  "College of Engineering",
  "College of Fine Arts",
  "Dietrich College",
  "Heinz College",
  "Mellon College of Science",
  "School of Computer Science",
  "Tepper School of Business",
  "CMU Qatar",
];

const educationOptions = ["Undergraduate", "Masters", "PhD"];
const semesterOptions = ["Fall", "Spring", "Summer"];
const compensationOptions = [
  { value: "", label: "Any" },
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

const toggleValue = (arr: string[], value: string): string[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FilterCheckbox = ({ label, checked, onChange }: FilterCheckboxProps) => (
  <label
    title={label}
    className="flex h-[32px] cursor-pointer items-center gap-2.5 rounded-[8px] px-2 text-body text-ink-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-ink"
  >
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
    <span
      aria-hidden="true"
      className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] border border-hairline-strong bg-surface transition-colors duration-150 peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas"
    >
      {checked ? <CheckIcon sx={{ fontSize: 12 }} className="text-white" /> : null}
    </span>
    <span className="truncate">{label}</span>
  </label>
);

const ResetButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="rounded px-1 text-meta font-medium text-ink-secondary underline-offset-2 transition-colors duration-150 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
  >
    Reset
  </button>
);

interface FilterGroupProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const FilterGroup = ({ label, open, onToggle, action, children }: FilterGroupProps) => (
  <div className="mb-5">
    <SectionLabel collapsed={!open} onToggle={onToggle} action={action} className="mb-1.5 px-2">
      {label}
    </SectionLabel>
    {open ? <div>{children}</div> : null}
  </div>
);

const FilterSection = ({
  navHidden,
  visible,
  onToggleVisible,
  collegeChecks,
  onCollegeCheck,
  onCollegeReset,
  selectedDepartment,
  onDepartmentChange,
  selectedEducation,
  onEducationChange,
  selectedCompensation,
  onCompensationChange,
  selectedSemester,
  onSemesterChange,
  onResetAll,
}: FilterSectionProps) => {
  const [open, setOpen] = useState({
    college: true,
    department: false,
    education: true,
    compensation: true,
    semester: true,
  });
  const toggle = (key: keyof typeof open) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!visible) return null;

  const anyCollege = Object.entries(collegeChecks).some(([name, checked]) => checked && name !== "All");
  const anyActive =
    anyCollege ||
    selectedDepartment.length > 0 ||
    selectedEducation.length > 0 ||
    selectedCompensation !== "" ||
    selectedSemester.length > 0;

  return (
    <aside
      aria-label="Filters"
      className="scrollbar-minimal fixed bottom-0 left-0 z-10 w-[280px] overflow-y-auto border-r border-hairline bg-canvas transition-[top] duration-300 ease-out"
      style={{ top: navHidden ? "0px" : "var(--nav-h)" }}
    >
      <div className="px-4 py-5">
        <div className="mb-5 flex items-center justify-between px-2">
          <h2 className="text-heading text-ink">Filters</h2>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Hide filters"
            icon={<KeyboardArrowLeftIcon sx={{ fontSize: 16 }} />}
            onClick={onToggleVisible}
          >
            Hide
          </Button>
        </div>

        <FilterGroup
          label="College"
          open={open.college}
          onToggle={() => toggle("college")}
          action={anyCollege ? <ResetButton label="Reset college filters" onClick={onCollegeReset} /> : null}
        >
          {colleges.map((college) => (
            <FilterCheckbox
              key={college}
              label={college}
              checked={collegeChecks[college] ?? false}
              onChange={(checked) => onCollegeCheck(college, checked)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          label="Department"
          open={open.department}
          onToggle={() => toggle("department")}
          action={
            selectedDepartment.length > 0 ? (
              <span className="flex items-center gap-2">
                <span className="font-mono text-meta text-ink-muted">{selectedDepartment.length} selected</span>
                <ResetButton label="Reset department filters" onClick={() => onDepartmentChange([])} />
              </span>
            ) : null
          }
        >
          <div className="scrollbar-minimal max-h-[240px] overflow-y-auto pr-1">
            {departmentOptions.map((opt) => (
              <FilterCheckbox
                key={opt.value}
                label={opt.label}
                checked={selectedDepartment.includes(opt.value)}
                onChange={() => onDepartmentChange(toggleValue(selectedDepartment, opt.value))}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Education" open={open.education} onToggle={() => toggle("education")}>
          {educationOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={selectedEducation.includes(opt)}
              onChange={() => onEducationChange(toggleValue(selectedEducation, opt))}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Compensation" open={open.compensation} onToggle={() => toggle("compensation")}>
          <div className="px-2">
            <SegmentedControl
              aria-label="Compensation"
              value={selectedCompensation}
              onChange={onCompensationChange}
              options={compensationOptions}
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Semester" open={open.semester} onToggle={() => toggle("semester")}>
          {semesterOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={selectedSemester.includes(opt)}
              onChange={() => onSemesterChange(toggleValue(selectedSemester, opt))}
            />
          ))}
        </FilterGroup>

        <Button className="mt-2 w-full" onClick={onResetAll} disabled={!anyActive}>
          Reset all filters
        </Button>
      </div>
    </aside>
  );
};

export default FilterSection;
```

- [ ] **Step 7: Rewrite `src/pages/FilterPage.tsx`**

```tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import { FaSearch } from "react-icons/fa";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import Tag from "../components/Tag";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Kbd from "../components/ui/Kbd";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useSlashToFocus } from "../components/ui/useSlashToFocus";
import { ResearchType } from "../DataTypes";
import { matchesCompensation, parseContact, toArray } from "../utils";
import { useNavBarHidden } from "../contexts/NavBarContext";
import DEV_MOCK_RESEARCHES from "../data/devMockResearches";

interface ActiveFilter {
  label: string;
  type: string;
  value: string;
}

const FilterPage = () => {
  const navHidden = useNavBarHidden();
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  useSlashToFocus(searchRef);

  // College checkboxes
  const [collegeChecks, setCollegeChecks] = useState<Record<string, boolean>>({});

  // Dropdown filters
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedCompensation, setSelectedCompensation] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string[]>([]);

  // Sort
  const [sortBy, setSortBy] = useState<"year" | "time">("time");

  // Infinite scroll
  const CARD_BATCH_LIMIT = 10;
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [searchBarHidden, setSearchBarHidden] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // Only show search bar when scrolled to the very top
    setSearchBarHidden(scrollTop > 0);
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setLoadedBatches((prev) => prev + 1);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:5050/opportunities/");
        if (!res.ok) return;
        const data: any[] = await res.json();
        const transformed = data
          .filter((item) => item["Project Title"])
          .map((item) => ({
            _id: item._id,
            projectTitle: item["Project Title"],
            contact: parseContact(item.Contact),
            department: toArray(item.Department),
            description: item.Description,
            desiredSkillLevel: item["Desired Skill Level"],
            paidUnpaid: item["Paid/Unpaid"],
            position: item.Position,
            prereqs: toArray(item.Prereqs),
            relevantLinks: toArray(item["Relevant Links"]),
            source: item.Source,
            timeAdded: item["Time Added"],
            timeCommitment: item["Time Commitment"],
            anticipatedEndDate: item["Anticipated End Date"],
            keywords: toArray(item.Keywords),
            college: toArray(item.College),
          }));
        setResearches(transformed);
      } catch {
        console.log("Error Fetching Data");
        // Local-only design preview fallback. Active ONLY when running `vite` in
        // DEV with VITE_DEV_BYPASS_AUTH=true. Stripped from production builds.
        if (
          import.meta.env.DEV &&
          import.meta.env.VITE_DEV_BYPASS_AUTH === "true"
        ) {
          setResearches(DEV_MOCK_RESEARCHES);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResearches();
  }, []);

  // Build active filters for chip display
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];
    Object.entries(collegeChecks).forEach(([name, checked]) => {
      if (checked && name !== "All") {
        // Abbreviate college names for chips
        const abbr: Record<string, string> = {
          "College of Engineering": "Engineering",
          "College of Fine Arts": "CFA",
          "Dietrich College": "Dietrich",
          "Heinz College": "Heinz",
          "Mellon College of Science": "MCS",
          "School of Computer Science": "SCS",
          "Tepper School of Business": "Tepper",
          "CMU Qatar": "Qatar",
        };
        filters.push({ label: abbr[name] || name, type: "college", value: name });
      }
    });
    selectedDepartment.forEach((dep) => filters.push({ label: dep, type: "department", value: dep }));
    selectedEducation.forEach((edu) => filters.push({ label: edu, type: "education", value: edu }));
    if (selectedCompensation) filters.push({ label: selectedCompensation, type: "compensation", value: selectedCompensation });
    selectedSemester.forEach((sem) => filters.push({ label: sem, type: "semester", value: sem }));
    return filters;
  }, [collegeChecks, selectedDepartment, selectedEducation, selectedCompensation, selectedSemester]);

  const removeFilter = (filter: ActiveFilter) => {
    switch (filter.type) {
      case "college":
        setCollegeChecks((prev) => ({ ...prev, [filter.value]: false }));
        break;
      case "department":
        setSelectedDepartment((prev) => prev.filter((v) => v !== filter.value));
        break;
      case "education":
        setSelectedEducation((prev) => prev.filter((v) => v !== filter.value));
        break;
      case "compensation":
        setSelectedCompensation("");
        break;
      case "semester":
        setSelectedSemester((prev) => prev.filter((v) => v !== filter.value));
        break;
    }
  };

  // College handlers
  const handleCollegeCheck = (name: string, checked: boolean) => {
    if (name === "All") {
      const allChecks: Record<string, boolean> = {};
      [
        "All", "College of Engineering", "College of Fine Arts", "Dietrich College",
        "Heinz College", "Mellon College of Science", "School of Computer Science",
        "Tepper School of Business", "CMU Qatar",
      ].forEach((c) => { allChecks[c] = checked; });
      setCollegeChecks(allChecks);
    } else {
      setCollegeChecks((prev) => {
        const next = { ...prev, [name]: checked };
        if (!checked) next["All"] = false;
        return next;
      });
    }
  };

  const handleCollegeReset = () => setCollegeChecks({});

  const handleResetAll = () => {
    setCollegeChecks({});
    setSelectedDepartment([]);
    setSelectedEducation([]);
    setSelectedCompensation("");
    setSelectedSemester([]);
  };

  // Filter + search logic
  const filteredData = useMemo(() => {
    let results = researches;

    // College filter
    const activeColleges = Object.entries(collegeChecks)
      .filter(([name, checked]) => checked && name !== "All")
      .map(([name]) => name);
    if (activeColleges.length > 0) {
      results = results.filter((r) => {
        const rColleges = Array.isArray(r.college) ? r.college : [];
        return rColleges.some((c) =>
          activeColleges.some((ac) => c.toLowerCase().includes(ac.toLowerCase()))
        );
      });
    }

    // Department filter
    if (selectedDepartment.length > 0) {
      results = results.filter((r) => {
        const deps = Array.isArray(r.department) ? r.department : [];
        return selectedDepartment.some((sel) =>
          deps.some((d) => d.toLowerCase().includes(sel.toLowerCase()))
        );
      });
    }

    // Education filter
    if (selectedEducation.length > 0) {
      results = results.filter((r) =>
        selectedEducation.some((sel) =>
          r.desiredSkillLevel?.toLowerCase().includes(sel.toLowerCase())
        )
      );
    }

    // Compensation filter
    if (selectedCompensation === "Paid" || selectedCompensation === "Unpaid") {
      results = results.filter((r) => matchesCompensation(r.paidUnpaid, selectedCompensation));
    }

    // Semester filter
    if (selectedSemester.length > 0) {
      results = results.filter((r) =>
        selectedSemester.some((sel) =>
          r.anticipatedEndDate?.toLowerCase().includes(sel.toLowerCase())
        )
      );
    }

    // Search keyword
    if (input.trim()) {
      const keyword = input.trim().toLowerCase();
      results = results.filter((r) => {
        const searchable = [
          r.projectTitle,
          r.description,
          ...(r.department || []),
          ...(r.keywords || []),
          ...(r.college || []),
          r.position,
          r.desiredSkillLevel,
          ...Object.keys(r.contact || {}),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(keyword);
      });
    }

    // Sort
    if (sortBy === "time") {
      results = [...results].sort((a, b) => {
        const ta = a.timeAdded || "";
        const tb = b.timeAdded || "";
        return tb.localeCompare(ta);
      });
    }

    return results;
  }, [researches, collegeChecks, selectedDepartment, selectedEducation, selectedCompensation, selectedSemester, input, sortBy]);

  const resultLabel = `${filteredData.length} ${filteredData.length === 1 ? "result" : "results"}`;

  return (
    <>
      <FilterSection
        navHidden={navHidden}
        visible={sidebarVisible}
        onToggleVisible={() => setSidebarVisible(false)}
        collegeChecks={collegeChecks}
        onCollegeCheck={handleCollegeCheck}
        onCollegeReset={handleCollegeReset}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedEducation={selectedEducation}
        onEducationChange={setSelectedEducation}
        selectedCompensation={selectedCompensation}
        onCompensationChange={setSelectedCompensation}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        onResetAll={handleResetAll}
      />

      <div
        className="fixed bottom-0 right-0 flex flex-col overflow-hidden bg-canvas transition-[left,top] duration-300 ease-out"
        style={{
          top: navHidden ? "0px" : "var(--nav-h)",
          left: sidebarVisible ? "280px" : "0px",
        }}
      >
        {/* Collapses on scroll like the navbar; grid-rows 1fr→0fr self-sizes the collapse. */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            searchBarHidden ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
          }`}
        >
          <div
            className={`overflow-hidden transition-opacity duration-200 ease-out ${
              searchBarHidden ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="px-8 pb-4 pt-6">
              <div className="mb-4 flex items-center gap-3">
                {!sidebarVisible && (
                  <Button
                    size="sm"
                    icon={<KeyboardArrowRightIcon sx={{ fontSize: 16 }} />}
                    onClick={() => setSidebarVisible(true)}
                  >
                    Show filters
                  </Button>
                )}
                <h1 className="text-title text-ink">Search</h1>
                {!loading ? <span className="font-mono text-meta text-ink-muted">{resultLabel}</span> : null}
              </div>

              <Input
                ref={searchRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search for research opportunities..."
                aria-label="Search research opportunities"
                icon={<FaSearch size={13} />}
                trailing={!searchFocused && input === "" ? <Kbd>/</Kbd> : null}
                containerClassName="mb-4"
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  {activeFilters.map((filter) => (
                    <Tag key={`${filter.type}-${filter.value}`} keyword={filter.label} onRemove={() => removeFilter(filter)} />
                  ))}
                  {activeFilters.length >= 2 ? (
                    <Button size="sm" variant="ghost" onClick={handleResetAll}>
                      Clear all
                    </Button>
                  ) : null}
                </div>
                <SegmentedControl
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: "year", label: "Year" },
                    { value: "time", label: "Time" },
                  ]}
                  className="shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          role="region"
          aria-label="Search results"
          className="scrollbar-minimal flex-1 overflow-y-auto px-8 pb-8 pt-2"
          onScroll={handleScroll}
        >
          {loading ? (
            <div className="flex justify-center pt-16">
              <Spinner label="Loading opportunities" />
            </div>
          ) : filteredData.length === 0 ? (
            <EmptyState
              icon={<SearchOffOutlinedIcon sx={{ fontSize: 20 }} />}
              title="No opportunities match"
              message={activeFilters.length > 0 ? "Try removing a filter" : undefined}
              action={
                activeFilters.length > 0 ? (
                  <Button size="sm" onClick={handleResetAll}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredData
                .slice(0, (loadedBatches + 1) * CARD_BATCH_LIMIT)
                .map((research) => (
                  <Card key={research._id} research={research} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterPage;
```

- [ ] **Step 8: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" search`
Expected: `ALL CHECKS PASSED`. Also rerun `bash "$CHECKS/run.sh" layout` and `bash "$CHECKS/run.sh" ui`; both should still pass.

- [ ] **Step 9: Visual check and static checks**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot after search`
Open `$CHECKS/shots/after/search.png` and compare it with `$CHECKS/shots/before/search.png`. Confirm against spec §3.2:
- a canvas-colored filter panel with mono group labels and custom checkboxes;
- the 28px "Search" title with a mono "5 results";
- the search field with the `/` hint;
- white result cards with mono dates and green "Paid" badges.

Then run `bash "$CHECKS/verify.sh"` (timeout 600000). Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 10: Commit**

```bash
git add src/components/FilterSection.tsx src/pages/FilterPage.tsx src/components/Card.tsx src/utils.ts
git commit -m "$(cat <<'EOF'
Redesign the search page and fix Paid matching Unpaid

Brings filters, results and cards onto the shared components; the Paid filter used a substring match that also caught "Unpaid".

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Opportunity detail page

**Files:**
- Modify: `src/pages/InfoPage.tsx` (full rewrite; data logic copied unchanged)
- Modify: `src/components/infopage/InfoPageHeader.tsx` (full rewrite; prop `professorOrLabName` becomes `contacts`)
- Modify: `src/components/infopage/InfoSidebar.tsx`, `ContactsSection.tsx`, `ContactCard.tsx`, `RelatedOpportunitiesSection.tsx`, `OpportunityCard.tsx`, `DeadlineCard.tsx`, `ResumeUploadPopup.tsx` (full rewrites; props unchanged)
- Test: `$CHECKS/info.cjs`

**Interfaces:**
- Consumes: `Button`, `IconButton`, `Surface`, `Badge`, `Meta`, `MetaRow`, `SectionLabel`, `DetailsTable`/`DetailRow`, `Avatar`, `EmptyState`, `Spinner`, `Modal`, `Tag`.
- Produces: `InfoPageHeader` props become `{ title; contacts: [name: string, andrewId: string][]; department: string[]; college: string[]; tags: string[]; isBookmarked; onBookmarkToggle; onApplyClick; position?; compensation?; timeCommitment? }`. Each contact name links to `/professor/<andrewId without any @domain>`.

- [ ] **Step 1: Write the failing check `$CHECKS/info.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

(async () => {
  await withPage('/info/mock-1', async (page) => {
    const h1 = await page.$eval('h1', (el) => ({ size: getComputedStyle(el).fontSize, font: getComputedStyle(el).fontFamily }));
    check('title uses Geist at 36px', h1.size === '36px' && h1.font.startsWith('Geist'), JSON.stringify(h1));
    const body = await page.textContent('body');
    check('eyebrow lists position and hours', body.includes('Research Assistant') && body.includes('8 hrs/week'));
    const labels = (await page.$$eval('dt', (els) => els.map((e) => e.textContent.trim()))).join('|');
    check('Details table lists position, compensation, time', labels.includes('Position|Compensation|Time commitment'), labels);
    check('relevant links open in a new tab with an external icon', (await page.$('a[target=_blank] svg[data-testid=OpenInNewOutlinedIcon]')) !== null);

    await page.getByRole('button', { name: 'Save', exact: true }).click();
    check('Save toggles to Saved', (await page.getByRole('button', { name: 'Saved', exact: true }).getAttribute('aria-pressed')) === 'true');

    await page.getByRole('button', { name: 'Apply now' }).click();
    check('Apply opens the upload dialog', (await page.$('[role=dialog]')) !== null);
    await page.getByRole('button', { name: 'Cancel' }).click();
    check('Cancel closes the upload dialog', (await page.$('[role=dialog]')) === null);

    const profLink = page.locator('header a[href="/professor/lrhercki"]');
    check('professor name links to their profile', (await profLink.count()) === 1);
    await profLink.click();
    await page.waitForURL('**/professor/lrhercki');
    await page.waitForSelector('h1');
    check('profile link lands on the professor page', (await page.textContent('h1')).includes('Lauren Herckis'));
  });

  await withPage('/info/does-not-exist', async (page) => {
    await page.waitForTimeout(1500);
    check('missing opportunity shows its error', (await page.textContent('body')).includes('not found'));
    check('missing opportunity offers Go back', (await page.getByRole('button', { name: 'Go back', exact: true }).count()) === 1);
  });

  done();
})();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" info`
Expected: FAIL on `title uses Geist at 36px` and the checks after it, plus `missing opportunity offers Go back` (the current button reads "Go Back").

- [ ] **Step 3: Rewrite `src/components/infopage/InfoPageHeader.tsx`**

```tsx
import React from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tag from "../Tag";
import Button from "../ui/Button";
import { Meta, MetaRow } from "../ui/Meta";

interface InfoPageHeaderProps {
  title: string;
  contacts: [name: string, andrewId: string][];
  department: string[];
  college: string[];
  tags: string[]; // Combines keywords, colleges, and departments for display
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onApplyClick: () => void;
  position?: string;
  compensation?: string;
  timeCommitment?: string;
}

const profilePath = (andrewId: string) => `/professor/${encodeURIComponent(andrewId.split("@")[0] ?? andrewId)}`;

const InfoPageHeader: React.FC<InfoPageHeaderProps> = ({
  title,
  contacts,
  department,
  college,
  tags,
  isBookmarked,
  onBookmarkToggle,
  onApplyClick,
  position,
  compensation,
  timeCommitment,
}) => {
  const eyebrow = [position, compensation, timeCommitment ? `${timeCommitment} hrs/week` : undefined].filter(
    (part): part is string => Boolean(part)
  );
  const hasSubtitle = contacts.length > 0 || department.length > 0 || college.length > 0;

  return (
    <header className="mb-10 mt-6">
      {eyebrow.length > 0 ? (
        <MetaRow className="mb-3">
          {eyebrow.map((part) => (
            <Meta key={part}>{part}</Meta>
          ))}
        </MetaRow>
      ) : null}

      <h1 className="mb-3 text-display text-ink">{title}</h1>

      {hasSubtitle ? (
        <MetaRow className="mb-5 text-[15px] text-ink-secondary">
          {contacts.length > 0 ? (
            <span>
              {contacts.map(([name, andrewId], i) => (
                <React.Fragment key={andrewId}>
                  {i > 0 ? ", " : null}
                  <Link
                    to={profilePath(andrewId)}
                    className="rounded font-medium text-ink underline decoration-hairline-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    {name}
                  </Link>
                </React.Fragment>
              ))}
            </span>
          ) : null}
          {department.length > 0 ? <span>{department.join(", ")}</span> : null}
          {college.length > 0 ? <span>{college.join(", ")}</span> : null}
        </MetaRow>
      ) : null}

      {tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <Tag key={`${tag}-${i}`} keyword={tag} />
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={onApplyClick} iconRight={<ArrowForwardIcon sx={{ fontSize: 16 }} />}>
          Apply now
        </Button>
        <Button
          onClick={onBookmarkToggle}
          aria-pressed={isBookmarked}
          icon={
            isBookmarked ? (
              <BookmarkIcon sx={{ fontSize: 16 }} />
            ) : (
              <BookmarkIconUnfilled sx={{ fontSize: 16 }} className="text-ink-muted" />
            )
          }
        >
          {isBookmarked ? "Saved" : "Save"}
        </Button>
      </div>
    </header>
  );
};

export default InfoPageHeader;
```

- [ ] **Step 4: Rewrite `src/components/infopage/InfoSidebar.tsx`**

```tsx
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { FaBook } from "react-icons/fa6";
import { TbCoin } from "react-icons/tb";
import { CiCalendar } from "react-icons/ci";
import { ResearchType } from "../../DataTypes";
import Surface from "../ui/Surface";
import SectionLabel from "../ui/SectionLabel";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";

interface InfoSidebarProps {
  info: ResearchType;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({ info }) => {
  const detailRows: DetailRow[] = [];
  if (info.position) detailRows.push({ label: "Position", value: info.position, icon: <FaBook size={12} /> });
  if (info.paidUnpaid) detailRows.push({ label: "Compensation", value: info.paidUnpaid, icon: <TbCoin size={14} /> });
  if (info.timeCommitment)
    detailRows.push({ label: "Time commitment", value: `${info.timeCommitment} hrs / week`, icon: <ScheduleOutlinedIcon sx={{ fontSize: 14 }} /> });
  if (info.desiredSkillLevel)
    detailRows.push({ label: "Skill level", value: info.desiredSkillLevel, icon: <SchoolOutlinedIcon sx={{ fontSize: 14 }} /> });
  if (info.anticipatedEndDate)
    detailRows.push({ label: "Anticipated end", value: info.anticipatedEndDate, icon: <CiCalendar size={14} /> });

  const prereqs = info.prereqs ?? [];
  const contacts = Object.entries(info.contact ?? {});
  const links = info.relevantLinks ?? [];

  return (
    <aside className="space-y-6">
      {detailRows.length > 0 || prereqs.length > 0 ? (
        <section>
          <SectionLabel as="h2" className="mb-2">
            <InfoIcon sx={{ fontSize: 14 }} />
            Details
          </SectionLabel>
          {detailRows.length > 0 ? <DetailsTable rows={detailRows} /> : null}
          {prereqs.length > 0 ? (
            <Surface className="mt-3 p-4">
              <p className="mb-2 font-mono text-meta text-ink-muted">Prerequisites</p>
              <ul className="list-disc space-y-1 pl-4 text-small text-ink">
                {prereqs.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Surface>
          ) : null}
        </section>
      ) : null}

      {contacts.length > 0 ? (
        <section>
          <SectionLabel as="h2" className="mb-2">
            <MailIcon sx={{ fontSize: 14 }} />
            Contact
          </SectionLabel>
          <Surface className="space-y-3 p-4">
            {contacts.map(([name, andrewId]) => (
              <div key={andrewId}>
                <p className="text-small font-medium text-ink">{name}</p>
                <a
                  href={`mailto:${andrewId}@andrew.cmu.edu`}
                  className="break-all font-mono text-meta text-ink-secondary underline-offset-2 hover:text-ink hover:underline"
                >
                  {andrewId}@andrew.cmu.edu
                </a>
              </div>
            ))}
          </Surface>
        </section>
      ) : null}

      {links.length > 0 ? (
        <section>
          <SectionLabel as="h2" className="mb-2">
            <LinkIcon sx={{ fontSize: 14 }} />
            Relevant links
          </SectionLabel>
          <Surface className="space-y-2 p-4">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.startsWith("http") ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-1.5 font-mono text-meta text-ink-secondary hover:text-ink hover:underline"
              >
                <span className="truncate">{link}</span>
                <OpenInNewOutlinedIcon sx={{ fontSize: 13 }} className="shrink-0" />
              </a>
            ))}
          </Surface>
        </section>
      ) : null}
    </aside>
  );
};

export default InfoSidebar;
```

- [ ] **Step 5: Rewrite `src/components/infopage/ContactCard.tsx` and `ContactsSection.tsx`**

`ContactCard.tsx`:
```tsx
import React from "react";
import Surface from "../ui/Surface";
import Avatar from "../ui/Avatar";

interface ContactCardProps {
  headshotUrl: string;
  title: string;
  department: string;
  officeLocation: string;
  email: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ headshotUrl, title, department, officeLocation, email }) => (
  <Surface className="flex w-[260px] shrink-0 flex-col gap-3 p-4">
    <div className="flex items-center gap-3">
      <Avatar src={headshotUrl || undefined} name={title} size="md" />
      <div className="min-w-0">
        <p className="truncate text-body font-medium text-ink">{title}</p>
        {department ? <p className="truncate text-small text-ink-secondary">{department}</p> : null}
        {officeLocation ? <p className="truncate text-small text-ink-muted">{officeLocation}</p> : null}
      </div>
    </div>
    <a
      href={`mailto:${email}`}
      className="truncate border-t border-hairline pt-3 font-mono text-meta text-ink-secondary hover:text-ink hover:underline"
    >
      {email}
    </a>
  </Surface>
);

export default ContactCard;
```

`ContactsSection.tsx`:
```tsx
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import ContactCard from "./ContactCard";
import SectionLabel from "../ui/SectionLabel";

interface Contact {
  headshotUrl: string;
  title: string;
  department: string;
  officeLocation: string;
  email: string;
}

interface ContactsSectionProps {
  contacts: Contact[];
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ contacts }) => (
  <section className="mt-14">
    <SectionLabel as="h2" className="mb-3">
      <PersonIcon sx={{ fontSize: 14 }} />
      Contacts
    </SectionLabel>
    <div className="scrollbar-minimal flex w-full gap-3 overflow-x-auto pb-2">
      {contacts.map((contact, index) => (
        <ContactCard key={index} {...contact} />
      ))}
    </div>
  </section>
);

export default ContactsSection;
```

- [ ] **Step 6: Rewrite `src/components/infopage/OpportunityCard.tsx` and `RelatedOpportunitiesSection.tsx`**

`OpportunityCard.tsx`:
```tsx
import React from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import { BsEyeglasses } from "react-icons/bs";
import { FaBook } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import IconButton from "../ui/IconButton";
import { Meta, MetaRow } from "../ui/Meta";

interface OpportunityCardProps {
  opportunityName: string;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  professorName: string;
  department: string;
  date: string;
  semester: string;
  tags: string[];
}

const iconClass = "shrink-0 text-ink-muted";

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunityName,
  isBookmarked,
  onBookmarkToggle,
  professorName,
  department,
  date,
  semester,
  tags,
}) => {
  const dateLine = [semester, date].filter(Boolean).join(" · ");

  return (
    <Surface as="article" interactive className="flex w-[26rem] shrink-0 flex-col p-[20px]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-card-title text-ink">{opportunityName}</h3>
        <IconButton
          size="sm"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          pressed={isBookmarked}
          onClick={onBookmarkToggle}
        >
          {isBookmarked ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkIconUnfilled sx={{ fontSize: 20 }} />}
        </IconButton>
      </div>

      {professorName || department ? (
        <MetaRow className="mb-2 text-small text-ink-secondary">
          {professorName ? (
            <span className="inline-flex items-center gap-1.5">
              <BsEyeglasses size={16} className={iconClass} />
              {professorName}
            </span>
          ) : null}
          {department ? (
            <span className="inline-flex items-center gap-1.5">
              <FaBook size={13} className={iconClass} />
              {department}
            </span>
          ) : null}
        </MetaRow>
      ) : null}

      {dateLine ? (
        <Meta icon={<CiCalendar size={15} />} className="mb-4">
          {dateLine}
        </Meta>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {tags.slice(0, 3).map((tag, i) => (
            <Tag key={`${tag}-${i}`} keyword={tag} />
          ))}
        </div>
      ) : null}
    </Surface>
  );
};

export default OpportunityCard;
```

`RelatedOpportunitiesSection.tsx`:
```tsx
import React from "react";
import OpportunityCard from "./OpportunityCard";

interface Opportunity {
  opportunityName: string;
  isBookmarked: boolean;
  professorName: string;
  department: string;
  date: string;
  semester: string;
  tags: string[];
}

interface RelatedOpportunitiesSectionProps {
  opportunities: Opportunity[];
}

const RelatedOpportunitiesSection: React.FC<RelatedOpportunitiesSectionProps> = ({ opportunities }) => (
  <section className="mt-14 border-t border-hairline pt-10">
    <h2 className="mb-5 text-heading text-ink">Related opportunities</h2>
    <div className="scrollbar-minimal -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {opportunities.map((opportunity, index) => (
        <OpportunityCard
          key={index}
          opportunityName={opportunity.opportunityName}
          isBookmarked={opportunity.isBookmarked}
          onBookmarkToggle={() => console.log(`Bookmark toggled for ${opportunity.opportunityName}`)}
          professorName={opportunity.professorName}
          department={opportunity.department}
          date={opportunity.date}
          semester={opportunity.semester}
          tags={opportunity.tags}
        />
      ))}
    </div>
  </section>
);

export default RelatedOpportunitiesSection;
```

- [ ] **Step 7: Rewrite `src/components/infopage/DeadlineCard.tsx` and `ResumeUploadPopup.tsx`**

`DeadlineCard.tsx`:
```tsx
import React from "react";
import Surface from "../ui/Surface";
import Badge from "../ui/Badge";

interface DeadlineCardProps {
  deadline: string;
}

export const HourglassIcon = ({ size = 64, color = "currentColor" }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 64 96"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    stroke={color}
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="6" width="52" height="12" rx="2" />
    <rect x="6" y="78" width="52" height="12" rx="2" />
    <path d="M18 18c0 8 14 18 14 30s-14 22-14 30" />
    <path d="M46 18c0 8-14 18-14 30s14 22 14 30" />
    <line x1="28" y1="48" x2="36" y2="48" />
  </svg>
);

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline }) => (
  <Surface className="flex items-center gap-3 p-4">
    <span className="flex text-warning">
      <HourglassIcon size={16} />
    </span>
    <div className="flex flex-col gap-1">
      <p className="text-small font-medium text-ink">Deadline to apply</p>
      <Badge tone="warning" className="self-start">
        {deadline}
      </Badge>
    </div>
  </Surface>
);

export default DeadlineCard;
```

`ResumeUploadPopup.tsx`:
```tsx
import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface ResumeUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File | null) => void;
}

const ResumeUploadPopup: React.FC<ResumeUploadPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedFile);
    setSelectedFile(null); // Clear selected file after submission
    onClose();
  };

  return (
    <Modal
      title="Upload resume"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!selectedFile}>
            Upload
          </Button>
        </>
      }
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        aria-label="Resume file"
        onChange={handleFileChange}
        className="block w-full text-small text-ink-secondary file:mr-3 file:h-[32px] file:cursor-pointer file:rounded-control file:border file:border-solid file:border-hairline-strong file:bg-surface file:px-3 file:text-small file:font-medium file:text-ink hover:file:bg-surface-muted"
      />
      {selectedFile ? <p className="mt-3 font-mono text-meta text-ink-muted">Selected: {selectedFile.name}</p> : null}
    </Modal>
  );
};

export default ResumeUploadPopup;
```

- [ ] **Step 8: Rewrite `src/pages/InfoPage.tsx`**

```tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ResearchType } from "../DataTypes";
import { parseContact, toArray } from "../utils";
import ResumeUploadPopup from "../components/infopage/ResumeUploadPopup";
import InfoPageHeader from "../components/infopage/InfoPageHeader";
import InfoSidebar from "../components/infopage/InfoSidebar";
import ContactsSection from "../components/infopage/ContactsSection";
import RelatedOpportunitiesSection from "../components/infopage/RelatedOpportunitiesSection";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import SectionLabel from "../components/ui/SectionLabel";
import { useSession } from "../lib/authClient";
import DEV_MOCK_RESEARCHES from "../data/devMockResearches";

const InfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<ResearchType | null>(null);
  const [allResearch, setAllResearch] = useState<ResearchType[]>([]);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResumePopup, setShowResumePopup] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id ?? undefined;

  useEffect(() => {
    if (!id) {
      setError("No research ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5050/opportunities/");
        if (!res.ok) {
          throw new Error(`An error occurred: ${res.statusText}`);
        }
        const data: any[] = await res.json();

        const normalizedData = data
          .filter((item) => item["Project Title"])
          .map((item) => ({
            _id: item._id,
            projectTitle: item["Project Title"],
            contact: parseContact(item.Contact),
            department: toArray(item.Department),
            description: item.Description || "No description provided.",
            desiredSkillLevel: item["Desired Skill Level"],
            paidUnpaid: item["Paid/Unpaid"],
            position: item.Position,
            prereqs: toArray(item.Prereqs),
            relevantLinks: toArray(item["Relevant Links"]),
            source: item.Source,
            timeAdded: item["Time Added"],
            timeCommitment: item["Time Commitment"],
            anticipatedEndDate: item["Anticipated End Date"],
            keywords: toArray(item.Keywords),
            college: toArray(item.College),
            profilePicture: item["Profile Picture"],
          })) as ResearchType[];

        const foundResearch = normalizedData.find((item) => item._id === id);
        console.log(foundResearch);

        if (foundResearch) {
          setInfo(foundResearch);
          setAllResearch(normalizedData);
        } else {
          setError(`Research with ID ${id} not found`);
        }
      } catch (err) {
        console.error("Error fetching data", err);
        // Dev-only fallback when the backend is unreachable.
        if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") {
          const found = DEV_MOCK_RESEARCHES.find((item) => item._id === id);
          if (found) {
            setInfo(found);
            setAllResearch(DEV_MOCK_RESEARCHES);
          } else {
            setError(`Research with ID ${id} not found`);
          }
        } else {
          setError("Failed to load research data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchBookmark() {
      if (!info) return;
      // Skip in dev bypass mode — no backend available
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") return;
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const userData = await response.json();
      if (userData.saved.includes(id)) {
        handleSave(info);
      } else {
        handleUnsave(info);
      }
    }

    fetchBookmark();
  }, [info]);

  async function saveUserBookmark(bookmark: boolean, userId: string) {
    const response = await fetch(`/api/users/saved/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        opportunityId: id,
        action: bookmark ? "add" : "remove",
      }),
    });
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    console.log(response);
    console.log(bookmark ? "add" : "remove");
  }

  const handleSave = async (research: ResearchType) => {
    try {
      setSavedStates((prev) => ({ ...prev, [research._id]: true }));
      if (userId != undefined) {
        saveUserBookmark(true, userId);
      }
      console.log("Research saved (Local State):", research._id);
    } catch (error) {
      console.error("Error saving research:", error);
      setSavedStates((prev) => ({ ...prev, [research._id]: false }));
    }
  };

  const handleUnsave = async (research: ResearchType) => {
    try {
      setSavedStates((prev) => ({ ...prev, [research._id]: false }));
      if (userId != undefined) {
        saveUserBookmark(false, userId);
      }
      console.log("Research unsaved (Local State):", research._id);
    } catch (error) {
      console.error("Error unsaving research:", error);
      setSavedStates((prev) => ({ ...prev, [research._id]: true }));
    }
  };

  const handleBookmarkToggle = () => {
    if (!info) return;

    if (savedStates[info._id]) {
      handleUnsave(info);
    } else {
      handleSave(info);
    }
  };

  const handleApply = () => {
    setShowResumePopup(true);
  };

  const handleClosePopup = () => {
    setShowResumePopup(false);
  };

  const handleResumeSubmit = (file: File | null) => {
    if (file) {
      console.log("Resume submitted:", file.name);
      alert(`Resume ${file.name} uploaded successfully!`);
    } else {
      console.log("No resume selected.");
    }
    handleClosePopup();
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const backButton = (
    <Button variant="ghost" size="sm" className="-ml-3" icon={<ArrowBackIcon sx={{ fontSize: 16 }} />} onClick={handleBackClick}>
      Back
    </Button>
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-8 pb-16 pt-8">
        {backButton}
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner label="Loading research information" />
        </div>
      </main>
    );
  }

  if (error || !info) {
    return (
      <main className="mx-auto max-w-6xl px-8 pb-16 pt-8">
        {backButton}
        <EmptyState
          className="mt-8"
          icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />}
          title={error || "Research not found"}
          action={<Button onClick={handleBackClick}>Go back</Button>}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-8 pb-16 pt-8">
      {backButton}

      <InfoPageHeader
        title={info.projectTitle}
        contacts={Object.entries(info.contact)}
        department={info.department || []}
        college={info.college || []}
        tags={[...(info.keywords || []), ...(info.college || []), ...(info.department || [])]}
        isBookmarked={savedStates[info._id] || false}
        onBookmarkToggle={handleBookmarkToggle}
        onApplyClick={handleApply}
        position={info.position}
        compensation={info.paidUnpaid}
        timeCommitment={info.timeCommitment}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionLabel as="h2" className="mb-3">
            About this opportunity
          </SectionLabel>
          {info.description ? (
            <p className="max-w-prose whitespace-pre-line break-words text-[15px] leading-[1.7] text-ink-secondary">
              {info.description}
            </p>
          ) : (
            <p className="text-body italic text-ink-muted">No description available.</p>
          )}
        </section>

        <div className="lg:col-span-1">
          <InfoSidebar info={info} />
        </div>
      </div>

      <ContactsSection
        contacts={Object.entries(info.contact).map(([name, andrewId]) => ({
          headshotUrl: info.profilePicture || "",
          title: name,
          department: info.department.join(", "),
          officeLocation: "",
          email: `${andrewId}@andrew.cmu.edu`,
        }))}
      />

      {/* Related Opportunities Section (Static Data) */}
      <RelatedOpportunitiesSection
        opportunities={[
          {
            opportunityName: "Advanced AI Research",
            isBookmarked: false,
            professorName: "Dr. Alice Wonderland",
            department: "Computer Science",
            date: "2026-03-15",
            semester: "Spring 2026",
            tags: ["AI", "Machine Learning", "Robotics", "Neural Networks"],
          },
          {
            opportunityName: "Quantum Physics Study",
            isBookmarked: true,
            professorName: "Dr. Bob Quantum",
            department: "Physics",
            date: "2026-04-01",
            semester: "Spring 2026",
            tags: ["Quantum Mechanics", "Theoretical Physics", "Astrophysics", "Cosmology"],
          },
          {
            opportunityName: "Bioinformatics Project",
            isBookmarked: false,
            professorName: "Dr. Carol Genetics",
            department: "Biology",
            date: "2026-03-20",
            semester: "Summer 2026",
            tags: ["Bioinformatics", "Genetics", "Data Science", "Biology"],
          },
        ]}
      />

      <ResumeUploadPopup isOpen={showResumePopup} onClose={handleClosePopup} onSubmit={handleResumeSubmit} />
    </main>
  );
};

export default InfoPage;
```

- [ ] **Step 9: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" info`
Expected: `ALL CHECKS PASSED`.

- [ ] **Step 10: Visual check and static checks**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot after info`
Open `$CHECKS/shots/after/info.png` and confirm against spec §3.3:
- a ghost "Back" button;
- a mono eyebrow;
- a 36px Geist title with an underlined professor link;
- a black "Apply now" pill;
- a hairline Details table in the sidebar;
- white contact and related cards.

Then run `bash "$CHECKS/verify.sh"`. Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 11: Commit**

```bash
git add src/pages/InfoPage.tsx src/components/infopage/InfoPageHeader.tsx src/components/infopage/InfoSidebar.tsx src/components/infopage/ContactsSection.tsx src/components/infopage/ContactCard.tsx src/components/infopage/RelatedOpportunitiesSection.tsx src/components/infopage/OpportunityCard.tsx src/components/infopage/DeadlineCard.tsx src/components/infopage/ResumeUploadPopup.tsx
git commit -m "$(cat <<'EOF'
Redesign the opportunity detail page

Moves the page onto shared components and links professor names to their profiles, which were otherwise unreachable once /main was set aside.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Profiles and dashboards

**Files:**
- Create: `src/components/profile/ProfileSummary.tsx`
- Modify: `src/components/profile/ProfileHeader.tsx` (full rewrite; props unchanged)
- Modify: `src/pages/StudentDashboard.tsx` (full rewrite; logic unchanged)
- Modify: `src/pages/ProfessorProfile.tsx` (full rewrite **that keeps the user's uncommitted mock-fallback lines**; staged specially)
- Modify: `src/pages/ProfessorDashboard.tsx` (full rewrite; logic unchanged)
- Modify: `src/components/professor/OpportunityForm.tsx` (full rewrite; logic unchanged)
- Test: `$CHECKS/profiles.cjs`

**Interfaces:**
- Consumes: `Avatar`, `DetailsTable`/`DetailRow`, `IconButton`, `Input`/`fieldClass`, `Button`, `Surface`, `SectionLabel`, `Spinner`, `EmptyState`, `Modal`, `Meta`, `Tag`, `cx`, and `Card`.
- Produces: `ProfileSummary` (default): `{ name: string; title?: string; subtitle?: string; avatarSrc?: string; rows: DetailRow[]; avatarAction?: ReactNode; className?: string }`. `title` defaults to `name`, and `name` feeds the avatar initials.

- [ ] **Step 1: Write the failing check `$CHECKS/profiles.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

const labelsOf = (page) => page.$$eval('dt', (els) => els.map((e) => e.textContent.trim()));

(async () => {
  await withPage('/professor/lrhercki', async (page) => {
    await page.waitForSelector('h1');
    const h1 = await page.$eval('h1', (el) => ({ size: getComputedStyle(el).fontSize, text: el.textContent }));
    check('professor name is a 28px title', h1.size === '28px' && h1.text === 'Professor Lauren Herckis', JSON.stringify(h1));
    const labels = await labelsOf(page);
    check('details table has College, Department, Email', ['College', 'Department', 'Email'].every((l) => labels.includes(l)), labels.join(','));
    check('the one-tab bar is gone', (await page.getByRole('button', { name: 'Research Listing', exact: true }).count()) === 0);
    check('research listings render as cards', (await page.$$('article')).length > 0);
    check('bio renders', (await page.textContent('body')).includes('Lauren Herckis studies'));
  });

  await withPage('/professor/nobody-here', async (page) => {
    await page.waitForTimeout(1500);
    check('unknown professor shows the not-found state', (await page.textContent('body')).includes('Professor not found'));
    check('not-found state uses the empty state panel', (await page.$('svg[data-testid=ErrorOutlineOutlinedIcon]')) !== null);
  });

  await withPage('/dashboard', async (page) => {
    await page.waitForSelector('h1');
    const labels = await labelsOf(page);
    check('student details list Major, Class, Email', ['Major', 'Class', 'Email'].every((l) => labels.includes(l)), labels.join(','));
    await page.getByRole('button', { name: 'Edit major' }).click();
    const major = page.getByRole('textbox', { name: 'Major' });
    await major.fill('Physics');
    await major.press('Enter');
    check('inline major edit saves on Enter', (await page.textContent('dl')).includes('Physics'));
    check('photo edit control is present', (await page.getByRole('button', { name: 'Edit profile picture' }).count()) === 1);
  });

  await withPage('/professor-dashboard', async (page) => {
    await page.getByRole('button', { name: 'Add research opportunity' }).click();
    check('Add opportunity is disabled until the form is valid', await page.getByRole('button', { name: 'Add opportunity' }).isDisabled());
    await page.fill('#projectTitle', 'Test project');
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    check('discarding a non-empty form asks for confirmation', (await page.$('[role=dialog]')) !== null);
    await page.getByRole('button', { name: 'Keep editing' }).click();
    check('Keep editing closes the dialog and keeps the form', (await page.$('[role=dialog]')) === null && (await page.inputValue('#projectTitle')) === 'Test project');
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await page.locator('[role=dialog]').getByRole('button', { name: 'Discard', exact: true }).click();
    check('confirming discard closes the form', (await page.$('#projectTitle')) === null);
  });

  done();
})();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" profiles`
Expected: FAILs, including `professor name is a 28px title` and `details table has College, Department, Email`.

- [ ] **Step 3: Create `src/components/profile/ProfileSummary.tsx`**

```tsx
import React from "react";
import Avatar from "../ui/Avatar";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";
import { cx } from "../ui/cx";

interface ProfileSummaryProps {
  name: string;
  title?: string;
  subtitle?: string;
  avatarSrc?: string;
  rows: DetailRow[];
  avatarAction?: React.ReactNode;
  className?: string;
}

const ProfileSummary = ({ name, title, subtitle, avatarSrc, rows, avatarAction, className }: ProfileSummaryProps) => (
  <section className={cx("mx-auto w-full max-w-4xl", className)}>
    <div className="mb-6 flex items-center gap-6">
      <div className="relative shrink-0">
        <Avatar src={avatarSrc} name={name} size="lg" />
        {avatarAction ? <div className="absolute -bottom-1 -right-1">{avatarAction}</div> : null}
      </div>
      <div className="min-w-0">
        <h1 className="break-words text-title text-ink">{title ?? name}</h1>
        {subtitle ? <p className="mt-1 break-all font-mono text-meta text-ink-muted">{subtitle}</p> : null}
      </div>
    </div>
    <DetailsTable rows={rows} />
  </section>
);

export default ProfileSummary;
```

- [ ] **Step 4: Rewrite `src/components/profile/ProfileHeader.tsx`**

```tsx
import React, { useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import ProfileSummary from "./ProfileSummary";
import IconButton from "../ui/IconButton";
import Input from "../ui/Input";

interface ProfileHeaderProps {
  profileImage?: string;
  name?: string;
  major?: string;
  class?: string;
  email?: string;
  className?: string;
  onProfileImageChange?: (file: File) => void;
  onMajorChange?: (major: string) => void;
}

const ProfileHeader = ({
  profileImage,
  name,
  major,
  class: userClass,
  email,
  className,
  onProfileImageChange,
  onMajorChange,
}: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingMajor, setEditingMajor] = useState(false);
  const [majorValue, setMajorValue] = useState(major || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onProfileImageChange?.(file);
    }
  };

  const handleMajorSave = () => {
    setEditingMajor(false);
    onMajorChange?.(majorValue);
  };

  const handleMajorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleMajorSave();
    if (e.key === "Escape") {
      setMajorValue(major || "");
      setEditingMajor(false);
    }
  };

  const displayImage = previewUrl || profileImage;

  const majorCell = editingMajor ? (
    <Input
      inputSize="sm"
      aria-label="Major"
      value={majorValue}
      onChange={(e) => setMajorValue(e.target.value)}
      onBlur={handleMajorSave}
      onKeyDown={handleMajorKeyDown}
      autoFocus
      containerClassName="w-full max-w-[280px]"
    />
  ) : (
    <span className="flex items-center gap-1">
      {majorValue || "Not set"}
      <IconButton size="sm" aria-label="Edit major" onClick={() => setEditingMajor(true)}>
        <EditOutlinedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </span>
  );

  return (
    <ProfileSummary
      className={className}
      name={name ?? ""}
      title={name || "Your Name"}
      subtitle={email || undefined}
      avatarSrc={displayImage}
      avatarAction={
        <>
          <IconButton size="sm" bordered aria-label="Edit profile picture" onClick={() => fileInputRef.current?.click()}>
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </>
      }
      rows={[
        { label: "Major", value: majorCell, icon: <SchoolOutlinedIcon sx={{ fontSize: 14 }} /> },
        { label: "Class", value: userClass || "Not set", icon: <BadgeOutlinedIcon sx={{ fontSize: 14 }} /> },
        { label: "Email", value: <span className="font-mono">{email || "Not set"}</span>, icon: <MailOutlinedIcon sx={{ fontSize: 14 }} /> },
      ]}
    />
  );
};

export default ProfileHeader;
```

- [ ] **Step 5: Rewrite `src/pages/StudentDashboard.tsx`**

```tsx
import { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useSession } from "../lib/authClient";

const ProfilePage = () => {
  const { data: session } = useSession();

  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMajor, setUserMajor] = useState("");
  const [userClass, setUserClass] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    setUserName(session.user.name ?? "");
    setUserEmail(session.user.email ?? "");
    setProfileImage(session.user.image ?? undefined);
    setUserClass((session.user as any).class ?? "");
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${session.user.id}`, {
          credentials: "include",
        });
        if (!res.ok) return;

        const data = await res.json();
        setUserClass(data.class ?? "");
        setUserMajor(data.major ?? "");
      } catch {
        console.log("Error fetching profile");
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  return (
    <main className="mx-auto max-w-7xl px-8 pb-16 pt-10">
      <ProfileHeader
        profileImage={profileImage}
        name={userName}
        major={userMajor}
        class={userClass}
        email={userEmail}
      />
    </main>
  );
};

export default ProfilePage;
```

- [ ] **Step 6: Rewrite `src/components/professor/OpportunityForm.tsx`**

```tsx
import React, { useState, useEffect, useId } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ResearchOpportunity } from "../../types/ResearchOpportunity";
import { collegeOptions, departmentOptions } from "../../FilterData";
import Tag from "../Tag";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";

type FormData = Omit<ResearchOpportunity, "source" | "timeAdded" | "enableApply">;

interface OpportunityFormProps {
  initialData: FormData;
  onChange: (data: FormData) => void;
}

const paidOptions = ["Paid", "Unpaid"];

const labelClass = "mb-1.5 block text-small font-medium text-ink";
const boxClass = "rounded-control border border-hairline-strong bg-surface p-3";

const Required = () => (
  <span aria-hidden="true" className="mr-1 text-ink-muted">
    *
  </span>
);

interface TagsFieldProps {
  label: string;
  tags: string[];
  input: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (t: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const TagsField: React.FC<TagsFieldProps> = ({ label, tags, input, onInputChange, onAdd, onRemove, onKeyDown, placeholder }) => {
  const inputId = useId();
  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <div className={boxClass}>
        {tags.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag} keyword={tag} onRemove={() => onRemove(tag)} />
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="text"
            className="block w-full border-none bg-transparent p-0 text-body text-ink outline-none placeholder:text-ink-muted"
            placeholder={placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button size="sm" icon={<AddOutlinedIcon sx={{ fontSize: 14 }} />} onClick={onAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

const OpportunityForm: React.FC<OpportunityFormProps> = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [prereqInput, setPrereqInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [contactKey, setContactKey] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [contactEmailError, setContactEmailError] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleContactValueChange = (v: string) => {
    setContactValue(v);
    setContactEmailError(v && !EMAIL_REGEX.test(v) ? "Please enter a valid email address." : "");
  };

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const update = (updates: Partial<FormData>) => {
    setFormData((prev) => {
      const newState = { ...prev, ...updates };
      onChange(newState);
      return newState;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    update({ [id]: value } as Partial<FormData>);
  };

  const addTag = (field: "prereqs" | "relevantLinks" | "keywords", value: string, clear: () => void) => {
    if (!value.trim()) return;
    update({ [field]: [...formData[field], value.trim()] });
    clear();
  };

  const removeTag = (field: "prereqs" | "relevantLinks" | "keywords", tag: string) => {
    update({ [field]: formData[field].filter((t) => t !== tag) });
  };

  const addContact = () => {
    if (!contactKey.trim() || !contactValue.trim()) return;
    if (!EMAIL_REGEX.test(contactValue.trim())) {
      setContactEmailError("Please enter a valid email address.");
      return;
    }
    update({ contact: { ...formData.contact, [contactKey.trim()]: contactValue.trim() } });
    setContactKey("");
    setContactValue("");
    setContactEmailError("");
  };

  const removeContact = (key: string) => {
    const updated = { ...formData.contact };
    delete updated[key];
    update({ contact: updated });
  };

  const toggleArrayField = (field: "colleges" | "department", value: string) => {
    const current = formData[field];
    if (current.includes(value)) {
      update({ [field]: current.filter((v) => v !== value) });
    } else {
      update({ [field]: [...current, value] });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="projectTitle" className={labelClass}>
          <Required />
          Project title
        </label>
        <input
          type="text"
          id="projectTitle"
          className={fieldClass}
          placeholder="Enter project title"
          value={formData.projectTitle}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          <Required />
          Contact
        </label>
        <div className={cx(boxClass, "space-y-2")}>
          {Object.entries(formData.contact).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-2 rounded-[8px] bg-surface-muted py-1 pl-3 pr-1">
              <span className="min-w-0 truncate text-small text-ink">
                <span className="font-medium">{key}</span> <span className="font-mono text-meta text-ink-muted">{value}</span>
              </span>
              <IconButton size="sm" aria-label={`Remove ${key}`} onClick={() => removeContact(key)}>
                <CloseOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </div>
          ))}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="contact-name"
              type="text"
              aria-label="Contact name"
              className={cx(fieldClass, "h-[36px] flex-1")}
              placeholder="Full name"
              value={contactKey}
              onChange={(e) => setContactKey(e.target.value)}
            />
            <div className="flex flex-1 flex-col">
              <input
                type="text"
                aria-label="Contact email"
                aria-invalid={Boolean(contactEmailError)}
                className={cx(fieldClass, "h-[36px]", contactEmailError && "border-danger focus:border-danger")}
                placeholder="Email"
                value={contactValue}
                onChange={(e) => handleContactValueChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addContact();
                  }
                }}
              />
              {contactEmailError ? <span className="mt-1 text-meta text-danger">{contactEmailError}</span> : null}
            </div>
            <Button size="sm" className="h-[36px]" icon={<AddOutlinedIcon sx={{ fontSize: 14 }} />} onClick={addContact}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="colleges-select" className={labelClass}>
          <Required />
          Colleges
        </label>
        <div className={boxClass}>
          {formData.colleges.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {formData.colleges.map((c) => (
                <Tag key={c} keyword={c} onRemove={() => toggleArrayField("colleges", c)} />
              ))}
            </div>
          ) : null}
          <select
            id="colleges-select"
            className={fieldClass}
            value=""
            onChange={(e) => {
              if (e.target.value) toggleArrayField("colleges", e.target.value);
            }}
          >
            <option value="">Select a college</option>
            {collegeOptions
              .filter((opt) => !formData.colleges.includes(opt.value))
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="department-select" className={labelClass}>
          <Required />
          Department
        </label>
        <div className={boxClass}>
          {formData.department.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {formData.department.map((d) => (
                <Tag key={d} keyword={d} onRemove={() => toggleArrayField("department", d)} />
              ))}
            </div>
          ) : null}
          <select
            id="department-select"
            className={fieldClass}
            value=""
            onChange={(e) => {
              if (e.target.value) toggleArrayField("department", e.target.value);
            }}
          >
            <option value="">Select a department</option>
            {departmentOptions
              .filter((opt) => !formData.department.includes(opt.value))
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          <Required />
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          className={cx(fieldClass, "resize-y")}
          placeholder="Describe the research opportunity"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="desiredSkillLevel" className={labelClass}>
          Desired skill level
        </label>
        <input
          type="text"
          id="desiredSkillLevel"
          className={fieldClass}
          placeholder="e.g. Undergraduate Students, Masters Students"
          value={formData.desiredSkillLevel}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="paidUnpaid" className={labelClass}>
          <Required />
          Paid/Unpaid
        </label>
        <select id="paidUnpaid" className={fieldClass} value={formData.paidUnpaid} onChange={handleChange}>
          <option value="">Select compensation type</option>
          {paidOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="position" className={labelClass}>
          <Required />
          Position
        </label>
        <input
          type="text"
          id="position"
          className={fieldClass}
          placeholder="e.g. Independent Study"
          value={formData.position}
          onChange={handleChange}
        />
      </div>

      <TagsField
        label="Prerequisites"
        tags={formData.prereqs}
        input={prereqInput}
        onInputChange={setPrereqInput}
        onAdd={() => addTag("prereqs", prereqInput, () => setPrereqInput(""))}
        onRemove={(t) => removeTag("prereqs", t)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("prereqs", prereqInput, () => setPrereqInput(""));
          }
        }}
        placeholder="e.g. Machine Learning with Python"
      />

      <TagsField
        label="Relevant links"
        tags={formData.relevantLinks}
        input={linkInput}
        onInputChange={setLinkInput}
        onAdd={() => addTag("relevantLinks", linkInput, () => setLinkInput(""))}
        onRemove={(t) => removeTag("relevantLinks", t)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("relevantLinks", linkInput, () => setLinkInput(""));
          }
        }}
        placeholder="e.g. https://www.scottylabs.org/"
      />

      <div>
        <label htmlFor="timeCommitment" className={labelClass}>
          Time commitment (hrs/week)
        </label>
        <input
          type="number"
          id="timeCommitment"
          className={fieldClass}
          placeholder="e.g. 5"
          min="0"
          step="1"
          value={formData.timeCommitment}
          onChange={(e) => update({ timeCommitment: Math.trunc(Math.max(0, Number(e.target.value))).toString() })}
        />
      </div>

      <div>
        <label htmlFor="anticipatedEndDate" className={labelClass}>
          <Required />
          Anticipated end date
        </label>
        <input
          type="text"
          id="anticipatedEndDate"
          className={fieldClass}
          placeholder="e.g. May 2026"
          value={formData.anticipatedEndDate}
          onChange={handleChange}
        />
      </div>

      <TagsField
        label="Keywords"
        tags={formData.keywords}
        input={keywordInput}
        onInputChange={setKeywordInput}
        onAdd={() => addTag("keywords", keywordInput, () => setKeywordInput(""))}
        onRemove={(t) => removeTag("keywords", t)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("keywords", keywordInput, () => setKeywordInput(""));
          }
        }}
        placeholder="e.g. Computer Vision"
      />
    </div>
  );
};

export default OpportunityForm;
```

- [ ] **Step 7: Rewrite `src/pages/ProfessorDashboard.tsx`**

```tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { FaHouse } from "react-icons/fa6";
import { useSession } from "../lib/authClient";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import OpportunityForm from "../components/professor/OpportunityForm";
import ProfileSummary from "../components/profile/ProfileSummary";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

type FormData = Omit<ResearchOpportunity, "source" | "timeAdded" | "enableApply">;

const emptyOpportunity: FormData = {
  projectTitle: "",
  contact: {},
  department: [],
  description: "",
  desiredSkillLevel: "",
  paidUnpaid: "",
  position: "",
  prereqs: [],
  relevantLinks: [],
  timeCommitment: "",
  anticipatedEndDate: "",
  keywords: [],
  colleges: [],
};

const isFormValid = (data: FormData): boolean => {
  return (
    data.projectTitle.trim() !== "" &&
    Object.keys(data.contact).length > 0 &&
    data.colleges.length > 0 &&
    data.department.length > 0 &&
    data.paidUnpaid !== "" &&
    data.description.trim() !== "" &&
    data.position.trim() !== "" &&
    data.anticipatedEndDate.trim() !== ""
  );
};

const isFormNonempty = (data: FormData): boolean => {
  return (
    data.projectTitle !== "" ||
    Object.keys(data.contact).length > 0 ||
    data.department.length > 0 ||
    data.description !== "" ||
    data.desiredSkillLevel !== "" ||
    data.paidUnpaid !== "" ||
    data.position !== "" ||
    data.prereqs.length > 0 ||
    data.relevantLinks.length > 0 ||
    data.timeCommitment !== "" ||
    data.anticipatedEndDate !== "" ||
    data.keywords.length > 0 ||
    data.colleges.length > 0
  );
};

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const college = undefined;
  const department = undefined;

  const defaultOpportunity = (): FormData => ({
    ...emptyOpportunity,
    contact: name || email ? { [name || email]: email } : {},
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<FormData>(defaultOpportunity);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleAdd = async () => {
    if (!isFormValid(newOpportunity)) return;

    const now = new Date();
    const timeAdded = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;
    const opportunity: ResearchOpportunity = {
      ...newOpportunity,
      source: "Created by " + name,
      timeAdded,
      enableApply: false,
    };

    // Attempts to add the opportunity to the database
    try {
      const res = await fetch("http://localhost:5050/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(opportunity),
      });

      if (!res.ok) throw new Error(await res.text());
      setSubmitError("");
      setNewOpportunity(defaultOpportunity());
      setShowCreateForm(false);
    } catch (err) {
      setSubmitError("Failed to save opportunity. Please try again.");
      console.error(err);
    }
  };

  const handleDiscard = () => {
    if (isFormNonempty(newOpportunity)) {
      setShowConfirmDiscard(true);
    } else {
      setShowCreateForm(false);
    }
  };

  const confirmDiscard = () => {
    setShowConfirmDiscard(false);
    setNewOpportunity(defaultOpportunity());
    setShowCreateForm(false);
  };

  return (
    <main className="mx-auto max-w-4xl px-8 pb-16 pt-10">
      <ProfileSummary
        name={name}
        title={name || "Your Name"}
        subtitle={email || undefined}
        rows={[
          { label: "College", value: college ?? "Not set", icon: <FaHouse size={12} /> },
          { label: "Department", value: department ?? "Not set", icon: <ApartmentOutlinedIcon sx={{ fontSize: 14 }} /> },
          { label: "Email", value: <span className="font-mono">{email || "Not set"}</span>, icon: <MailOutlinedIcon sx={{ fontSize: 14 }} /> },
        ]}
      />

      {!showCreateForm ? (
        <div className="mt-8 flex justify-center">
          <Button variant="primary" icon={<AddOutlinedIcon sx={{ fontSize: 16 }} />} onClick={() => setShowCreateForm(true)}>
            Add research opportunity
          </Button>
        </div>
      ) : (
        <section className="mt-10">
          <h2 className="mb-5 text-heading text-ink">Create new opportunity</h2>
          <OpportunityForm initialData={newOpportunity} onChange={(data) => setNewOpportunity(data)} />
          {submitError ? (
            <p role="alert" className="mt-6 text-small text-danger">
              {submitError}
            </p>
          ) : null}
          <div className="mt-8 flex justify-end gap-2">
            <Button onClick={handleDiscard}>Discard</Button>
            <Button variant="primary" onClick={handleAdd} disabled={!isFormValid(newOpportunity)}>
              Add opportunity
            </Button>
          </div>
        </section>
      )}

      {showConfirmDiscard ? (
        <Modal
          title="Discard this opportunity?"
          footer={
            <>
              <Button onClick={() => setShowConfirmDiscard(false)}>Keep editing</Button>
              <Button variant="danger" onClick={confirmDiscard}>
                Discard
              </Button>
            </>
          }
        >
          The form has unsaved changes. Discarding clears everything you&rsquo;ve entered.
        </Modal>
      ) : null}
    </main>
  );
};

export default ProfessorDashboard;
```

- [ ] **Step 8: Rewrite `src/pages/ProfessorProfile.tsx`, keeping the user's mock fallback**

First Read the file. Keep all fetch logic, **including the three uncommitted mock pieces**: the `getDevMockProfessor` import and the two `if (import.meta.env.DEV && …VITE_DEV_BYPASS_AUTH === "true") { … }` blocks. The full new content is:

```tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { FaHouse } from "react-icons/fa6";
import { ProfessorType } from "../DataTypes";
import { getDummyResearchForProfessor } from "../data/dummyProfessorResearch";
import { getDevMockProfessor } from "../data/devMockProfessors";
import { professorBioPlainText } from "../utils";
import Card from "../components/Card";
import ProfileSummary from "../components/profile/ProfileSummary";
import Surface from "../components/ui/Surface";
import SectionLabel from "../components/ui/SectionLabel";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { Meta } from "../components/ui/Meta";

const professorApiUrl = (param: string) =>
  `http://localhost:5050/professors/${encodeURIComponent(param.trim())}`;

const professorProjectsApiUrl = (param: string) =>
  `http://localhost:5050/opportunities/professor/${encodeURIComponent(param.trim())}`;

const ProfessorProfile = () => {
  const { andrewId } = useParams<{ andrewId: string }>();
  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = andrewId?.trim();
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchProfessor = async () => {
      try {
        const res = await fetch(professorApiUrl(id));
        if (!res.ok) {
          if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") {
            const mock = getDevMockProfessor(id);
            if (mock) {
              setProfessor(mock);
              return;
            }
          }
          setError(true);
          return;
        }
        const data = await res.json();
        setProfessor({
          _id: data._id,
          name: data.Name ?? "",
          department: Array.isArray(data.Department)
            ? data.Department
            : data.Department
              ? [data.Department]
              : [],
          college: Array.isArray(data.College)
            ? data.College
            : data.College
              ? [data.College]
              : [],
          email: data.Email ?? data.email ?? "",
          phoneNumber: data["Phone Number"],
          bio: data.Bio,
          media: data.Media,
          positions: data.Positions,
          tags: data.Tags,
          profilePicture: data["Profile Picture"],
        });

        let andrew_id = data.Email.split("@")[0];
        const resProjects = await fetch(professorProjectsApiUrl(andrew_id));
        const projects_data = await resProjects.json();
        console.log(projects_data);
      } catch {
        if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") {
          const mock = getDevMockProfessor(id);
          if (mock) {
            setProfessor(mock);
            return;
          }
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfessor();
  }, [andrewId]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading professor" />
      </main>
    );
  }

  if (error || !professor) {
    return (
      <main className="mx-auto max-w-4xl px-8 pt-10">
        <EmptyState icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />} title="Professor not found." />
      </main>
    );
  }

  const dummyResearch = getDummyResearchForProfessor(professor.name, andrewId ?? "");

  const bioText = professorBioPlainText(professor.bio);

  return (
    <main className="mx-auto max-w-4xl px-8 pb-16 pt-10">
      <ProfileSummary
        name={professor.name}
        title={`Professor ${professor.name}`}
        subtitle={professor.email || undefined}
        avatarSrc={professor.profilePicture}
        rows={[
          {
            label: "College",
            value: professor.college.length > 0 ? professor.college.join(", ") : "Not set",
            icon: <FaHouse size={12} />,
          },
          {
            label: "Department",
            value: professor.department.length > 0 ? professor.department.join(", ") : "Not set",
            icon: <ApartmentOutlinedIcon sx={{ fontSize: 14 }} />,
          },
          {
            label: "Email",
            value: <span className="font-mono">{professor.email}</span>,
            icon: <MailOutlinedIcon sx={{ fontSize: 14 }} />,
          },
        ]}
      />

      <section className="mt-10">
        <SectionLabel as="h2" className="mb-2">
          Bio
        </SectionLabel>
        <Surface className="p-5">
          <p className="whitespace-pre-line text-body text-ink-secondary">{bioText || "No bio available."}</p>
        </Surface>
      </section>

      <section className="mt-10">
        <SectionLabel as="h2" className="mb-2" action={<Meta>{dummyResearch.length} listings</Meta>}>
          Research listings
        </SectionLabel>
        <div className="flex flex-col gap-3">
          {dummyResearch.map((research) => (
            <Card key={research._id} research={research} showApplyButton />
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <Button>View all</Button>
      </div>
    </main>
  );
};

export default ProfessorProfile;
```

- [ ] **Step 9: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" profiles`
Expected: `ALL CHECKS PASSED`. Also rerun `bash "$CHECKS/run.sh" info`; the professor-link check lands on this page and should still pass.

- [ ] **Step 10: Visual check and static checks**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot after professor && bash "$CHECKS/run.sh" shoot after student-profile && bash "$CHECKS/run.sh" shoot after professor-dashboard`
Open the three PNGs and confirm against spec §3.4–§3.7:
- a 96px avatar next to a 28px name with a mono email;
- a hairline details table with row icons;
- a white Bio surface;
- a black "Add research opportunity" pill.

Then run `bash "$CHECKS/verify.sh"`. Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 11: Commit without the user's mock fallback**

Stage everything except `ProfessorProfile.tsx` normally. Then stage a copy of `ProfessorProfile.tsx` with the mock pieces removed, without touching the working tree:

```bash
CHECKS=C:/Users/Bryan/AppData/Local/Temp/claude/c--Users-Bryan-Downloads-CMU-Research/5ac71def-0bf8-4853-b02a-78debe604ff1/scratchpad/redesign-checks
git add src/components/profile/ProfileSummary.tsx src/components/profile/ProfileHeader.tsx src/pages/StudentDashboard.tsx src/pages/ProfessorDashboard.tsx src/components/professor/OpportunityForm.tsx
node -e '
const fs = require("fs");
const src = fs.readFileSync("src/pages/ProfessorProfile.tsx", "utf8").replace(/\r\n/g, "\n");
const importLine = "import { getDevMockProfessor } from \"../data/devMockProfessors\";\n";
const block = /^[ \t]*if \(import\.meta\.env\.DEV && import\.meta\.env\.VITE_DEV_BYPASS_AUTH === "true"\) \{\n[ \t]*const mock = getDevMockProfessor\(id\);\n[ \t]*if \(mock\) \{\n[ \t]*setProfessor\(mock\);\n[ \t]*return;\n[ \t]*\}\n[ \t]*\}\n/gm;
if (!src.includes(importLine)) throw new Error("mock import not found");
const found = src.match(block) || [];
if (found.length !== 2) throw new Error("expected 2 mock blocks, found " + found.length);
const out = src.replace(importLine, "").replace(block, "");
if (out.includes("getDevMockProfessor")) throw new Error("mock reference left behind");
fs.writeFileSync(process.argv[1], out);
' "$CHECKS/ProfessorProfile.no-mocks.tsx"
blob=$(git hash-object -w "$CHECKS/ProfessorProfile.no-mocks.tsx")
git update-index --cacheinfo 100644,"$blob",src/pages/ProfessorProfile.tsx
git diff --cached -- src/pages/ProfessorProfile.tsx | grep -c getDevMockProfessor
git diff -- src/pages/ProfessorProfile.tsx
```

Expected:
- the `grep -c` prints `0`;
- the final `git diff` (working tree vs. index) shows **only** the added `getDevMockProfessor` import and the two added mock blocks (about 15 `+` lines, no `-` lines);
- `git status --short` still lists `?? src/data/devMockProfessors.ts`, which is never staged.

Then commit:

```bash
git commit -m "$(cat <<'EOF'
Redesign profiles, dashboards and the opportunity form

Replaces three copies of the profile header with one summary component and a details table.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
git status --short
```
Expected after the commit: ` M src/pages/ProfessorProfile.tsx` (the mock lines only) and `?? src/data/devMockProfessors.ts`.

---

### Task 8: Storybook-only profile sections

These components aren't routed anywhere, so the gallery renders them for checks.

**Files:**
- Modify: `src/components/profile/BioBlurbSection.tsx`, `InterestsSkillsSection.tsx`, `PreviousExperiencesSection.tsx`, `ExperienceForm.tsx` (full rewrites; logic unchanged)
- Test: `gallery/ProfileSection.tsx`, `gallery/main.tsx`, `$CHECKS/profile-sections.cjs`

**Interfaces:**
- Consumes: `Surface`, `Button`, `IconButton`, `Input`/`fieldClass`, `Modal`, `Meta`, `MetaRow`, `Tag`, `cx`.
- Produces: no new interfaces. All props stay the same.

- [ ] **Step 1: Add the gallery section**

`gallery/ProfileSection.tsx`:
```tsx
import { useState } from "react";
import BioBlurbSection from "../src/components/profile/BioBlurbSection";
import InterestsSkillsSection from "../src/components/profile/InterestsSkillsSection";
import PreviousExperiencesSection from "../src/components/profile/PreviousExperiencesSection";
import { Experience } from "../src/types/Experience";

const sampleExperiences: Experience[] = [
  {
    id: "1",
    title: "Undergraduate Researcher",
    professorOrCompany: "Aaron Jones",
    topic: "Robotics",
    date: "2025-09-01",
    endDate: "2026-05-01",
    level: "Undergraduate",
    associatedTags: ["CAD", "Prototyping"],
    description: "Built soft pneumatic grippers.",
  },
];

const ProfileSection = () => {
  const [items, setItems] = useState(["Robotics", "HCI"]);
  const [editingAll, setEditingAll] = useState(false);
  const [adding, setAdding] = useState(false);

  return (
    <section data-testid="profile-sections" style={{ display: "grid", gap: 24 }}>
      <BioBlurbSection initialBio="I like robots." />
      <InterestsSkillsSection items={items} onAddItem={(item) => setItems((prev) => [...prev, item])} />
      <PreviousExperiencesSection
        initialExperiences={sampleExperiences}
        isEditingAllExperiences={editingAll}
        onEditExperiencesClick={() => setEditingAll(true)}
        onBackToProfileClick={() => setEditingAll(false)}
        isAddingNewExperience={adding}
        onAddExperienceClick={() => {
          setEditingAll(false);
          setAdding(true);
        }}
        onCancelAddExperienceClick={() => setAdding(false)}
      />
    </section>
  );
};

export default ProfileSection;
```

In `gallery/main.tsx`:
- replace `import CardSection from "./CardSection";` with:
  ```tsx
  import CardSection from "./CardSection";
  import ProfileSection from "./ProfileSection";
  ```
- replace `<CardSection />` with:
  ```tsx
  <CardSection />
            <ProfileSection />
  ```

- [ ] **Step 2: Write the failing check `$CHECKS/profile-sections.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

(async () => {
  await withPage('/gallery/index.html', async (page) => {
    const root = '[data-testid=profile-sections]';
    const fonts = await page.$$eval(`${root} h2`, (els) => els.map((e) => getComputedStyle(e).fontFamily));
    check('section headings use Geist, not Jersey', fonts.length >= 3 && fonts.every((f) => f.startsWith('Geist')), fonts.join(' | '));

    await page.getByRole('button', { name: 'Edit bio' }).click();
    check('bio edit opens a textarea', (await page.$(`${root} textarea`)) !== null);
    await page.locator(root).getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: 'Add item' }).click();
    check('interests add opens a dialog', (await page.$('[role=dialog]')) !== null);
    await page.getByRole('textbox', { name: 'New interest or skill' }).fill('Vision');
    await page.locator('[role=dialog]').getByRole('button', { name: 'Add', exact: true }).click();
    check('added interest appears as a tag', (await page.textContent(root)).includes('Vision'));

    check('experience card renders', (await page.textContent(root)).includes('Undergraduate Researcher'));
    await page.getByRole('button', { name: 'Edit experiences' }).click();
    check('edit-all view opens', (await page.textContent(root)).includes('Edit all experiences'));
  });
  done();
})();
```

- [ ] **Step 3: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" profile-sections`
Expected: `FAIL  section headings use Geist, not Jersey` (they currently use Jersey 25) plus later FAILs.

- [ ] **Step 4: Rewrite `src/components/profile/BioBlurbSection.tsx`**

```tsx
// Currently an unused feature for the student dashboard.

import React, { useState, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";

interface BioBlurbSectionProps {
  initialBio?: string;
  onSave?: (bio: string) => void;
}

const BioBlurbSection: React.FC<BioBlurbSectionProps> = ({ initialBio = "", onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBio, setCurrentBio] = useState(initialBio);

  useEffect(() => {
    setCurrentBio(initialBio);
  }, [initialBio]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveBio = () => {
    if (onSave) {
      onSave(currentBio);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentBio(initialBio);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentBio(e.target.value);
  };

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-1">
        <h2 className="text-heading text-ink">Bio</h2>
        {!isEditing ? (
          <IconButton size="sm" aria-label="Edit bio" onClick={handleEditClick}>
            <FaPencil size={13} />
          </IconButton>
        ) : null}
      </div>
      <Surface className="p-4">
        {isEditing ? (
          <>
            <textarea
              aria-label="Bio"
              className={cx(fieldClass, "resize-none")}
              rows={5}
              value={currentBio}
              onChange={handleChange}
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveBio}>
                Save
              </Button>
            </div>
          </>
        ) : (
          <p className="whitespace-pre-wrap text-body text-ink-secondary">
            {initialBio || "No bio yet. Click edit to add one."}
          </p>
        )}
      </Surface>
    </section>
  );
};

export default BioBlurbSection;
```

- [ ] **Step 5: Rewrite `src/components/profile/InterestsSkillsSection.tsx`**

```tsx
// Currently an unused feature for the student dashboard.

import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

interface InterestsSkillsSectionProps {
  items?: string[];
  onAddItem?: (item: string) => void;
  onRemoveItem?: (item: string) => void;
}

const InterestsSkillsSection = ({ items = [], onAddItem }: InterestsSkillsSectionProps) => {
  const [newItem, setNewItem] = useState(""); // Single state for new item
  const [showPopup, setShowPopup] = useState(false); // Single state for popup

  const handleAddItem = () => {
    if (newItem.trim() !== "" && onAddItem) {
      onAddItem(newItem.trim());
      setNewItem("");
      setShowPopup(false);
    }
  };

  return (
    <section className="relative mb-8">
      <h2 className="mb-3 text-heading text-ink">Interests &amp; Skills</h2>

      <Surface className="scrollbar-minimal flex max-h-72 flex-wrap items-center gap-1.5 overflow-y-auto p-4">
        {items.map((item) => (
          <Tag key={item} keyword={item} />
        ))}
        <Button size="sm" icon={<AddOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => setShowPopup(true)}>
          Add item
        </Button>
      </Surface>

      {showPopup ? (
        <Modal
          title="Add a new interest or skill"
          footer={
            <>
              <Button onClick={() => setShowPopup(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddItem}>
                Add
              </Button>
            </>
          }
        >
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter new interest or skill..."
            aria-label="New interest or skill"
            autoFocus
          />
        </Modal>
      ) : null}
    </section>
  );
};

export default InterestsSkillsSection;
```

- [ ] **Step 6: Rewrite `src/components/profile/ExperienceForm.tsx`**

```tsx
import React, { useState, useEffect } from "react";
import { Experience } from "../../types/Experience";
import Tag from "../Tag";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";

interface ExperienceFormProps {
  initialData: Omit<Experience, "id">;
  onChange: (data: Omit<Experience, "id">) => void;
}

const labelClass = "mb-1.5 block text-small font-medium text-ink";

const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState<Omit<Experience, "id">>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [id]: value };
      onChange(newState);
      return newState;
    });
  };

  const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      const newTag = e.currentTarget.value.trim();
      setFormData((prev) => {
        const updatedTags = [...(prev.associatedTags || []), newTag];
        const newState = { ...prev, associatedTags: updatedTags };
        onChange(newState);
        return newState;
      });
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input type="text" id="title" className={fieldClass} placeholder="Enter position name/title" value={formData.title} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="professorOrCompany" className={labelClass}>Professor/Advisor name</label>
        <input type="text" id="professorOrCompany" className={fieldClass} placeholder="Enter professor/advisor name" value={formData.professorOrCompany} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="topic" className={labelClass}>Department/Area</label>
        <input type="text" id="topic" className={fieldClass} placeholder="Enter department/area" value={formData.topic} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="level" className={labelClass}>Education level</label>
        <select id="level" className={fieldClass} value={formData.level} onChange={handleChange}>
          <option value="">Select education level</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
          <option value="Industry">Industry</option>
          <option value="High School">High School</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className={labelClass}>Start time</label>
        <input type="date" id="date" className={fieldClass} value={formData.date} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="endDate" className={labelClass}>End time</label>
        <input type="date" id="endDate" className={fieldClass} value={formData.endDate} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea id="description" rows={4} className={cx(fieldClass, "resize-y")} placeholder="Enter description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="skills" className={labelClass}>Skills</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {formData.associatedTags.map((tag) => (
            <Tag key={tag} keyword={tag} />
          ))}
          <input id="skills" type="text" className={cx(fieldClass, "h-[32px] w-auto py-1")} placeholder="+ Add skills" onKeyDown={handleTagsChange} />
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;
```

- [ ] **Step 7: Rewrite `src/components/profile/PreviousExperiencesSection.tsx`**

Keep the `setNewExperienceText({ title: "", … })` object in `handleAddExperience` exactly as written, without `endDate`. It is a baseline type error, and fixing it is out of scope.

```tsx
// Currently an unused feature for the student dashboard.

import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Experience } from "../../types/Experience";
import ExperienceForm from "./ExperienceForm";
import { FaPencil } from "react-icons/fa6";
import { BsEyeglasses } from "react-icons/bs";
import { FaHouse, FaBook } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Modal from "../ui/Modal";
import { Meta, MetaRow } from "../ui/Meta";

interface PreviousExperiencesSectionProps {
  initialExperiences?: Experience[];
  onSave?: (experiences: Experience[]) => void;
  onEditExperiencesClick: () => void;
  onBackToProfileClick: () => void;
  isEditingAllExperiences: boolean;
  onAddExperienceClick: () => void;
  onCancelAddExperienceClick: () => void;
  isAddingNewExperience: boolean;
}

const iconClass = "shrink-0 text-ink-muted";
const fieldLabel = "font-medium text-ink";

const PreviousExperiencesSection = ({
  initialExperiences = [],
  onSave,
  onEditExperiencesClick,
  onBackToProfileClick,
  isEditingAllExperiences,
  onAddExperienceClick,
  onCancelAddExperienceClick,
  isAddingNewExperience,
}: PreviousExperiencesSectionProps) => {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [currentEditText, setCurrentEditText] = useState<Experience | null>(null);
  const [newExperienceText, setNewExperienceText] = useState<Omit<Experience, "id">>({
    title: "",
    professorOrCompany: "",
    topic: "",
    date: "",
    endDate: "",
    level: "",
    associatedTags: [],
    description: "",
  });
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);

  const handleSave = () => {
    onSave?.(experiences);
  };

  const handleEditClick = (experience: Experience) => {
    setEditingExperienceId(experience.id);
    setCurrentEditText(experience);
  };

  const handleSaveEdit = (id: string) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...currentEditText!, id: id } : exp))
    );
    setEditingExperienceId(null);
    setCurrentEditText(null);
    handleSave();
  };

  const handleCancelEdit = () => {
    setEditingExperienceId(null);
    setCurrentEditText(null);
  };

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    handleSave();
    setShowConfirmDeleteModal(false);
    setExperienceToDelete(null);
  };

  const handleAddExperience = () => {
    const newId = Date.now().toString(); // Simple unique ID generation
    setExperiences((prev) => [...prev, { id: newId, ...newExperienceText }]);
    setNewExperienceText({
      title: "",
      professorOrCompany: "",
      topic: "",
      date: "",
      level: "",
      associatedTags: [],
      description: "",
    }); // Reset form after adding
    handleSave();
    onCancelAddExperienceClick(); // Close the add experience view
  };

  return (
    <section className="mb-8">
      {!isEditingAllExperiences && !isAddingNewExperience ? (
        <>
          <div className="mb-3 flex items-center gap-1">
            <h2 className="text-heading text-ink">Previous Experiences</h2>
            <IconButton size="sm" aria-label="Edit experiences" onClick={onEditExperiencesClick}>
              <FaPencil size={13} />
            </IconButton>
          </div>
          <div className="space-y-3">
            {experiences.length === 0 ? (
              <p className="text-body text-ink-muted">No previous experiences added yet.</p>
            ) : (
              experiences.map((experience) => (
                <Surface key={experience.id} as="article" interactive className="p-[20px]">
                  <h3 className="mb-2 truncate text-card-title text-ink">{experience.title}</h3>
                  <MetaRow className="mb-2 text-small text-ink-secondary">
                    {experience.professorOrCompany ? (
                      <span className="inline-flex items-center gap-1.5">
                        <BsEyeglasses size={16} className={iconClass} />
                        {experience.professorOrCompany}
                      </span>
                    ) : null}
                    {experience.topic ? (
                      <span className="inline-flex items-center gap-1.5">
                        <FaHouse size={13} className={iconClass} />
                        {experience.topic}
                      </span>
                    ) : null}
                    {experience.level ? (
                      <span className="inline-flex items-center gap-1.5">
                        <FaBook size={13} className={iconClass} />
                        {experience.level}
                      </span>
                    ) : null}
                  </MetaRow>
                  {experience.date ? (
                    <Meta icon={<CiCalendar size={15} />} className="mb-3">
                      {experience.date}
                      {experience.endDate ? ` – ${experience.endDate}` : ""}
                    </Meta>
                  ) : null}
                  {experience.associatedTags.length > 0 ? (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {experience.associatedTags.map((tag) => (
                        <Tag key={tag} keyword={tag} />
                      ))}
                    </div>
                  ) : null}
                  <p className="line-clamp-3 text-body text-ink-secondary">
                    {experience.description?.substring(0, 300)}
                    {experience.description?.length > 200 && "..."}
                  </p>
                </Surface>
              ))
            )}
          </div>
        </>
      ) : isEditingAllExperiences ? (
        <div>
          <h3 className="mb-4 text-heading text-ink">Edit all experiences</h3>
          <div className="space-y-3">
            {experiences.map((experience) => (
              <Surface key={experience.id} className="p-4">
                {editingExperienceId === experience.id ? (
                  <>
                    <ExperienceForm
                      initialData={currentEditText!}
                      onChange={(data) => setCurrentEditText({ ...data, id: experience.id })}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button size="sm" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setExperienceToDelete(experience.id);
                          setShowConfirmDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => handleSaveEdit(experience.id)}>
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1 text-small text-ink-secondary">
                      <h4 className="text-body font-semibold text-ink">{experience.title}</h4>
                      <p><span className={fieldLabel}>Professor/Company:</span> {experience.professorOrCompany}</p>
                      <p><span className={fieldLabel}>Topic:</span> {experience.topic}</p>
                      <p><span className={fieldLabel}>Date:</span> {experience.date}</p>
                      <p><span className={fieldLabel}>Level:</span> {experience.level}</p>
                      {experience.associatedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {experience.associatedTags.map((tag) => (
                            <Tag key={tag} keyword={tag} />
                          ))}
                        </div>
                      ) : null}
                      <p className="pt-1 leading-relaxed">{experience.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleEditClick(experience)}>
                      Edit
                    </Button>
                  </div>
                )}
              </Surface>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={onBackToProfileClick}>Back to profile</Button>
            <Button variant="primary" icon={<AddOutlinedIcon sx={{ fontSize: 16 }} />} onClick={onAddExperienceClick}>
              Add new experience
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="mb-4 text-heading text-ink">Create new experience</h3>
          <ExperienceForm initialData={newExperienceText} onChange={(data) => setNewExperienceText(data)} />
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={onCancelAddExperienceClick}>Cancel</Button>
            <Button variant="primary" onClick={handleAddExperience}>
              Save
            </Button>
          </div>
        </div>
      )}
      {showConfirmDeleteModal ? (
        <Modal
          title="Delete this experience?"
          footer={
            <>
              <Button onClick={() => setShowConfirmDeleteModal(false)}>No</Button>
              <Button variant="danger" onClick={() => experienceToDelete && handleDelete(experienceToDelete)}>
                Yes, delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete this experience?
        </Modal>
      ) : null}
    </section>
  );
};

export default PreviousExperiencesSection;
```

- [ ] **Step 8: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" profile-sections`
Expected: `ALL CHECKS PASSED`.

- [ ] **Step 9: Static checks**

Run: `CHECKS=...; bash "$CHECKS/verify.sh"`
Expected: `no new type errors` (the `PreviousExperiencesSection` baseline error is still present and unchanged), `no new lint errors`, `build OK`.

- [ ] **Step 10: Commit**

```bash
git add src/components/profile/BioBlurbSection.tsx src/components/profile/InterestsSkillsSection.tsx src/components/profile/PreviousExperiencesSection.tsx src/components/profile/ExperienceForm.tsx
git commit -m "$(cat <<'EOF'
Restyle the unused profile sections

Keeps them ready for the student dashboard without Jersey headings or purple tokens.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Sign-in and 404

**Files:**
- Modify: `src/pages/SignInPage.tsx` (full rewrite; same Keycloak call)
- Modify: `src/pages/NotFoundPage.tsx` (full rewrite)
- Test: `$CHECKS/signin-404.cjs`

**Interfaces:**
- Consumes: `Surface`, `Button`, `ButtonLink`, `EmptyState`.
- Produces: none.

- [ ] **Step 1: Write the failing check `$CHECKS/signin-404.cjs`**

```js
const { withPage, check, done } = require('./lib.cjs');

(async () => {
  await withPage('/does-not-exist', async (page) => {
    const text = await page.textContent('body');
    check('404 title reads "Page not found"', text.includes('Page not found'));
    check('404 keeps the womp womp line', text.includes('womp womp'));
    check('404 links back to search', (await page.$eval('main a', (el) => new URL(el.href).pathname)) === '/');
    check('404 icon is muted ink, not yellow', (await page.$eval('main svg', (el) => getComputedStyle(el).color)) === 'rgb(107, 107, 115)');
  });

  await withPage('/gallery/index.html?view=signin', async (page) => {
    const text = await page.textContent('body');
    check('sign-in heading', text.includes('Sign in to CMU Research'));
    check('sign-in subtitle', text.includes('Use your Andrew account'));
    check('sign-in button', (await page.getByRole('button', { name: 'Sign in with CMU' }).count()) === 1);
    check('sign-in background uses the hairline texture', (await page.$eval('main', (el) => getComputedStyle(el).backgroundImage)).includes('repeating-linear-gradient'));
    check('mascot image removed', (await page.$('img[alt="Carnegie Mellon Mascot"]')) === null);
  });

  done();
})();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CHECKS=...; bash "$CHECKS/run.sh" signin-404`
Expected: FAIL on `404 title reads "Page not found"`, `sign-in heading`, and the checks after them.

- [ ] **Step 3: Rewrite `src/pages/SignInPage.tsx`**

```tsx
import { signIn } from "../lib/authClient";
import Logo from "../assets/logo.png";
import Surface from "../components/ui/Surface";
import Button from "../components/ui/Button";

const SignInPage = () => {
  const handleSignIn = () => {
    signIn.oauth2({ providerId: "keycloak", callbackURL: `${window.location.origin}/` });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-canvas bg-hairline-texture px-4">
      <Surface className="w-full max-w-[400px] p-[40px] text-center shadow-popover">
        <img src={Logo} alt="CMU Research" className="mx-auto mb-8 h-[40px] w-auto" />
        <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-ink">Sign in to CMU Research</h1>
        <p className="mt-2 text-body text-ink-muted">Use your Andrew account</p>
        <Button variant="primary" className="mt-8 w-full" onClick={handleSignIn}>
          Sign in with CMU
        </Button>
      </Surface>
    </main>
  );
};

export default SignInPage;
```

- [ ] **Step 4: Rewrite `src/pages/NotFoundPage.tsx`**

```tsx
import { FaExclamationTriangle } from "react-icons/fa";
import EmptyState from "../components/ui/EmptyState";
import { ButtonLink } from "../components/ui/Button";

const NotFoundPage = () => (
  <main className="mx-auto flex min-h-[calc(100vh-var(--nav-h))] max-w-xl items-center px-6 py-16">
    <EmptyState
      className="w-full"
      icon={<FaExclamationTriangle size={18} />}
      title="Page not found"
      message="womp womp — this page doesn't exist."
      action={
        <ButtonLink to="/" variant="primary">
          Back to search
        </ButtonLink>
      }
    />
  </main>
);

export default NotFoundPage;
```

- [ ] **Step 5: Run the check to verify it passes**

Run: `CHECKS=...; bash "$CHECKS/run.sh" signin-404 && bash "$CHECKS/run.sh" layout`
Expected: both print `ALL CHECKS PASSED`. The `layout` check's `/main` test depends on the 404 copy "this page doesn't exist".

- [ ] **Step 6: Visual check and static checks**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot after not-found && bash "$CHECKS/run.sh" shoot after sign-in`
Open both PNGs and confirm against spec §3.9–§3.10:
- a centered white sign-in card on a faint diagonal texture, with no photo and no mascot;
- the 404 empty state with a muted warning icon and a black "Back to search" pill.

Then run `bash "$CHECKS/verify.sh"`. Expected: `no new type errors`, `no new lint errors`, `build OK`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/SignInPage.tsx src/pages/NotFoundPage.tsx
git commit -m "$(cat <<'EOF'
Redesign the sign-in and 404 pages

Replaces the photo background and mascot with the minimal card and texture from the new design.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Remove legacy styles and dead code, then run the final verification

**Files:**
- Delete: `src/components/CheckBox.tsx`, `src/components/CardSaved.tsx`, `src/components/SaveButton.tsx`, `src/components/SearchBar.tsx`, `src/components/InputBar.tsx`, `src/components/Spinner.tsx`, `src/components/RelatedOpportunities.tsx`
- Modify: `tailwind.config.js` (full rewrite without legacy tokens or the `Opacity` import)
- Modify: `src/index.css` (drop Jersey 25 from the font import)
- Remove: `gallery/` and its line in `.git/info/exclude` (at the very end, after the final checks)

**Interfaces:**
- Consumes: everything from Tasks 2–9.
- Produces: the final state. No legacy token, Jersey, Roboto, or deleted component remains referenced outside `src/pages/MainPage.tsx` and `*.stories.tsx`.

- [ ] **Step 1: Confirm the files to delete are unreferenced**

Run:
```bash
grep -rnE "from ['\"](\.\./|\./)(components/)?(CheckBox|CardSaved|SaveButton|SearchBar|InputBar|Spinner|RelatedOpportunities)['\"]" src --include=*.tsx --include=*.ts | grep -v "\.stories\.tsx" | grep -v "components/ui/"
```
Expected: no output. (`ui/Spinner` imports are the new component and are excluded by the last `grep -v`.) If anything prints, stop and fix that import before deleting.

- [ ] **Step 2: Delete the dead components**

Run: `git rm src/components/CheckBox.tsx src/components/CardSaved.tsx src/components/SaveButton.tsx src/components/SearchBar.tsx src/components/InputBar.tsx src/components/Spinner.tsx src/components/RelatedOpportunities.tsx`

- [ ] **Step 3: Rewrite `tailwind.config.js` without legacy tokens**

```js
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        display: ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "600" }],
        title: ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "600" }],
        heading: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "card-title": ["17px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "22px" }],
        small: ["13px", { lineHeight: "19px" }],
        meta: ["12px", { lineHeight: "16px" }],
      },
      colors: {
        canvas: token("canvas"),
        surface: { DEFAULT: token("surface"), muted: token("surface-muted") },
        hairline: { DEFAULT: token("hairline"), strong: token("hairline-strong") },
        ink: { DEFAULT: token("ink"), secondary: token("ink-secondary"), muted: token("ink-muted") },
        positive: { DEFAULT: token("positive"), bg: token("positive-bg") },
        warning: { DEFAULT: token("warning"), bg: token("warning-bg") },
        danger: { DEFAULT: token("danger"), bg: token("danger-bg") },
      },
      borderRadius: {
        surface: "14px",
        control: "10px",
        chip: "6px",
      },
      boxShadow: {
        "card-hover": "0 1px 2px rgb(24 24 27 / 0.04), 0 4px 16px rgb(24 24 27 / 0.06)",
        popover: "0 8px 24px rgb(24 24 27 / 0.10), 0 2px 6px rgb(24 24 27 / 0.06)",
        accent: "inset 0 1px 0 rgb(255 255 255 / 0.12), 0 1px 2px rgb(24 24 27 / 0.24), 0 4px 12px rgb(24 24 27 / 0.18)",
      },
      spacing: {
        nav: "var(--nav-h)",
      },
      backgroundImage: {
        accent: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)",
      },
      keyframes: {
        dropIn: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        dropIn: "dropIn 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Drop Jersey 25 from `src/index.css`**

Replace the first line:
`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Jersey+25&display=swap');`
with:
`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');`

- [ ] **Step 5: Grep for leftovers**

Run:
```bash
grep -rnE "(pink-hippo|magenta-hippo|magenta-dark-hippo|magenta-100|light-color|dark-color|card-highlight|tag-dark-color|bookmark-color|grey-blue-color|nav-border-color|learn-more-color|brand-[0-9]{2,3}|transparent-white|hippo-bg|font-jersey|font-roboto|animate-slidingIn|shadow-color)" src --include=*.tsx --include=*.ts | grep -v "src/pages/MainPage.tsx" | grep -v "\.stories\.tsx"
grep -rnE "\b(bg|text|border|ring|from|to|via|fill|stroke|decoration|outline|divide|placeholder)-(gray|purple|violet|blue|red|pink|green|yellow)-[0-9]{2,3}\b" src --include=*.tsx --include=*.ts | grep -v "src/pages/MainPage.tsx" | grep -v "\.stories\.tsx"
```
Expected: both print nothing. Fix any hit by switching it to the matching token class, then rerun.

- [ ] **Step 6: Run the full check suite (the gallery still exists)**

Run (Bash timeout 600000):
```bash
CHECKS=C:/Users/Bryan/AppData/Local/Temp/claude/c--Users-Bryan-Downloads-CMU-Research/5ac71def-0bf8-4853-b02a-78debe604ff1/scratchpad/redesign-checks
for c in tokens ui layout search info profiles profile-sections signin-404; do echo "=== $c ==="; bash "$CHECKS/run.sh" $c | tail -3; done
```
Expected: every block ends with `ALL CHECKS PASSED`.

- [ ] **Step 7: Take "after" screenshots and compare**

Run: `CHECKS=...; bash "$CHECKS/run.sh" shoot after`
Open each `$CHECKS/shots/after/*.png` next to its `before` counterpart. Confirm that nothing lost its styling when the legacy tokens were deleted: no unstyled purple remnants, no black-on-white default buttons, no missing borders.

- [ ] **Step 8: Static checks**

Run: `CHECKS=...; bash "$CHECKS/verify.sh"`
Expected: `no new type errors`, `no new lint errors` (the `Opacity` lint error is now gone), `build OK`.

- [ ] **Step 9: Commit the cleanup**

```bash
git add tailwind.config.js src/index.css
git status --short
```
Expected before committing:
- the seven `D` deletions from Step 2, staged;
- `M tailwind.config.js` and `M src/index.css`, staged;
- ` M src/pages/ProfessorProfile.tsx` (the user's mock lines, unstaged);
- `?? src/data/devMockProfessors.ts`.

```bash
git commit -m "$(cat <<'EOF'
Remove legacy purple tokens, fonts and dead components

Nothing outside the set-aside landing page uses them anymore, so they would only invite drift back to the old styles.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 10: Remove the gallery**

`gallery/` was created in Task 1, and git ignores it.

Run: `rm -rf gallery && sed -i '/^gallery\/$/d' .git/info/exclude && git status --short`
Expected: only ` M src/pages/ProfessorProfile.tsx` and `?? src/data/devMockProfessors.ts`. Then run `git log --oneline -10`; it should show the 9 redesign commits plus the spec commit on `frontend-redesign`. Do not push.
