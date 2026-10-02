# Frontend Redesign — Design Spec

- **Date:** 2026-09-30
- **Branch:** `frontend-redesign`
- **Status:** Awaiting review

## Goal

Restyle the whole frontend so it is clean and minimal but has a strong visual identity, and fix the UX problems found along the way. The two reference designs (a workspace app, "Ace Studio", and a mail sidebar) share one visual vocabulary:

- a near-white neutral canvas with hairline borders and generous radii;
- **one** loud element (a saturated, glowing selected-state pill) while everything else stays quiet;
- sans type for content, with monospace for metadata and counts;
- quiet data display: key–value tables with row dividers, and gray chips.

The app keeps its current structure: top nav, filter sidebar on search, same routes and data flow.

## Decisions

| Topic | Decision |
|---|---|
| Layout | Keep the top nav and restyle it; no sidebar shell |
| Accent | Near-black (#18181B) gradient pill; otherwise monochrome, plus muted status colors |
| Type | Geist + Geist Mono (Google Fonts) |
| Approach | Semantic tokens → shared `ui/` components → restyle pages → delete legacy tokens |
| Icons | Keep every existing icon from its current library (MUI Material, react-icons). Restyle size and color only. New icons come from MUI Outlined |
| Home | `/` (search) is home. The logo links to `/`. The `/main` landing page is set aside (see §3.8) |
| Storybook | Not used (outdated). Existing `.stories.tsx` files are left untouched |
| Dependencies | No packages added or removed |

## 1. Visual language

### 1.1 Color tokens

Defined as RGB channels in `src/index.css` `:root` (e.g. `--canvas: 247 246 244;`) and exposed in `tailwind.config.js` as `rgb(var(--x) / <alpha-value>)`, so opacity modifiers work.

| Token | Value | Use |
|---|---|---|
| `canvas` | #F7F6F4 | Page background |
| `surface` | #FFFFFF | Nav, cards, panels, inputs |
| `surface-muted` | #F1F0ED | Hover rows, chips, segmented-control track |
| `hairline` | #E7E5E1 | All 1px borders and dividers |
| `hairline-strong` | #D6D3CE | Input borders, hovered card borders, scrollbar thumb |
| `ink` | #18181B | Headings, primary text, checked checkboxes, focus ring |
| `ink-secondary` | #52525B | Body text, descriptions |
| `ink-muted` | #71717A | Metadata, labels, placeholders, icons (≥4.5:1 on white) |
| `positive` / `positive-bg` | #15803D / #ECFDF3 | "Paid" badge |
| `warning` / `warning-bg` | #B45309 / #FFF7ED | Deadline-soon badge |
| `danger` / `danger-bg` | #B91C1C / #FEF2F2 | Errors, destructive confirm button |

**Accent (the one loud element).** `bg-accent` is `linear-gradient(180deg, #3F3F46 0%, #18181B 100%)` and `shadow-accent` is `inset 0 1px 0 rgb(255 255 255 / .12), 0 1px 2px rgb(24 24 27 / .24), 0 4px 12px rgb(24 24 27 / .18)`, with white text. Used only on the active nav tab and on primary buttons.

### 1.2 Typography

- `font-sans`: Geist, weights 400/500/600/700. `font-mono`: Geist Mono, weights 400/500. Both load via the Google Fonts `@import` in `index.css`, which also drops Inter and Jersey 25.
- The root font size stays at 14px, so existing rem spacing does not shift.

| Role | Style |
|---|---|
| Page title | 28px / 600, tracking −0.02em, `ink` |
| Detail-page title | 36px / 600, tracking −0.02em |
| Section heading | 18px / 600 |
| Card title | 17px / 600 |
| Body | 14px / 400, line-height 1.6, `ink-secondary` |
| Meta (mono) | 12–13px Geist Mono, `ink-muted`: dates, semesters, Andrew IDs/emails, counts, section labels, key hints |

### 1.3 Shape, depth, motion, decoration

- **Radii:** `rounded-surface` 14px (cards, panels, modals); `rounded-control` 10px (inputs, buttons, nav pill); `rounded-chip` 6px (tags, chips, badges).
- **Shadows:** surfaces are flat, with a hairline border.
  - `shadow-card-hover`: `0 1px 2px rgb(24 24 27 / .04), 0 4px 16px rgb(24 24 27 / .06)`.
  - `shadow-popover`: `0 8px 24px rgb(24 24 27 / .10), 0 2px 6px rgb(24 24 27 / .06)`.
  - The only strong shadow is `shadow-accent`.
- **Motion:** keep 150–200ms ease-out transitions, the existing `dropIn` keyframe, and `active:scale-[0.98]` on pressables.
- **Focus:** `focus-visible:ring-2 ring-ink ring-offset-2`, applied on keyboard focus only.
- **Nav height:** CSS variable `--nav-h: 56px`, exposed as Tailwind spacing `nav` (`h-nav`, `top-nav`, `pt-nav`). It replaces every `10vh` nav offset and the `pt-32` page paddings.
- **Decoration:** `.bg-hairline-texture` is `repeating-linear-gradient(135deg, rgb(24 24 27 / .035) 0 1px, transparent 1px 12px)`. Used only on empty states and the sign-in background.

### 1.4 Icons

- Existing glyphs stay, from their current libraries: MUI Material icons, and react-icons (`BsEyeglasses`, `FaHouse`, `FaBook`, `FaPencil`, `FaSearch`, `FaExclamationTriangle`, `CiCalendar`, `TbCoin`).
- Any new icon uses MUI's `*Outlined` variant. Examples: `AddOutlined`, `OpenInNewOutlined`, `KeyboardArrowLeft` for the panel toggle.
- **Sizing:** 16px inline with text, 18px in the nav, 20px in icon buttons. Always use explicit pixel sizing (`sx={{ fontSize: 16 }}` for MUI, `size={16}` for react-icons), not MUI's `fontSize="small"`.
- **Color:** `ink-muted` by default; `ink`, or white inside the accent pill, when active.
- The one color change to an existing icon: the 404 warning triangle goes from yellow to `ink-muted`.

## 2. Shared components — `src/components/ui/`

Every component accepts `className`, which is merged with the `cx()` helper in `src/components/ui/cx.ts` (a join of truthy strings, no dependency).

| Component | API / behavior | Replaces or used by |
|---|---|---|
| `Button` | `variant`: `primary` (accent pill) · `secondary` (surface + hairline-strong) · `ghost` (text, `surface-muted` hover) · `danger` (solid `danger`). `size`: `sm` 32px / `md` 40px. Optional `icon` (leading) and `iconRight`. Renders `<button>`, or a router `Link` when `to` is set | All CTAs |
| `IconButton` | Square ghost button, 32/36px. Requires `aria-label`. `pressed` state for toggles | Bookmark, edit pencils, close, carousel arrows |
| `Input` | Surface background, `hairline-strong` border, `rounded-control`, 40px tall. Optional `icon` (leading) and `trailing` slot. Focus shows an `ink` border plus ring | `InputBar`, `SearchBar`, form fields, inline major edit |
| `Surface` | `bg-surface border border-hairline rounded-surface`. The `interactive` prop adds `hover:border-hairline-strong hover:shadow-card-hover` | All cards and panels |
| `Tag` | `surface-muted` background, `ink-secondary` text, `rounded-chip`, 12–13px. Keeps the existing `keyword` prop and college abbreviations. Optional `onRemove` renders a × button. Rendered as a `<span>`, not a `<button>` (the current nested-button-in-link is invalid HTML) | Existing `Tag`, active-filter chips, interests/skills |
| `Badge` | `tone`: `neutral` · `positive` · `warning` · `danger`, drawn as a tinted background with a colored label | Paid (positive) / Unpaid (neutral), deadline soon |
| `Meta` / `MetaRow` | `Meta`: mono `ink-muted` text with an optional icon. `MetaRow`: separates its children with `·` | Posted date, semester, eyebrows, Andrew IDs. Replaces the `\|` separators |
| `SectionLabel` | Mono 12px `ink-muted` label. Optional `collapsed` / `onToggle` (renders a chevron) and a right-side `action` slot | Filter group headers, profile/detail section titles |
| `DetailsTable` | `rows: { icon?, label, value }[]` inside a `Surface`: a label column in `ink-muted` with its icon, a value column in `ink`, and hairline dividers between rows | Professor profile, professor dashboard, student profile header, detail-page sidebar "Details" |
| `Avatar` | `src?`, `name`, `size`: sm 28 / md 40 / lg 96. Shows the image, else initials on `surface-muted` | Nav menu button, profile headers, contact cards |
| `EmptyState` | Hairline-texture panel with `icon`, `title`, `message?`, `action?` | No results, loading/error fallbacks, 404 |
| `Spinner` | CSS border spinner (ink at 20% with an ink top segment), 20/32px, `role="status"` with an sr-only label | Current `Spinner`, which renders an empty SVG and shows nothing |
| `Kbd` | Mono 11px key chip: `surface-muted` background, hairline border, `rounded` 4px | The search field's `/` hint |

**`/` search shortcut.** A `useSlashToFocus(ref)` hook: on a document `keydown` of `/` with no modifier keys, and only when focus is not already in an input, textarea, select, or contenteditable element, it calls `preventDefault()` and focuses the ref. The search `Input` shows `<Kbd>/</Kbd>` as its trailing element while it is unfocused and empty.

## 3. Pages

### 3.1 Shared layout — `MainLayout`, `NavBar`, `NavButton`, `Footer`

- `body` uses `bg-canvas text-ink font-sans`.
- **NavBar:** `h-nav` height, `bg-surface`, bottom hairline, fixed position. The hide-on-scroll behavior is unchanged, and the spacer div becomes `h-nav`.
  - **Left:** the logo, linking to `/` (was `/main`).
  - **Center:** `NavButton`s: Search, plus Dashboard for professors. The active tab uses `bg-accent shadow-accent text-white rounded-control`; inactive tabs use `text-ink-secondary hover:bg-surface-muted`. `NavButton` keeps its props, except the `Icon` type widens from MUI's `SvgIconProps` to `React.ElementType`.
  - **Right:** an `Avatar` sm with a chevron, opening a popover (`Surface`, `shadow-popover`, `animate-dropIn`) with the name, the email in mono, "Manage account", and "Sign out".
- **Footer:** one line of 13px `ink-muted` text above a hairline, with "ScottyLabs" as an `ink` underlined link.

### 3.2 Search — `FilterPage`, `FilterSection`, `Card`

**Filter panel**
- `bg-canvas`, a hairline on its right edge, 280px wide, top offset `var(--nav-h)`.
- Header: "Filters" at 18px/600, plus a ghost "Hide" button with a `KeyboardArrowLeft` icon.
- **Groups:** each group header is a `SectionLabel` that toggles the group open or closed.
  - **College:** the fake "None" button, which always reads "None", is removed. A "Reset" action appears in the header when any college is selected.
  - **Department:** the header shows "N selected" in mono when active, plus Reset.
  - **Education** and **Semester:** checkbox rows as today.
  - **Compensation:** a three-way segmented control (Any / Paid / Unpaid) replaces the native `<select>`. It maps to the existing `selectedCompensation` values (`""`, `"Paid"`, `"Unpaid"`).
- **Checkbox rows:** 32px rows with a `surface-muted` hover. A 16px `hairline-strong` box becomes an `ink` fill with a white check (MUI `Check`, 12px) when checked. The native input stays underneath, visually hidden, so keyboard and label behavior are unchanged.
- The empty "Legend" heading is removed.
- The bottom Reset becomes a secondary `Button` "Reset all filters", disabled when no filter is active.

**Results column**
- `bg-canvas`.
- Title row: "Search" as the page title, with `Meta` "{n} results" beside it.
- Search `Input` with the `FaSearch` icon and the `/` shortcut.
- Active-filter chips are `Tag`s with `onRemove`. A ghost "Clear all" appears when two or more filters are active.
- The Year/Time sort becomes a segmented control: a `surface-muted` track, with the active segment in `surface` and a hairline shadow. Labels are unchanged.
- The collapse-on-scroll header behavior is unchanged.

**Result card (`Card`)** — an interactive `Surface` with 20px padding:
1. Title (card title style, `ink`) on the left. On the right: `Meta` "Posted {timeAdded}" and the bookmark `IconButton` (`BookmarkBorderOutlined` / `Bookmark`, `ink` when saved).
2. `ink-secondary` 13px line with the existing icons: `BsEyeglasses` professor · `FaHouse` college · `FaBook` position, separated by `·`.
3. `Meta` with `CiCalendar` for the semester, plus a Paid/Unpaid `Badge` (the `TbCoin` icon goes inside the badge).
4. The description, clamped to 3 lines.
5. Up to 3 `Tag`s. If `showApplyButton` is set, a secondary sm `Button` "Apply →" sits on the right.

**States**
- **Loading:** a centered `Spinner`.
- **No results:** an `EmptyState` with the MUI `SearchOffOutlined` icon, titled "No opportunities match". When filters are active, it adds the message "Try removing a filter" and a "Clear filters" action.

### 3.3 Opportunity detail — `InfoPage`, `infopage/*`

- Page container: `max-w-6xl`, 32px side padding, `pt-8`.
- A ghost `Button` "Back" with the `ArrowBack` icon (behavior unchanged: `navigate(-1)`).
- **`InfoPageHeader`**
  - A `MetaRow` eyebrow: position · compensation · "{n} hrs/week".
  - The title in the detail-page title style (Jersey removed).
  - Subtitle: **the professor name(s) link to `/professor/{andrewId}`**, followed by department and college in `ink-secondary`. The props change from `professorOrLabName: string` to `contacts: [name: string, andrewId: string][]`.
  - `Tag`s.
  - A primary `Button` "Apply now" with `ArrowForward`, and a secondary `Button` Save/Saved with the bookmark icon.
- **Body:** a 2/3 + 1/3 grid.
  - "About this opportunity" is a `SectionLabel` above the description (`max-w-prose`, `ink-secondary`, 15px/1.7).
- **`InfoSidebar`:** `Surface` cards.
  - **Details:** a `DetailsTable` with rows for Position, Compensation, Time commitment, Skill level, and Anticipated end. Prerequisites stay as a list below the table.
  - **Contact:** each name in `ink` 500, with the email as a mono link.
  - **Relevant links:** mono, truncated, each with `OpenInNewOutlined`.
- **`ContactsSection` / `ContactCard`:** `Surface` + `Avatar` md, name, department, and the email in mono.
- **`RelatedOpportunitiesSection` / `OpportunityCard`:** styled like `Card`. The static placeholder data is unchanged.
- **`DeadlineCard`:** `Surface` + a warning `Badge` when a deadline is present.
- **`ResumeUploadPopup`:** a modal `Surface` over an `ink/40` backdrop with `backdrop-blur-sm`, plus the new Buttons.
- **Loading / error states:** `Spinner` / an `EmptyState` with the MUI `ErrorOutlineOutlined` icon, the error text as its title, and a "Go back" action.

### 3.4 Shared profile header pattern

A new component, `src/components/profile/ProfileSummary.tsx`, used by the professor profile, the professor dashboard, and the student profile. It replaces three copies of "192px image + 5xl name + text-xl grid".

- **Props:** `{ avatarSrc?, name, subtitle?, rows, avatarAction? }`. `rows` has the `DetailsTable` row shape; `avatarAction` is an optional element overlaid on the avatar.
- **Row:** `Avatar` lg on the left. On the right, the name as a 28px page title with the `subtitle` (a mono `ink-muted` email or Andrew ID) below it.
- **Below:** a `DetailsTable` of `rows`.
- Container: `max-w-4xl mx-auto`, `pt-10`.
- `ProfileHeader` keeps its current props and renders `ProfileSummary` internally.

### 3.5 Professor profile — `/professor/:andrewId`

- The §3.4 header, titled "Professor {name}", with `DetailsTable` rows for College, Department, and Email (mono).
- The one-tab "Research Listing" tab bar is removed (it does nothing).
- **Bio:** a `SectionLabel` "Bio" and a `Surface` with `ink-secondary` text.
- **Research listings:** a `SectionLabel` with a mono count, then `Card`s with `showApplyButton`.
- "View All" becomes a centered secondary `Button`. It stays non-functional, as today.
- The uncommitted dev-mock fallback in this file is preserved as-is.

### 3.6 Student profile — `/dashboard`, `/profile` (`ProfileHeader`)

- The §3.4 header, with `DetailsTable` rows for Major, Class, and Email.
- The Major row keeps inline editing: the pencil becomes an `IconButton`, the edit field becomes an `Input` sm, and Enter/Escape/blur behave as today.
- The photo-edit control becomes an `IconButton` sm with a hairline border, positioned over the bottom-right of the avatar.
- `BioBlurbSection`, `InterestsSkillsSection`, `PreviousExperiencesSection`, and `ExperienceForm` get the same token and component restyle (Jersey headings become section headings). They are not wired into the page.

### 3.7 Professor dashboard — `/professor-dashboard`

- The §3.4 header, with rows for College, Department, and Email. Values stay "Not set" as today.
- A primary `Button` "Add research opportunity" with the `AddOutlined` icon.
- **`OpportunityForm`:** all fields restyled with `Input` styling (textareas and selects share the same classes). Labels are 13px/500 `ink`, and helper and required markers are `ink-muted`. Field logic is unchanged.
- **Form actions:** a right-aligned pair, primary "Add opportunity" (disabled until valid, as today) and secondary "Discard". The submit error shows as `danger` text.
- **Discard confirmation:** the same modal style as the resume popup, with secondary "Keep editing" and `danger` "Discard".

### 3.8 `/main` landing page — set aside

- The `/main` route is removed from `App.tsx`, and the logo no longer links to it.
- `src/pages/MainPage.tsx` stays in the tree **unmodified and unrouted**. It is also intact on `main`.
- Its legacy purple classes stop rendering once the old tokens are deleted (§5), so it needs a restyle if it is ever revived.
- `/main` now falls through to the 404 page.

### 3.9 Sign-in — `SignInPage`

- A full-viewport `bg-canvas bg-hairline-texture` background, with a centered `Surface` about 400px wide and 40px padding containing:
  - the logo, 40px tall;
  - "Sign in to CMU Research" at 22px/600, with "Use your Andrew account" in `ink-muted` below;
  - a full-width primary `Button` "Sign in with CMU". It calls the same `signIn.oauth2` Keycloak flow.
- The photo background and the Tartan mascot image are no longer used on this page. The asset files stay in the repo.

### 3.10 404 — `NotFoundPage`

An `EmptyState`, with top offset `pt-nav`:
- the `FaExclamationTriangle` icon in `ink-muted`;
- the title "Page not found";
- the message "womp womp — this page doesn't exist.";
- a primary `Button` "Back to search", linking to `/`.

## 4. Scope

**In scope:** everything in §1–§3. The only behavior additions are:
- the `/` search shortcut;
- professor names on the detail page linking to their profiles;
- the result count on the search page;
- "Clear all" for filter chips.

**Out of scope:**
- backend, API, auth, and data-flow changes;
- dark mode and mobile layouts;
- making "View All" or the "Year" sort functional;
- replacing the static related-opportunities data;
- wiring the Storybook-only profile sections into pages;
- updating or running Storybook;
- `App.tsx`'s temporary auth bypass, which is left as-is.

## 5. Cleanup (final stage)

- **Delete unused components:** `CheckBox.tsx`, `CardSaved.tsx`, `SaveButton.tsx`, `SearchBar.tsx`, `InputBar.tsx`. (The unused `SaveButton` import in `Card.tsx` goes with it.)
- **Delete unused imports:** `Opacity` in `tailwind.config.js`, `Engineering` in `Tag.tsx`.
- **`tailwind.config.js`:**
  - remove every legacy color token (`pink-hippo`, `magenta-*`, `violet-*`, `light-color`, `dark-color`, `card-highlight`, `tag-dark-color`, `bookmark-color`, `grey-blue-color`, `nav-border-color`, `learn-more-color`, `brand-*`, `transparent-white*`);
  - remove the `hippo-bg` image, the `slideIn` keyframe and its animation, and the `roboto` and `jersey` font families.
- Before deleting, a grep for each removed token confirms zero remaining uses outside `MainPage.tsx` and `*.stories.tsx`.

## 6. Verification

1. **Baseline, before any code change:** record the `npm run lint` output, confirm `npm run build` passes, and take Playwright screenshots of every route.
2. **After each stage:** `npm run build` passes, and `npm run lint` reports no errors beyond the baseline.
3. **Behavior checks:** Playwright scripts run against the dev server (`VITE_DEV_BYPASS_AUTH=true`, mock data). The scripts live in the session scratchpad and are not committed. They check:
   - `/` focuses the search input, but not while typing in another field;
   - filter groups collapse and expand, and a college Reset clears the college checks;
   - checking a filter adds a chip, and removing the chip unchecks the filter;
   - the Compensation control (Any/Paid/Unpaid) filters the result list;
   - the avatar menu opens, and closes on an outside click;
   - the bookmark toggle flips its icon;
   - the resume modal opens and closes;
   - keyboard Tab shows a visible focus ring on nav tabs, buttons, and inputs;
   - the detail page's professor-name link navigates to `/professor/{andrewId}`.
4. **Visual pass:** after screenshots of `/`, `/info/mock-1`, `/professor/ajones`, `/dashboard`, `/professor-dashboard`, `/does-not-exist`, and the sign-in page, compared against the baseline and shared for review.
   - The sign-in page can only be captured by temporarily commenting out the auth bypass in `App.tsx` locally. That edit is reverted immediately and never committed.

## 7. Commit plan and git constraints

One commit per stage on `frontend-redesign`, never pushed without an explicit request:

1. This spec.
2. Tokens and fonts (`index.css`, `tailwind.config.js`). Legacy tokens are kept until stage 9.
3. `ui/` components and the `useSlashToFocus` hook.
4. Shared layout: NavBar, MainLayout, Footer, NavButton, and the logo/`/main` route change.
5. Search page.
6. Opportunity detail page.
7. Profile header pattern, professor profile, student profile, professor dashboard.
8. Sign-in and 404.
9. Cleanup (§5).

**Uncommitted dev mocks.** `src/data/devMockProfessors.ts` is never staged. For `src/pages/ProfessorProfile.tsx`, only the redesign hunks are staged, so the local mock-fallback hunks remain uncommitted working-tree changes.

## Amendments (made while planning)

These override the sections above.

1. **`ink-muted` is #6B6B73**, not #71717A. #71717A measures 4.48:1 on `canvas`, just under the 4.5:1 AA minimum. #6B6B73 gives ≥4.8:1 on both `canvas` and `surface`.
2. **Two more shared components:**
   - `SegmentedControl`, used by the sort toggle and the compensation filter;
   - `Modal`, used by the resume upload, discard confirmation, delete confirmation, and add-interest dialogs.
3. **Links are a separate component.** `Button` renders only `<button>`, and links use a separate `ButtonLink` with the same styling.
4. **`Tag` stays at `src/components/Tag.tsx`,** because the set-aside `MainPage.tsx` imports it from there.
5. **Two more deletions in cleanup:** the old `src/components/Spinner.tsx` and the unused `src/components/RelatedOpportunities.tsx`.
6. **Bug fix: "Paid" no longer matches "Unpaid".** The Paid filter used a substring match, so it also caught "Unpaid". Paid now excludes values containing "unpaid".
7. **Result cards use a stretched link.** The title is the link, and it covers the whole card, so the bookmark and Apply buttons are no longer nested inside a link (invalid HTML). Clicking anywhere else on the card still opens it.
8. **`/` shortcut details:**
   - Shift is allowed, because some keyboard layouts need it to type "/".
   - A focused checkbox, radio, or button doesn't block the shortcut; only text-entry fields do.
9. **`DetailsTable` rows carry icons.** They reuse the app's existing glyphs where one exists (house for college, book for position, coin for compensation, calendar for dates) and use MUI Outlined icons otherwise.
10. **The 404 page gets no extra `pt-nav`,** because the layout's nav spacer already offsets every page.
11. **Professor links strip an email domain** when the contact value is an email (`abc@andrew.cmu.edu` → `/professor/abc`).
12. **Verification changes:**
    - ESLint here only lints `.js`/`.jsx`, so the type check (`tsc --noEmit` on `src/`, excluding stories, compared against a 3-error baseline) is the main static check.
    - A throwaway `gallery/` page, git-excluded and deleted at the end, renders the shared components, the Storybook-only profile sections, and the sign-in page for checks. That replaces temporarily editing the auth bypass in `App.tsx`.

## Amendments after implementation (2026-10-01)

These record direction changes made after the plan was executed (commit 4be5908, at the user's direction) and the review fixes that followed.

13. **Accent is steel blue, not near-black.** Tokens: `accent` #62849E, `accent-strong` #486B84, `accent-muted` #A4BACC, `accent-bg` #ECF3F9. For contrast, filled primary buttons and accent-coloured text use `accent-strong` (≥5.2:1 against white and the canvas), and focus rings use full-strength `accent` (≥3.6:1). The active nav tab is an `accent-bg` pill with `accent-strong` text.
14. **The student profile is editable.** Bio, interests and experiences save through `POST /users/:id`. Failed saves roll back and show an inline message, and so does a failed load. Completion counts only fields that are saved (major, bio, interests, experiences).
15. **Professor bio and photo are read-only** on the professor's own profile and dashboard, because no professor save endpoint exists.
16. **`Modal` is a native `<dialog>` opened with `showModal()`.** It takes an `onClose` prop for Escape, makes the rest of the page inert, and returns focus to whatever opened it.
17. **Dev mock data is gated on `import.meta.env.DEV && VITE_DEV_BYPASS_AUTH === "true"` and stripped from production builds.** `VITE_DEV_MOCK_ROLE=professor|student` picks the mock session.
18. **Search uses a capped, centred column.** The header and results share an 80rem column, so wide screens keep side margins. The gutter is 2rem, rising to 3rem from the `xl` breakpoint. The filter sidebar is 296px with 1.5rem padding, and the nav matches that padding so the logo lines up with the Filters heading.
19. **"Show filters" opens the search row.** With the sidebar hidden, the toggle sits before the search input at the input's height, uses a filter icon and counts active filters. The page heading keeps the column's left edge. Hiding or showing the sidebar moves focus to the other toggle.
20. **The professor pages do what the backend supports.**
    - **The dashboard is the professor's workspace.** It shows their listings and lets them add and delete them. Delete asks for confirmation, and a failed delete keeps the listing and says so. The dashboard no longer repeats the public profile's bio and research areas.
    - **Page actions sit in a row under the profile header's summary,** on the same left edge as the avatar and name, at every width. The gap above them matches the avatar-to-name gap, and the primary action comes first. Section label rows hold only a label and a count, never buttons. The dashboard's header has "Add opportunity", then "View public profile". Your own public profile has "Manage listings" in the same spot. The add form is titled "New opportunity" and submits with "Post opportunity".
    - **No listing editing.** `PATCH /opportunities/:id` only writes `name`, `position` and `level`, which no listing field uses, so the app offers no edit.
    - **The public profile shows the professor's real listings.** The placeholder (lorem ipsum) listings are gone. On your own profile, the breadcrumb reads "Public profile".
    - **The avatar menu:** professors see "View public profile". Students keep "Manage account".
    - **Listings come from `GET /opportunities`, filtered by contact value.** `GET /opportunities/professor/:andrewId` matches contact keys, but contacts are stored as `{ name: andrewId-or-email }`. Professor records come from `GET /professors/:id`. Both are fetched in parallel.
    - **Two read fixes.** Contacts saved as a full email are no longer given a second `@andrew.cmu.edu`. Listings saved under `Colleges` (the documented schema, and what the form posts) show their college in search.
21. **The nav no longer hides on scroll.** It stays fixed at the top on every page, overriding section 3.1's "hide-on-scroll behavior is unchanged". The scroll listener and `NavBarContext` are gone. On search, the filter sidebar and results panel sit between the nav and the bottom of the window (`top-nav bottom-0`) and no longer shift with it. `html` gets `scroll-padding-top` equal to the nav's height plus 1rem, so keyboard focus and anchors scrolled into view stop below the nav. The search header's own collapse when the results scroll is unchanged.
