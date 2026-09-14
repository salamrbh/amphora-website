# Amphora homepage — Phases 1 and 2

A new, independent homepage built with Astro, TypeScript, Tailwind CSS 4, and the Vercel adapter. It uses plain Astro components and a small mobile-navigation script. All fonts and images are served locally.

The original handoff in `For Ricardo-COPY_FOLDER/For Ricardo/`, including `00 README.md` and the technical specification, is unchanged. The heavy reference wordmark SVG is not used.

## Development

Use Node **24.21.0**, pinned in `.nvmrc`, and npm.

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies from the committed lockfile |
| `npm run dev` | Start Astro in background mode at http://localhost:4321 |
| `npm run build` | Build the static pages and Vercel output |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Check Astro components and TypeScript |
| `npm run dev:status` | Show the background server status |
| `npm run dev:logs` | Read the background server logs |
| `npm run dev:stop` | Stop the background server |

PowerShell users with restricted script execution can use `npm.cmd` in place of `npm`.

## Current scope

- Shared header and footer, local six-face font setup, Tailwind colour tokens, favicons, and an English homepage.
- Homepage sections in order: header, hero, four services, Amphora introduction and four-step process, case studies, partner logos, team, contact, footer.
- A 50+ five-star Google review proof point and a simple four-step process including a free first draft.
- Exactly four services: Websites, Webshops & Web-Apps; Workflows & KI; CRM; Mobile apps.
- Four provisional case studies with keyboard-accessible, native in-place expansion. No filtering or separate case pages.
- All 14 partner logos in uniform dark grey on white, plus the supplied team and consultation photos.
- German `/impressum` and `/datenschutz` pages. Text was copied from the live site on 11 September 2026, without translation or rewriting. The source URLs and copy date are recorded alongside it.
- `/systeme`, `/skills`, and `/systeme-old` redirect permanently (301) to `/` through Astro’s Vercel configuration.

Colours are drawn from Amphora’s gradient mark and defined once in `src/styles/global.css`. The layout uses white backgrounds, dark grey text, rounded images, gradient CTA/service hovers, restrained scroll reveals, softly blurred wobble previews, and subtle team-photo focus effects. Motion respects the user’s reduced-motion preference and does not add a third-party runtime dependency.

## Content and assets

All editable page copy lives in validated Astro content collections:

| File | Content |
| --- | --- |
| `src/content/site.json` | Navigation, shared labels, footer, and page title |
| `src/content/homepage.json` | Hero, services, project previews, logos, team, and contact layout |
| `src/content/legal.json` | Unmodified German legal text, source URLs, and copy date |
| `src/content.config.ts` | Collection schemas |

English copy is a working draft and is marked on the page. `TODO:` fields identify approval and translation work. Case summaries and team biographies remain visibly provisional; no client results or metrics are invented. Case tags reference the four service IDs and are checked during the build.

Fonts are copied into `public/fonts/`. The pre-optimised images live under `public/images/`. Team originals in `src/assets/team/` are processed by Astro into responsive WebP images. The original handoff package remains the source of these files. No external font, image, or old-site runtime dependency is present.

## Reserved for later phases

- **Phase 3:** `/termin`, the Calendly embed, and `/danke-termin`. Booking links already preserve the required `/termin` target; that page does not exist yet in this Phase 2 build.
- **Phase 4:** The working contact form, `POST /api/kontakt`, Resend delivery, validation, and `/danke`. The contact area already has `id="calendly"`. Its disabled fieldset is a clearly labelled layout preview; the email link works. There is no submit handler or network request.
- **Phase 5:** Launch metadata, sitemap, robots rules, scroll motion, analytics/consent requirements, and launch audits.

`.env.example` lists the future `RESEND_API_KEY` variable without a value. No integration or secret is needed for Phases 1 and 2.

## Verification

Run `npm run check` and `npm run build` before reviewing a change. Review the homepage at **360, 390, 768, 1280, and 1440 px**, including the mobile menu, keyboard focus, expanded case studies, partner-logo treatment, image loading, and contact anchor. Booking and submission flows are intentionally deferred as described above.

The Vercel adapter produces deployment files in `.vercel/output/`. Creating a Vercel project, publishing, and switching the live domain remain outside this local implementation.
