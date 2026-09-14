import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

const link = z.object({ label: z.string(), href: z.string() });
const site = defineCollection({
  loader: file('src/content/site.json'),
  schema: z.object({
    title: z.string(), lang: z.string(), skipLink: z.string(), homeLabel: z.string(),
    menuLabel: z.string(), navigationLabel: z.string(), navigation: z.array(link),
    booking: link, email: z.string(), legalBack: z.string(),
    footer: z.object({ tagline: z.string(), location: z.string(), copyright: z.string(), legalLinks: z.array(link) }),
  }),
});
const legal = defineCollection({
  loader: file('src/content/legal.json'),
  schema: z.object({ title: z.string(), html: z.string(), source: z.url(), copiedOn: z.string() }),
});
const image = z.object({ src: z.string(), alt: z.string(), width: z.number(), height: z.number() });
const intro = z.object({ eyebrow: z.string(), heading: z.string(), emphasis: z.string(), description: z.string().optional() });
const homepage = defineCollection({
  loader: file('src/content/homepage.json'),
  schema: z.object({
    todo: z.string().startsWith('TODO:'),
    draftLabel: z.string(),
    hero: z.object({ eyebrow: z.string(), heading: z.string(), emphasis: z.string(), subline: z.string(), primary: link, secondary: link, note: z.string(), image, imageCaption: z.string(), imageNote: z.string(), scrollLabel: z.string() }),
    services: intro.extend({ items: z.array(z.object({ id: z.string(), number: z.string(), name: z.string(), description: z.string(), icon: z.enum(['web', 'workflow', 'crm', 'mobile']), accent: z.enum(['blue', 'red', 'orange', 'purple']), tags: z.array(z.string()) })).length(4) }),
    about: intro.extend({ reviewCount: z.string(), reviewLabel: z.string(), reviewAriaLabel: z.string() }),
    process: z.object({ eyebrow: z.string(), heading: z.string(), description: z.string(), items: z.array(z.object({ number: z.string(), name: z.string(), description: z.string() })).length(4) }),
    work: intro.extend({ expandLabel: z.string(), collapseLabel: z.string(), placeholder: z.string(), items: z.array(z.object({ id: z.string(), name: z.string(), category: z.string(), image, services: z.array(z.string()).min(1), description: z.string(), todo: z.string().startsWith('TODO:') })) }),
    partners: z.object({ heading: z.string(), items: z.array(image).length(14) }),
    team: intro.extend({ note: z.string(), items: z.array(z.object({ id: z.enum(['salam', 'marcel']), name: z.string(), role: z.string(), description: z.string(), imageAlt: z.string(), todo: z.string().startsWith('TODO:') })) }),
    contact: intro.extend({ booking: link, emailLabel: z.string(), email: z.string(), formHeading: z.string(), formNote: z.string(), name: z.string(), namePlaceholder: z.string(), emailField: z.string(), emailPlaceholder: z.string(), company: z.string(), companyPlaceholder: z.string(), service: z.string(), servicePlaceholder: z.string(), message: z.string(), messagePlaceholder: z.string(), submit: z.string(), optional: z.string() }),
  }),
});
export const collections = { site, legal, homepage };
