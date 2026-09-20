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
    about: intro.extend({ reviewCount: z.string(), reviewAriaLabel: z.string() }),
    process: z.object({ eyebrow: z.string(), heading: z.string(), description: z.string(), items: z.array(z.object({ number: z.string(), name: z.string(), description: z.string() })).length(4) }),
    work: intro.extend({ expandLabel: z.string(), collapseLabel: z.string(), placeholder: z.string(), items: z.array(z.object({ id: z.string(), name: z.string(), category: z.string(), image, services: z.array(z.string()).min(1), description: z.string(), todo: z.string().startsWith('TODO:') })) }),
    partners: z.object({ heading: z.string(), items: z.array(image).length(14) }),
    team: intro.extend({ note: z.string(), items: z.array(z.object({ id: z.enum(['salam', 'marcel']), name: z.string(), role: z.string(), imageAlt: z.string() })) }),
    contact: intro.extend({ booking: link, emailLabel: z.string(), email: z.string(), formHeading: z.string(), formNote: z.string(), name: z.string(), namePlaceholder: z.string(), emailField: z.string(), emailPlaceholder: z.string(), company: z.string(), companyPlaceholder: z.string(), service: z.string(), servicePlaceholder: z.string(), message: z.string(), messagePlaceholder: z.string(), submit: z.string(), optional: z.string() }),
  }),
});
const projectPreview = z.object({ id: z.string(), name: z.string(), category: z.string(), tag: z.string(), image });
const systems = defineCollection({
  loader: file('src/content/systems.json'),
  schema: z.object({
    title: z.string(), description: z.string(), draftLabel: z.string(),
    hero: z.object({ eyebrow: z.string(), heading: z.string(), emphasis: z.string(), subline: z.string(), note: z.string(), image, imageCaption: z.string(), imageNote: z.string(), scrollLabel: z.string() }),
    trust: z.object({ eyebrow: z.string(), note: z.string(), logos: z.array(image) }),
    needs: intro.extend({ items: z.array(z.object({ number: z.string(), heading: z.string(), description: z.string(), service: z.string(), linkLabel: z.string() })).length(4) }),
    sample: intro.extend({ project: z.string(), image, note: z.string(), items: z.array(z.object({ label: z.string(), text: z.string() })) }),
    services: intro.extend({ items: z.array(z.object({ id: z.string(), number: z.string(), name: z.string(), icon: z.enum(['web', 'workflow', 'crm', 'mobile']), accent: z.enum(['blue', 'red', 'orange', 'purple']), useCase: z.string(), service: z.string(), outcome: z.string(), proof: z.string() })).length(4) }),
    work: intro.extend({
      items: z.array(projectPreview.extend({ situation: z.string(), work: z.string(), outcome: z.string(), status: z.string() })).length(2),
      gallery: z.array(projectPreview), galleryNote: z.string(),
      automation: z.object({ label: z.string(), heading: z.string(), description: z.string(), steps: z.array(z.string()), note: z.string(), image: image.nullable(), imageCaption: z.string() }),
    }),
    process: intro.extend({ items: z.array(z.object({ number: z.string(), name: z.string(), description: z.string(), effort: z.string() })).length(4) }),
    support: intro.extend({ items: z.array(z.object({ name: z.string(), description: z.string() })) }),
    about: intro.extend({
      name: z.string(), role: z.string(), connection: z.string(),
      marcel: z.object({ name: z.string(), role: z.string(), imageAlt: z.string() }),
    }),
    faq: intro.extend({ items: z.array(z.object({ question: z.string(), answer: z.string() })) }),
    contact: intro.extend({ formHeading: z.string(), formNote: z.string(), email: z.email() }),
  }),
});
const skills = defineCollection({
  loader: file('src/content/skills.json'),
  schema: z.object({
    todo: z.string().startsWith('TODO:'), title: z.string(), description: z.string(), draftLabel: z.string(),
    hero: z.object({ eyebrow: z.string(), heading: z.string(), emphasis: z.string(), subline: z.string(), primary: z.string(), secondary: z.string(), note: z.string(), imageAlt: z.string(), imageCaption: z.string(), cardLabel: z.string(), cardHeading: z.string(), cardNote: z.string() }),
    navigation: z.array(link),
    trust: z.object({ eyebrow: z.string(), heading: z.string(), placeholder: z.string(), note: z.string(), todo: z.string() }),
    needs: intro.extend({ items: z.array(z.object({ number: z.string(), heading: z.string(), description: z.string(), service: z.string(), link: z.string() })) }),
    sample: intro.extend({ placeholder: z.string(), note: z.string(), status: z.string(), todo: z.string(), steps: z.array(z.object({ name: z.string(), description: z.string() })) }),
    services: intro.extend({ labels: z.array(z.string()).length(3), cta: z.string(), items: z.array(z.object({ id: z.string(), number: z.string(), name: z.string(), icon: z.enum(['web', 'workflow', 'crm', 'mobile']), accent: z.enum(['blue', 'red', 'orange', 'purple']), useCase: z.string(), service: z.string(), outcome: z.string() })).length(4) }),
    projects: intro.extend({ status: z.string(), labels: z.array(z.string()).length(3), items: z.array(z.object({ number: z.string(), heading: z.string(), situation: z.string(), service: z.string(), outcome: z.string(), todo: z.string() })).length(2) }),
    process: intro.extend({ effortLabel: z.string(), items: z.array(z.object({ number: z.string(), name: z.string(), description: z.string(), effort: z.string() })).length(4) }),
    partners: intro.extend({ tags: z.array(z.string()), cta: z.string(), placeholder: z.string(), note: z.string(), todo: z.string() }),
    about: intro.extend({ connection: z.string(), cta: z.string(), name: z.string(), role: z.string(), imageAlt: z.string(), secondaryName: z.string(), secondaryRole: z.string(), bioNote: z.string(), todo: z.string() }),
    faq: intro.extend({ items: z.array(z.object({ question: z.string(), answer: z.string() })) }),
    contact: intro.extend({ formHeading: z.string(), formNote: z.string(), email: z.email() }),
    crossLink: z.object({ text: z.string(), label: z.string() }),
  }),
});
export const collections = { site, legal, homepage, systems, skills };
