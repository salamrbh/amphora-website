# Amphora Systems

A Systems landing page built with Astro, TypeScript, Tailwind CSS 4, and the Vercel adapter. It uses plain Astro components and locally hosted fonts and images. The September 2026 Part B Systems brief is implemented at `/systems`; `/` displays the same page until the separate hub is built.

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
| `npm test` | Verify the contact API contract with a mocked email provider |
| `npm run dev:status` | Show the background server status |
| `npm run dev:logs` | Read the background server logs |
| `npm run dev:stop` | Stop the background server |

PowerShell users with restricted script execution can use `npm.cmd` in place of `npm`.

## Current scope

The page follows the brief: hero, Systems references, four need scenarios, a project walkthrough, four service cards, two project narratives plus a lighter gallery and an illustrative automation, collaboration, ongoing support, Salam as the Systems contact alongside Marcel as co-founder of Skills, FAQs, and a short enquiry form.

Shared navigation is Systems, Skills, About, Contact. Section 02 uses all 14 supplied partner logos in a centered, full-width strip with a continuous right-to-left loop and faded edges. There is no partner count or selection label. Reduced-motion preferences show all logos in centered, static rows. The secondary page navigation and unverified Google review count are no longer rendered. Free-draft offers are removed.

`/skills` implements Part C of the 15 September developer briefing. The existing Skills navigation and Systems cross-link now lead there. Its ten sections use the existing fonts, colour tokens, shared layout and section headings. Systems section components and copy are unchanged. The hub remains a separate, undecided task.

Skills copy is in the validated `src/content/skills.json` collection. Sections 02 (trust), 04 (course sample) and 08 (education partners) intentionally reserve visible space for later content; locate them using `data-content-slot` in `src/components/skills/SkillsPage.astro`. The sample has no pretend playback control. Add the approved video, captions and transcript when supplied. The two project stories and Marcel’s detailed biography are also explicitly awaiting approval. Planned client names are kept in editorial TODO fields and are not shown to visitors.

Service and partnership CTAs preselect the Skills enquiry type. The form uses the existing endpoint with `area=skills`, the same validation and delivery behaviour, and the shared success page. `/termin?area=skills` offers Skills formats, preserves the selected service, and passes Skills UTM context into the existing Calendly embed. A separate Skills calendar has not been supplied, so the shared calendar URL remains unchanged. Without JavaScript, the booking page asks visitors to mention their area in the booking.

Only `/systeme-old` retains its 301 redirect to `/`. The old `/systeme` and `/skills` redirects are removed. German legal pages and their content are unchanged.

## Content and assets

Landing-page copy lives in validated Astro content collections:

| File | Content |
| --- | --- |
| `src/content/site.json` | Global navigation, shared labels, and footer |
| `src/content/systems.json` | Systems copy, services, stories, images, automation, FAQs, and contact copy |
| `src/content/skills.json` | Skills copy, four learning formats, reserved media sections, project placeholders, FAQs and contact copy |
| `src/content/routes.json` | Area paths, Skills availability, booking path, and exact Calendly URL |
| `src/content/legal.json` | Unmodified German legal text, source URLs, and copy date |
| `src/content.config.ts` | Collection schemas |

English copy remains marked for review. The client has not supplied additional project details or verified results. The two stories distinguish observations from the supplied screenshots from the starting situation and outcomes that still need confirmation. The walkthrough is explicitly a design reading, not an attributed client rationale. References remain labelled as awaiting approval.

The automation is deliberately text-only and labelled as an illustration, not a completed project. To replace it, edit `work.automation` in `systems.json`: update the heading, description, steps and note, and optionally replace `image: null` with `{ "src": "/images/work/example.webp", "alt": "Meaningful description", "width": 1200, "height": 800 }`. Supply the matching AVIF asset and set `imageCaption`. No empty image frame is rendered while the image is null. CRM, automation, mobile apps and web apps are identified as new to the displayed portfolio or awaiting examples.

The previous `homepage.json` and unused `components/home/` sections are retained as source material. The current landing page uses `components/systems/`, plus the existing hero component.

Fonts are copied into `public/fonts/`. The pre-optimised images live under `public/images/`. Team originals in `src/assets/team/` are processed by Astro into responsive WebP images. The original handoff package remains the source of these files. No external font, image, or old-site runtime dependency is present.

## Booking and enquiries

`/termin` immediately initializes the Calendly inline embed using the exact URL and colours provided by the client. The same unmodified URL is the visible fallback link. The embed API attaches the Systems area and selected service as UTM context, as described in [Calendly's embed documentation](https://developer.calendly.com/api-docs/overview/embedding/recipes). These are attribution fields, not invented custom booking-question answers. A confirmed `calendly.event_scheduled` message is accepted only from `https://calendly.com` and the embedded iframe, then redirects to `/danke-termin`.

The live calendar was verified to render on 18 September 2026. Its existing event title is **Kostenloses Analysegespräch** (free analysis call). That title is controlled in the Calendly account and should be renamed there to align the booking flow with the brief's no-giveaway wording; the supplied URL has been preserved.

Service-card and support links preselect the enquiry service. The form posts **JSON** to `/api/kontakt` using the exact fields: `name`, `email`, `companyName`, `serviceType`, `selectedServices`, `projectDescription`, `contactViaPhone`, `phone`, `website`, and `formLoadedAt`. It also sends hidden `area=systems`; the endpoint accepts `area=skills` for the future page and defaults to Systems if omitted.

Name, a valid email, and project description are required. Organisation and enquiry type are optional. `selectedServices` is an optional string array; the current single-service selector populates it with the selected service's display name from the content collection. Final service names can be changed there when approved. The server accepts up to four string entries. Phone is required only when the visitor selects the callback checkbox. `formLoadedAt` is a numeric timestamp set in the browser when the form initializes; the server rejects submissions less than three seconds later, future timestamps, and missing or invalid timestamps. A filled honeypot is silently discarded with the same `{ "success": true }` response, without calling Resend.

Validation errors appear beside the relevant fields and focus moves to the first invalid field. The submit button is disabled during requests, errors preserve the visitor's entries, and `{ "success": true }` redirects to `/danke`. JSON responses are returned regardless of the `Accept` header. Without JavaScript, the page offers direct email instead of submitting an untimed form. Both confirmation pages are noindex. Server validation and delivery logic live in `src/lib/contact.ts`; the Astro endpoint remains on-demand (`prerender = false`), while page routes remain static.

Set `RESEND_API_KEY` in local `.env` or Vercel's server environment to enable delivery. The sender is `Anfrage <formular@amphora-it.com>` and recipient is `m.henning@amphora-it.com`, from the existing handoff; the sending domain must be verified with Resend. Without the key, the endpoint returns an honest unavailable response and the form offers the email fallback. No secret is committed, no real test enquiry has been sent, and no real booking has been made.

Still needed before launch: approved case details and references, the real automation case when available, Skills media and partner information, final copy approval/translation, delivery configuration, and any separate launch SEO/analytics work. The hub remains a separate task.

## Verification

Run `npm run check` and `npm run build` before reviewing a change. Review `/systems` at **360, 390, 768, 1280, and 1440 px**, including the mobile menu, keyboard focus, FAQ expansion, image loading, service preselection and contact anchor. These sizes passed layout and automated accessibility checks. Endpoint delivery branches were verified with a mocked provider; confirmation and failure handling were checked without sending email or booking a meeting. Refresh/restart the background server after changing collection configuration if its content cache is stale.

The Vercel adapter produces deployment files in `.vercel/output/`. Creating a Vercel project, publishing, and switching the live domain remain outside this local implementation.
