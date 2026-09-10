# For Ricardo: assets for the Amphora homepage rebuild

Everything you need is in this folder. Download all of it once and copy the files into your Astro project (fonts into `public/fonts/`, images into `src/assets/` or `public/` as the spec describes). Ignore the parent folders "Assets" and "Fonts" next to this one: they hold design originals and older duplicates for Amphora's records.

## 01 Fonts (6 files)
The six font faces the site uses. Define one `@font-face` per file. Nothing else is needed; do not look for a mono font or other weights.

## 02 Amphora Logos (5 files)
- `amphora-full-logo.png` and `amphora-full-logo-216.webp`: the logo for header and footer.
- `amphora-word-logo-transparent (...).svg`: the wordmark SVG currently on the live site. It is 1.7 MB, which is far too heavy for an SVG. Do not use it yet; Amphora is producing a clean vector. Use the PNG/WebP in the meantime.
- `a-gradient-288.webp` and `a-gradient-transparent-2048.png`: the standalone "A" mark, useful as a small brand accent or favicon source.

## 03 Partner Logos (14 files)
The 14 client logos in the live logo strip, one file each, 320 px wide. They are single-colour on a transparent background (ten white, three black, one red). Render all of them in the same dark grey with a CSS filter, for example `filter: brightness(0) invert(0.22);`. Do not use their original colours.

## 04 Case Studies (12 files)
Four projects (Cord's Café, EVLTN Martial Arts, Grechow's Beauty, Nord-Ostsee Logistik). For each: the original PNG plus a 700 px AVIF/WebP pair. Use these as placeholders; the final case study selection may change.

## 05 Team Photos (10 files)
Marcel and Salam, original PNG plus 192 px AVIF/WebP pairs. Plus the "consultation" photo in 1280 px and 640 px AVIF/WebP, which can be used as a hero or team-section image.

## 06 Icons and Misc (4 files)
`icon.png` (256 px) and `apple-icon.png` (180 px) for favicons, `og-image.png` (1200 x 630) for social sharing, `noise-128.webp` as an optional subtle background texture.

Total: 51 files, no duplicates. Assembled 7 September 2026 from the verified asset package; every file here is also present on the live amphora-it.com.
