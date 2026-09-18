import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { handleContactRequest } from '../../lib/contact';

export const prerender = false;

export const POST: APIRoute = ({ request, url }) => handleContactRequest(request, url, { apiKey: getSecret('RESEND_API_KEY') });
