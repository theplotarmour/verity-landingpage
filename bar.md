# bar.md — mechanisms extracted from steep.app

Reference: https://steep.app/ — captured 2026-08-25 at 1440x900, full page 10,933px.
Every line below is checkable by looking at a render. No adjectives.

---

## 1. Two families, three display sizes, no bold

Exactly two type families on the page: a display serif and a UI sans.
- Serif is used ONLY for h1/h2, ONLY at weight 400, at three sizes: 90px, 64px, 44px.
- Negative tracking scales with size: -2.25px @ 90, -0.96px @ 64, -0.66px @ 44.
- Sans never exceeds 20px in body copy, never exceeds weight 500 anywhere.
- **Fail if:** a serif appears at weight 500+, a fourth display size exists, or any text is 600/700 weight.

## 2. One italic phrase per headline

The display headline mixes roman and italic inside a single sentence, and the italic
half is always the emotional/consequence clause, not the subject.
Exactly one italic phrase per headline. Never two. Never a fully italic headline.
- **Fail if:** headlines are all-roman throughout the page, or an italic run appears twice in one headline.

## 3. Colour is rationed and bands are full-bleed

- Peach `#fbe1d1` appears at most ONCE per viewport, and only as an entire card surface
  carrying sienna `#5d2a1a` text. Never as a border, underline, badge, or icon tint.
- Everything else resolves to `#ffffff`, `#fafafb`, `#f2f2f3`, `#17191c`. No saturated
  blue/green/purple UI chrome outside product-mockup chart strokes.
