import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContactRequest } from '../src/lib/contact.ts';

const now = 1_800_000_000_000;
const minimal = { name: 'Alex Taylor', email: 'alex@example.com', projectDescription: 'A project enquiry.', formLoadedAt: now - 3000 };
function fixture(provider = async () => Response.json({ id: 'test-message' })) {
  const sent = [];
  const fetcher = async (url, options) => { sent.push({ url, options, body: JSON.parse(options.body) }); return provider(); };
  const invoke = (body, { headers = {}, apiKey = 'test-key', raw } = {}) => {
    const request = new Request('https://amphora.example/api/kontakt', {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: raw ?? JSON.stringify(body),
    });
    return handleContactRequest(request, new URL(request.url), { apiKey, fetcher, now });
  };
  return { invoke, sent };
}

test('accepts the minimal contract and returns JSON without an Accept header', async () => {
  const { invoke, sent } = fixture();
  const response = await invoke(minimal);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].body.subject, 'Neue Anfrage von Alex Taylor');
  assert.match(sent[0].body.text, /Organisation \(companyName\): Not provided/);
  assert.match(sent[0].body.text, /Contact by phone \(contactViaPhone\): No/);
});

test('sends every field in the email with the required sender, recipient and reply-to', async () => {
  const { invoke, sent } = fixture();
  const payload = { ...minimal, companyName: 'Example Co', serviceType: 'CRM', selectedServices: ['CRM', 'Workflows & AI'], contactViaPhone: true, phone: '+49 123 456789', website: '', area: 'systems' };
  assert.equal((await invoke(payload)).status, 200);
  const delivery = sent[0];
  assert.equal(delivery.url, 'https://api.resend.com/emails');
  assert.equal(delivery.options.headers.Authorization, 'Bearer test-key');
  assert.equal(delivery.body.from, 'Anfrage <formular@amphora-it.com>');
  assert.deepEqual(delivery.body.to, ['m.henning@amphora-it.com']);
  assert.equal(delivery.body.reply_to, payload.email);
  assert.equal(delivery.body.subject, 'Neue Anfrage von Alex Taylor (Example Co)');
  for (const field of Object.keys(payload)) assert.ok(delivery.body.text.includes(`(${field})`), `Missing ${field}`);
  assert.match(delivery.body.text, /CRM, Workflows & AI/);
  assert.match(delivery.body.text, /\+49 123 456789/);
  assert.deepEqual(delivery.body.tags, [{ name: 'area', value: 'systems' }]);
});

test('returns field errors for required fields, invalid types and conditional phone', async () => {
  const { invoke, sent } = fixture();
  for (const [field, value] of [['name', ' '], ['email', 'invalid'], ['projectDescription', ' '], ['formLoadedAt', undefined], ['formLoadedAt', String(now - 3000)], ['contactViaPhone', 'false'], ['selectedServices', 'CRM'], ['selectedServices', [12]], ['companyName', 'x\nInjected'], ['phone', 123]]) {
    const response = await invoke({ ...minimal, [field]: value });
    assert.equal(response.status, 400, field);
    assert.ok((await response.json()).errors[field], field);
  }
  const phoneResponse = await invoke({ ...minimal, contactViaPhone: true, phone: '  ' });
  assert.equal(phoneResponse.status, 400);
  assert.equal((await phoneResponse.json()).errors.phone, 'Enter a phone number so we can call you.');
  assert.equal(sent.length, 0);
  assert.equal((await invoke({ ...minimal, contactViaPhone: false, companyName: '', serviceType: '', phone: '', selectedServices: [] })).status, 200);
});

test('silently discards honeypot submissions without delivery or validation hints', async () => {
  const { invoke, sent } = fixture();
  for (const website of ['bot.example', ' ']) {
    const response = await invoke({ website }, { apiKey: '' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  }
  assert.equal(sent.length, 0);
});

test('rejects submissions before three seconds including future timestamps', async () => {
  const { invoke, sent } = fixture();
  for (const age of [-1000, 0, 2999]) {
    const response = await invoke({ ...minimal, formLoadedAt: now - age });
    assert.equal(response.status, 429, `age ${age}`);
    assert.equal((await response.json()).success, false);
  }
  assert.equal(sent.length, 0);
  assert.equal((await invoke({ ...minimal, formLoadedAt: now - 3000 })).status, 200);
});

test('rejects invalid transport, cross-origin requests and oversized bodies', async () => {
  const { invoke, sent } = fixture();
  assert.equal((await invoke(minimal, { headers: { Origin: 'https://other.example' } })).status, 403);
  assert.equal((await invoke(minimal, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await invoke(null, { raw: '{broken' })).status, 400);
  assert.equal((await invoke(minimal, { headers: { 'Content-Length': '40000' } })).status, 413);
  assert.equal((await invoke(null, { raw: ' '.repeat(32001) })).status, 413);
  assert.equal(sent.length, 0);
});

test('reports missing configuration and provider failures without false success', async () => {
  const missing = fixture();
  const missingResponse = await missing.invoke(minimal, { apiKey: '' });
  assert.equal(missingResponse.status, 503);
  assert.equal(missing.sent.length, 0);
  for (const provider of [async () => Response.json({ error: 'Rejected' }, { status: 422 }), async () => Response.json({}), async () => new Response('bad gateway', { status: 502 }), async () => { throw new Error('Offline'); }]) {
    const { invoke } = fixture(provider);
    const response = await invoke(minimal);
    assert.equal(response.status, 502);
    assert.equal((await response.json()).success, false);
  }
});

test('keeps the future Skills area compatible with optional enquiry type', async () => {
  const { invoke, sent } = fixture();
  assert.equal((await invoke({ ...minimal, area: 'skills' })).status, 200);
  assert.deepEqual(sent[0].body.tags, [{ name: 'area', value: 'skills' }]);
});
