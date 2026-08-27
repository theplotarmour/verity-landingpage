# The Bar — verityexplore-main

The reference is the React app in `verityexplore-main/`, running at
`localhost:5173`. Every line below is a mechanism a critic can check by
looking at rendered output. No adjectives.

## Mechanisms

1. **The uppercase label is the connective tissue.** A `10.5px / 500 / 0.16em`
   uppercase muted label opens most sections and titles every product surface
   (`VERITY / OVERVIEW`). It is what makes 20 different sections read as one
   document. It is used freely, not rationed to two instances.

2. **A band is separated by a hairline, not by a colour step.** Every `alt`
   section carries `border-y` of `--line`. A background change on its own is
   never allowed to do the work of a boundary, so no section ever reads as a
   floating rectangle.

3. **One entrance motion, one direction, everywhere.** `opacity 0→1` plus
   `translateY(10px→0)`, `500ms`, `cubic-bezier(0.22,0.61,0.36,1)`, once,
   triggering `80px` before entry. Stagger is `60ms × index`, capped at 8, so
   a long list finishes in under half a second. There is no second entrance
   variant anywhere on the page.

4. **Data draws itself; the page does not perform.** Beyond the entrance,
   motion exists only as interaction feedback or as a value rendering itself
   (a bar growing, a `Live` dot breathing at 3.2s). No parallax, no scroll
   scrub, no element animating for decoration.

5. **Every product visual is real DOM in one chrome.** A `16px`-radius panel,
   `1px --line` border, `44px` chrome bar with a label title, two elevation
   levels only. The marketing page and the application share one material,
   so no section invents its own card.

6. **Asymmetric two-column, generous measure caps.** Splits are
   `0.8fr / 1.2fr` or `0.9fr / 1.1fr` with an `80px` gap, never 50/50.
   Headings cap at `15ch–18ch`, body at `38ch–42ch`.

7. **Type does the hierarchy; weight never does.** Every heading is weight
   `300` at `-0.03em`, sized by fluid clamp. Body is `15px`. There is no bold
   text on the page. Emphasis is size and colour, never weight.

8. **One accent, spent on state.** `#0FA894` appears on active dots, live
   markers, focus rings and data marks. It never fills a decorative surface,
   and no hex literal exists outside the token block.

9. **Every row is a real control.** Interactive list rows are
   `<button type="button">` with `aria-pressed`, reacting to pointer, focus
   and click alike. Nothing is a `div` pretending to be interactive, and
   nothing is a control that does nothing.

## Pass conditions

- A stranger scrolling ours and the reference cannot tell which is the
  established product.
- No section boundary reads as a pasted rectangle.
- Every list of three or more items reveals with a visible stagger.
- Zero hex literals outside the token block.
- Zero dead `<a>` or `<button>`.
- Zero animations running that are not entrance, interaction, or data.