- Section grounds alternate edge-to-edge (white -> #fafafb -> #17191c dark -> pale tint),
  each change full-bleed with no rounded container and no divider rule.
- **Fail if:** two peach surfaces are visible at once, a hairline `<hr>` separates sections,
  or a section ground stops short of the viewport edge.

## 4. Product artifacts float, they are never boxed

Product UI is presented as loose artifacts on the ground, not as images inside a frame.
- Radius 24px, shadow = 1px hairline ring at ~5% black PLUS a soft 4–40px blur at <=10% black.
- Artifacts overlap or bleed past the 1200px content column — cropped by the viewport edge,
  or overlapping the headline's optical box.
- **Fail if:** every mockup sits neatly inside the content column, has a visible 1px grey
  border, or carries a heavy drop shadow.

## 5. Ground is at least 40% of every viewport

- Section vertical padding >= 128px.
- Hero text sits in the centre third horizontally, measure <= 660px, flanks left empty for
  floating artifacts.
- **Fail if:** any full-height screenshot of the page is more than 60% covered by text,
  cards, or imagery.

## 6. Sections open with an eyebrow and a single serif word

Each major section opens with: a 15px sans eyebrow with a trailing chevron, then a display-size
serif heading of ONE or TWO words ("Engage", "Ship", "Unlock deep analysis").
The heading reveals word-by-word (or letter-by-letter) on scroll — a staggered reveal, not a
single opacity fade of the whole block.
- **Fail if:** section headings are full sentences at display size, or the whole heading block
  fades in as one unit.

## 7. Motion is scroll-driven, one-directional, never under 400ms

- The hero-to-product transition is a scroll-scrubbed scale + fade: the hero copy recedes as the
  app window scales up to take the frame. Not a cut, not a slide-in.
- Every transition resolves in one direction. No bounce, no yo-yo, no infinite loop except a
  single continuous logo marquee.
- No animation shorter than 400ms.
- **Fail if:** anything springs back, any duration is under 400ms, or an element enters from an
  edge it does not belong to.

---

## Sanctioned deviations — settled, do not re-litigate

These resolve conflicts between the written spec and the measured reference. Critics: judge
against these, not against the table in DESIGN.md.

- **Fonts.** Signifier and Sohne are commercial and unavailable. Instrument Serif substitutes for
  the display serif, Inter for the sans. Judge the ROLES (serif display-only at weight 400; sans
  UI/body never above 500) and how well the substitute is set — never the substitution itself.
- **Display leading.** DESIGN.md lists 1.30 for all three serif sizes, which is an extraction
  artifact — measured baseline pitch on the reference is ~1.07 at 90px. Display leading is
  **1.10**. Do not fail a build for missing 1.30.
- **Artifact radius.** Floating hero artifacts are *elevated* cards: **radius 20**
  (`--radius-elevatedcards`). Content and section cards are **radius 24** (`--radius-cards`).
  Mechanism 4's "radius 24" refers to content cards.
- **The hero wash is peach-only.** The single sanctioned gradient may carry peach/rose warmth and
  nothing else. Violet, blue, or green inside the wash is a violation — it counts as a second
  chromatic family and breaks the achromatic-plus-one-accent system.

### Round-2 rulings — settled, do not re-litigate

- **Elevation.** Every *floating hero artifact* carries elevation (hairline ring + soft wide blur),
  including the peach one. DESIGN.md's "content cards take no drop shadow" governs cards sitting
  **inside a section**, not artifacts floating on the hero ground. A flat peach card beside two
  elevated neighbours is an inconsistency, not compliance.
- **Colour inside a depicted product screen.** The one-peach-per-viewport rule governs page
  chrome. Inside a product artifact — a depicted app window — functional data colour is expected:
  peach fills, sienna strokes and rules, alongside ink/mist/fog. The reference's destination panel
  is **41.5% chromatic**; ours measured 0.1%. Correcting the ground/object inversion by deleting
  colour rather than relocating it is a failure, not a fix. Keep the page chrome achromatic and
  put the warmth in the objects — especially the destination.
- **Product-UI type floor is 14px.** No 12px step exists anywhere on the ladder, inside artifacts
  or out.

### Critic scope — piece by piece

Piece A is **shell + hero + the scroll destination**. Mechanism 3's band-alternation half and
mechanism 6 (section openers, serif section headings, staggered word reveals) describe sections
that live in pieces B, C and D. **Do not fail piece A for their absence** — judge A on mechanisms
1, 2, 4, 5, 7 and on M3's colour-rationing half. The full-page mechanisms are judged when the
pieces that own them exist.

### Piece-B ruling — the nav's scrolled state

DESIGN.md's "nav takes no background, no border, no shadow, no separator" describes the nav
**at rest**. It does not describe the scrolled state, and reading it that way is what produced
the collision on piece B: section eyebrows printing straight through the wordmark.

Measured on the reference: the nav band holds a consistent light value across its full height at
every sampled column while page content passes beneath it, with a clear bottom edge around y68.
The reference nav **masks what scrolls under it**.

Ruling: the nav is transparent at rest and gains an opaque paper backdrop once the page scrolls.
Do not flag that backdrop as a violation. What remains forbidden is a hard separator rule at rest
and a heavy shadow in either state.

================================================================================
PIECE E — SCATTER-TO-ASSEMBLE HERO (added round 5)
Reference for the DESTINATION and THEME: verity-overview.html (the product's own
Overview screen). Reference for the MOTION: steep.app's hero scrub, already torn
down as M7 above. These mechanisms govern piece E only.
================================================================================

E1 — THE DESTINATION IS THE PRODUCT SCREEN, NOT A LIKENESS OF ONE.
At scroll-end the assembled frame must be recognisably the Overview screen from
verity-overview.html: left sidebar with the verity mark and its nav, a topbar
with the search field, "Overview" title, the Orders / Stock overview / Reorders /
Logistics card grid in that arrangement, the filter toolbar, and the inventory
table. A critic must be able to hold the two side by side and match them part
for part. Missing a whole region is a fail; simplified interior detail is not.

E2 — EVERY PIECE STARTS SEPARATED AND ARRIVES UNDER SCROLL.
At scroll progress 0 the shards are scattered across the frame — no two touching
their final neighbours, spread across the full viewport rather than huddled in
the centre. Progress drives position continuously: at 0.5 the layout must be
visibly mid-assembly (partly converged, still disjoint), never already resolved
and never still fully scattered. Scrubbing backwards reverses it exactly.

E3 — ASSEMBLY IS STAGGERED, NOT A SINGLE SNAP.
Shards do not all land on the same frame. Their arrivals are distributed across
the scrub so the screen builds up in readable order. No shard may complete its
travel in under 400ms of equivalent scroll time, and nothing bounces, overshoots
past its slot, or reverses direction mid-travel — one direction only (M7).

E4 — THE OVERVIEW PALETTE, EXACTLY.
#0F1115 ink, #F7F8FA canvas, #FFFFFF surface, #F2F3F5 surface-2, #E6E8EB border,
#00D1B2 accent with #04231F on top of it. Teal is the only chromatic colour on
the page and it stays functional — accent bars, status dots, the primary button,
the map nodes. Peach and sienna must be gone from every viewport. Card radius
16, control radius 12, buttons pill.

E5 — SMOOTH SCROLL IS FELT, NOT SEEN.
Lenis drives the page: scroll must settle with inertia rather than stepping, and
the assembly must stay locked to scroll position with no lag, drift or jitter
between the wheel and the shards. Any tearing between the pinned frame and the
page below it is a fail.

E6 — THE COPY HANDS OFF; IT DOES NOT COLLIDE.
The hero headline recedes as the shards converge. At no scroll position may
headline text and dashboard shards overlap illegibly. The hand-off resolves
before the assembly completes.

E7 — IT DEGRADES WITHOUT BREAKING.
With prefers-reduced-motion, or if the animation libraries fail to load, the
destination renders assembled and correct — never a heap of scattered fragments
and never an empty frame.
