import { z } from 'astro/zod';

const optionalLine = (max: number) => z.string().trim().max(max, `Use no more than ${max} characters.`).regex(/^[^\r\n]*$/, 'Use a single line.').optional().default('');
const enquirySchema = z.object({
  name: z.string({ error: 'Enter your name.' }).trim().min(1, 'Enter your name.').max(120, 'Use no more than 120 characters.').regex(/^[^\r\n]+$/, 'Use a single line.'),
  email: z.string({ error: 'Enter a valid email address.' }).trim().pipe(z.email({ error: 'Enter a valid email address.' }).max(254)),
  companyName: optionalLine(160),
  serviceType: optionalLine(160),
  selectedServices: z.array(z.string().trim().min(1).max(160)).max(4).optional().default([]),
  projectDescription: z.string({ error: 'Tell us a little about your project.' }).trim().min(1, 'Tell us a little about your project.').max(5000, 'Use no more than 5,000 characters.'),
  contactViaPhone: z.boolean().optional().default(false),
  phone: optionalLine(50),
  website: z.string().optional().default(''),
  formLoadedAt: z.number({ error: 'Please reload the page and try again.' }).int().positive(),
  area: z.enum(['systems', 'skills']).optional().default('systems'),
}).superRefine((enquiry, context) => {
  if (enquiry.contactViaPhone && !enquiry.phone) context.addIssue({ code: 'custom', path: ['phone'], message: 'Enter a phone number so we can call you.' });
});

interface DeliveryOptions {
  apiKey?: string;
  fetcher?: typeof fetch;
  now?: number;
}

export async function handleContactRequest(request: Request, url: URL, { apiKey, fetcher = fetch, now = Date.now() }: DeliveryOptions) {
  const respond = (status: number, body: { success: boolean; message?: string; errors?: Record<string, string> }) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  const fail = (status: number, message: string, errors?: Record<string, string>) => respond(status, { success: false, message, ...(errors ? { errors } : {}) });
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return fail(403, 'Please send your enquiry from the Amphora website.');
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail(415, 'Please send your enquiry as JSON.');
  if (Number(request.headers.get('content-length')) > 32000) return fail(413, 'Your message is too long. Please use up to 5,000 characters.');
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 32000) return fail(413, 'Your message is too long. Please use up to 5,000 characters.');
    body = JSON.parse(raw);
  } catch { return fail(400, 'Please check your details and try again.'); }

  // Give bots no indication that the honeypot was detected; never contact Resend.
  if (body && typeof body === 'object' && 'website' in body && typeof body.website === 'string' && body.website.length > 0) return respond(200, { success: true });
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string' && !errors[field]) errors[field] = issue.message;
    }
    return fail(400, 'Please check the highlighted fields and try again.', errors);
  }
  const enquiry = parsed.data;
  if (now - enquiry.formLoadedAt < 3000) return fail(429, 'Please wait a moment before sending your enquiry, then try again.');
  if (!apiKey) return fail(503, 'The contact form is temporarily unavailable. Your message has not been sent. Please email info@amphora-it.com.');

  const text = [
    `Name (name): ${enquiry.name}`,
    `Email (email): ${enquiry.email}`,
    `Organisation (companyName): ${enquiry.companyName || 'Not provided'}`,
    `Enquiry type (serviceType): ${enquiry.serviceType || 'Not specified'}`,
    `Selected services (selectedServices): ${enquiry.selectedServices.join(', ') || 'None selected'}`,
    `Contact by phone (contactViaPhone): ${enquiry.contactViaPhone ? 'Yes' : 'No'}`,
    `Phone (phone): ${enquiry.phone || 'Not provided'}`,
    `Area (area): ${enquiry.area}`,
    `Website honeypot (website): empty`,
    `Form loaded at (formLoadedAt): ${enquiry.formLoadedAt}`,
    `\nProject (projectDescription):\n${enquiry.projectDescription}`,
  ].join('\n');
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: 'Anfrage <formular@amphora-it.com>',
        to: ['m.henning@amphora-it.com'],
        reply_to: enquiry.email,
        subject: `Neue Anfrage von ${enquiry.name}${enquiry.companyName ? ` (${enquiry.companyName})` : ''}`,
        text,
        tags: [{ name: 'area', value: enquiry.area }],
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.id) return fail(502, 'Your message could not be sent. Please try again or email info@amphora-it.com.');
    return respond(200, { success: true });
  } catch { return fail(502, 'Your message could not be sent. Please try again or email info@amphora-it.com.'); }
}
