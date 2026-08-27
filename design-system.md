# Verity Design System

Extracted verbatim from the reference app (`verityexplore-main/src/styles.css`
and `src/components/ui/*`). This is the objective contract. Adherence is
binary, not aesthetic.

## 1. Colour

One accent ramp drives the whole site. No brand colour is hardcoded outside
the token block.

| Token | Light | Dark |
|---|---|---|
| `--accent-500` / `--accent` | `#0FA894` | same |
| `--accent-text` | `--accent-700` `#0A7264` | `--accent-300` `#6ECABD` |
| `--accent-ink` (text on solid accent) | `#FFFFFF` | `#061714` |
| `--base` | `#F7F8FA` | `#0F1115` |
| `--base-alt` | `#F1F3F7` | `#12151A` |
| `--surface` | `#FFFFFF` | `#16191F` |
| `--surface-elevated` | `#FFFFFF` | `#1C2027` |
| `--ink` | `#0F1115` | `#F7F8FA` |
| `--ink-muted` | `#6B7078` | `#9AA1AA` |
| `--ink-body` | `rgba(15,17,21,.66)` | `rgba(247,248,250,.64)` |
| `--line` | `#E6EAEE` | `rgba(247,248,250,.14)` |
| `--line-hair` | `#EDEFF3` | `rgba(247,248,250,.08)` |
| `--grid-line` | `rgba(15,17,21,.05)` | `rgba(247,248,250,.05)` |

Accent alphas exist as tokens only: `--accent-a08 / a14 / a24 / a40`.

Rules:
- Zero hex literals in section CSS. Every colour resolves through a token.
- Accent is for state and data, never for decoration of a whole surface.
- `::selection` is `--accent-a24`.

## 2. Type

- One family: Inter. `font-feature-settings: "cv02","cv03","cv04","ss03"`.
- Body: `15px / 1.55 / 400`.
- All headings `h1`–`h4`: `font-weight: 300`, `letter-spacing: -0.03em`,
  `text-wrap: pretty`, `margin: 0`.
- Heading sizes are fluid clamps, never fixed px:
  h2 range `clamp(30px,3.6vw,52px)` to `clamp(32px,4vw,58px)`, `line-height` 1.04–1.05.
- `.label`: `10.5px / 500 / 0.16em tracking / uppercase / --ink-muted`.
  This is the site's connective tissue and is used freely, not rationed.
- `.tnum` (`font-variant-numeric: tabular-nums`) on every animated or
  comparable number, so digits do not reflow.
- Measure caps: headings `max-width: 15ch–18ch`, body `38ch–42ch`.

## 3. Space and shell

- `--maxw: 1440px`, `--gutter: clamp(20px,4vw,40px)`.
- Section padding is one of exactly three: `normal` `clamp(72px,9vw,112px)`,
  `tall` `clamp(96px,12vw,152px)`, `flush` `0`.
  One documented exception: the closing call to action overrides to
  `clamp(120px,18vw,220px)`, because whitespace is the only thing carrying
  that section.
- Two-column split is asymmetric, never 50/50:
  `minmax(0,0.8fr) minmax(0,1.2fr)` or `minmax(0,0.9fr) minmax(0,1.1fr)`,
  gap `48px` stacked / `80px` at `lg`.

## 4. Section tone

Exactly three tones:
- `base` — `--base`, no border.
- `alt` — `--base-alt` **plus `border-y` of `--line`**. The hairline is what
  separates the band; the colour step alone never does the work.
- `ink` — locked `#0F1115` / `#F7F8FA` in **both** themes, with the full ink
  token set overridden inline. A deliberate contrast beat, not a theme response.

## 5. Surface (Panel)

- `border-radius: 16px` (`rounded-2xl`), `1px solid --line`, `--surface` fill.
- Chrome bar: `44px` tall, `border-bottom --line`, `.label` title in `--ink`
  of the form `VERITY / OVERVIEW`, optional muted meta, optional `Live` marker.
- `Live` marker is a `5px` accent dot running `v-breathe 3.2s ease-in-out infinite`.
- Elevation is one of two: `--elev-mid` `0 14px 34px rgba(15,17,21,.07)` or
  `--elev-high` `0 30px 70px rgba(15,17,21,.1)`.
- Product surfaces are real DOM, never images.

## 6. Rules and lists

- List rows separate with `border-b` of `--line-hair`; the list itself opens
  with `border-t` of `--line`. Rows are `py-3` to `py-5`.
- Row state marker is a `6px` dot: `--accent` when active, `--line` when not,
  transitioned on colour only.
- Metric strips divide with `--line`, `28px / 300 / -0.02em` values on a
  `.label` caption and an `11.5px` muted note.

## 7. Motion

- **One** entrance motion sitewide: `opacity 0→1`, `translateY(10px→0)`,
  `500ms`, `cubic-bezier(0.22,0.61,0.36,1)`, fires once, viewport margin `-80px`.
- Stagger is `60ms × index`, **capped at index 8**.
- Only two decorative keyframes exist: `v-breathe` (opacity .3↔1, 3.2s) and
  `v-sweep` (translateX -10%→1000%).
- Everything else on the page is either interaction feedback or data drawing
  itself. No parallax, no scrub, no third entrance variant.
- `prefers-reduced-motion` collapses all animation and transition to `0.001ms`
  and disables smooth scroll.

## 8. Ornament

- The only background pattern is `.op-grid`: two `--grid-line` 1px gradients
  at `40px 40px`. It appears behind operational canvases, not everywhere.
- `.hairline` (`border-top: 1px solid --line`) is the default divider.
- Decorative placement that should read as scattered is hand-authored as a
  coordinate table, never randomised at runtime.

## 9. Interaction and a11y

- `:focus-visible` is `2px solid --accent`, `offset 3px`, `radius 4px`. Global.
- Every interactive row is a real `<button type="button">` carrying
  `aria-pressed`, and responds to `onPointerEnter`, `onFocus` and `onClick`.
- Non-text visuals carry `role="img"` with a sentence-form `aria-label`;
  purely decorative marks carry `aria-hidden="true"`.
- Sections are labelled with `aria-labelledby` pointing at their own heading.


## 10. The hero is a documented exception

The contract above is transcribed from the reference application, whose hero is
plain Inter. This site's hero is deliberately different and is **out of scope**
for sections 2, 7 and 8. Specifically, and only inside `#top`:

- The `h1` is set in **Instrument Serif** at a fixed `90px / 400`, stepping to
  `64px` and `44px` at the two breakpoints. Everything below the hero stays
  Inter at weight 300.
- The headline uses a **word-by-word entrance** (`.reveal-word`, 700ms, rising
  `0.22em`, 60ms stagger capped at index 8) rather than the single site-wide
  entrance. It is the only element on the page allowed a second variant.
- The hero **scrubs on scroll**: `js/hero-assemble.js` drives `--p` from scroll
  progress, moving nine `[data-shard]` elements and the accent wash. These are
  the only elements permitted a permanent `will-change`, because they change
  every frame while the hero is on screen.
- `.hero-wash` is an accent radial wash across the full hero. It is the one
  place the accent is allowed to fill a surface.

Everything in the hero still resolves through the colour tokens: the second
teal that used to live here (`#00D1B2`) has been folded into `--accent`.
