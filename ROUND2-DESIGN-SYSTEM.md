# Round Two design system

## Typography and spacing

The shared tokens live in `site/src/styles/global.css`. The `--home-*` names retain the existing component interface. Shared values are declared on `:root`; the homepage composition keeps its scene dimensions local.

| Tokens | Use |
| --- | --- |
| `--home-font-display`, `--home-font-zh` | Georgia-led display typography for titles, with a Songti-style stack available for Chinese display copy. Use regular weight and a compact line height. |
| `--home-font-ui`, `--home-font-mono` | System sans-serif for reading and controls; monospace for record numbers and metadata. Use `--archive-label-size` for inner-page labels. |
| `--home-track-nav`, `--home-track-label` | Tracking for short uppercase labels. Keep paragraphs at normal tracking. |
| `--home-space-1` through `--home-space-4` | 8, 16, 24 and 40px for gaps, insets and groups. |
| `--archive-gutter`, `--archive-width` | Fluid 18–82px inner-page gutter and 1560px Deskspace content cap. The shared header and page sections align to the same gutter. The homepage has a separate copy inset. |
| `--home-section-space`, `--archive-section-title` | Fluid 64–144px section spacing and 32–76px secondary display heading. |

Use zero-minimum grid tracks for flexible columns. The wiki retains its 12-column image grid, which collapses to two or one cards per row. Article metadata moves above prose on narrow screens. The About and Guestbook sections stack, and navigation sits in document flow on the narrowest screens.

## Paper and instruments

- `--home-paper` (#f2f0e9), `--home-paper-ink` (#202c38) and `--home-paper-line` define the warm reading surface, ink and fine dividers. Use them in record headers, reading areas, form panels and profile sections. Field Notes supplies its own paper treatments.
- `--home-navy`, `--home-text`, `--home-muted` and `--home-line` define the dark instrument palette. Use `--archive-instrument` for the masthead, Deskspace controls and the Guestbook submit button. The shared glass radius and inset highlight can carry across instrument surfaces.
- The homepage keeps the existing artwork. A directional grade opens the upper-right highlights and shades the rail edge and receiver base. Wrapper shadows, the CTA facet and independent stacking layers place each control in front of the artwork. The page adds no pointer motion.
- The signal rail, receiver and Field Notes own their interior styles. Layout wrappers define placement, and the shared tokens provide inherited values.

## Focus and interaction

Use a 2px outline with `--archive-focus` on paper and `--archive-focus-light` on dark surfaces. The Deskspace search outline frames the containing control. Route links bring the outline inside the row and reveal it immediately on keyboard focus. Navigation uses an underline and `aria-current` for the current location. Header navigation and primary archive controls use at least 44px of height. Existing component-level focus and reduced-motion behavior remain in place.
