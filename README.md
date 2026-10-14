![Taler Logo](assets/taler-logo-2021-plain.svg)

# The ethical privacy-preserving digital payment system

A [reveal.js](https://revealjs.com/) presentation.

This is a **plain static site** — no npm, no build step, no `node_modules`.
Everything the deck needs at runtime is already committed under `vendor/`
(prebuilt reveal.js in `vendor/reveal/`, plus the fonts / icons / GSAP). You
only need a way to serve the folder over HTTP.

### Layout

- `index.html` — page skeleton: `<head>` links + section includes + script list.
- `theme.js` — the edit-me colour config (light/dark palettes + `MODE`).
- `styles/` — our own CSS (`theme.css` reveal vars, `document.css` dark-mode
  fixes for fixed-colour images, `sections.css` shared section styling).
- `vendor/` — third-party code (`reveal/`, `fonts/`, `bootstrap-icons/`, `gsap/`).
- `sections/*.html` — one partial per part of the talk (named after it).
- `logic/` — runtime (`main.js` startup, `section-loader.js`, `svg.js`);
  `logic/sections/diagram.js` animates the "How Taler works" diagram.
- `assets/` — images and SVG diagrams. Diagram colours are
  `var(--diagram-*, <original>)`, so they follow the theme.

## Running it

The deck loads its slide partials and SVGs with `fetch()`, so it must be served
over **HTTP** — opening `index.html` straight from disk (`file://`) will not
work. Any static file server pointed at this directory will do:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser.

## Dark mode

- **Default for everyone** — set `MODE: 'dark'` in `theme.js`.
- **Per visit** — add `?theme=dark` (or `?theme=light`) to the URL, e.g.
  <http://localhost:8000/?theme=dark>.

Photo, black and gradient-stripe slides keep their colours in both themes.

## Editing

- **Colours / look** — `theme.js`
- **Slide text / structure** — `sections/*.html` (order of parts in `index.html`)
- **Diagram animation** — `logic/sections/diagram.js`

Just save and reload the browser; there is nothing to compile.
