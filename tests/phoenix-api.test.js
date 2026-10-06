/**
 * Tests for the askPhoenixAI /v3/chat adapter contract.
 *
 * src/api/phoenix-api.js uses Vite's import.meta.env substitutions, which are
 * not available in the Node.js test runner.  The adapter logic is therefore
 * reproduced inline here so the contract can be executed and verified with a
 * mocked fetch.  Any change to the fetch-call shape or response normalisation
 * in askPhoenixAI MUST be reflected in this file.
 *
 * Verified contract (PR #6 — runtime-wire-9120):
 *   endpoint  POST {API_BASE}/v3/chat
 *   request   { message: string }            (agents not forwarded)
 *   response  { text: string, ...rest }
 *   return    { result: string, ...rest }    (result aliases text for callers)
 */

import assert from 'node:assert/strict';
import test from 'node:test';

const MAX_QUERY_LENGTH = 4000; // mirrors src/api/phoenix-api.js

/**
 * Inline mirror of askPhoenixAI from src/api/phoenix-api.js.
 * apiBase and credentials are passed as explicit parameters here because
 * import.meta.env is unavailable outside Vite.
 */
async function askPhoenixAI(query, apiBase, { token = null, functionKey = '' } = {}) {
  if (query.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  if (functionKey) {
    headers['x-functions-key'] = functionKey;
  }

  const response = await fetch(`${apiBase}/v3/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message: query }),
  });

  if (!response.ok) {
    throw new Error(`AI query failed: ${response.statusText}`);
  }

  const payload = await response.json();
  // v3 envelope carries the reply in `text`; keep the caller's `.result` contract.
  return { result: payload.text, ...payload };
}

// ---------------------------------------------------------------------------
// Request shape
// ---------------------------------------------------------------------------

test('askPhoenixAI sends { message } to /v3/chat — not the legacy { query, agents } shape', async (t) => {
  const captured = [];
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url, init) => {
    captured.push({ url, init });
    return { ok: true, json: async () => ({ text: 'Hello from Phoenix' }) };
  };

  await askPhoenixAI('Who are you?', 'http://127.0.0.1:9120');

  assert.equal(captured.length, 1);
  assert.equal(captured[0].url, 'http://127.0.0.1:9120/v3/chat');
  assert.equal(captured[0].init.method, 'POST');

  const body = JSON.parse(captured[0].init.body);
  assert.deepEqual(body, { message: 'Who are you?' },
    'body must contain only { message } — agents must not be forwarded to /v3/chat');
  assert.equal('query' in body, false, 'legacy "query" key must not be present');
  assert.equal('agents' in body, false, '"agents" must not be forwarded to the runtime');
});

// ---------------------------------------------------------------------------
// Response normalisation
// ---------------------------------------------------------------------------

test('askPhoenixAI normalises the v3 envelope: result = payload.text, rest is preserved', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ text: 'Hello from Phoenix', sessionId: 'abc123', tokens: 42 }),
  });

  const result = await askPhoenixAI('ping', 'http://127.0.0.1:9120');

  assert.equal(result.result, 'Hello from Phoenix', 'result must alias payload.text');
  assert.equal(result.text, 'Hello from Phoenix', 'original text field must be preserved');
  assert.equal(result.sessionId, 'abc123', 'additional response fields must be preserved');
  assert.equal(result.tokens, 42);
});

test('askPhoenixAI result.text is undefined when the runtime omits it', async (t) => {
  // Documents behaviour when runtime omits `text` (e.g. partial/streaming stub).
  // result will be undefined in that case — callers should guard on result.result.
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ status: 'queued' }),
  });

  const result = await askPhoenixAI('ping', 'http://127.0.0.1:9120');
  assert.equal(result.result, undefined);
  assert.equal(result.status, 'queued');
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

test('askPhoenixAI rejects queries longer than MAX_QUERY_LENGTH before any fetch', async (t) => {
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => { fetchCalled = true; return { ok: true, json: async () => ({}) }; };

  await assert.rejects(
    () => askPhoenixAI('x'.repeat(MAX_QUERY_LENGTH + 1), 'http://127.0.0.1:9120'),
    /Query exceeds maximum length of 4000 characters/
  );
  assert.equal(fetchCalled, false, 'fetch must not be called when validation fails');
});

test('askPhoenixAI throws with the runtime status text on a non-ok response', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => ({ ok: false, statusText: 'Bad Gateway' });

  await assert.rejects(
    () => askPhoenixAI('ping', 'http://127.0.0.1:9120'),
    /AI query failed: Bad Gateway/
  );
});

// ---------------------------------------------------------------------------
// Headers
// ---------------------------------------------------------------------------

test('askPhoenixAI attaches Authorization header when a token is provided', async (t) => {
  const captured = [];
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url, init) => {
    captured.push(init);
    return { ok: true, json: async () => ({ text: 'ok' }) };
  };

  await askPhoenixAI('hello', 'http://127.0.0.1:9120', { token: 'test-token-xyz' });

  assert.ok(captured[0].headers.Authorization.startsWith('Bearer '), 'Authorization must use ******');
  assert.ok(captured[0].headers.Authorization.includes('test-token-xyz'), 'Authorization must include the supplied token');
});

test('askPhoenixAI omits Authorization header when no token is given', async (t) => {
  const captured = [];
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url, init) => {
    captured.push(init);
    return { ok: true, json: async () => ({ text: 'ok' }) };
  };

  await askPhoenixAI('hello', 'http://127.0.0.1:9120');

  assert.equal('Authorization' in captured[0].headers, false,
    'Authorization header must not be present when no token is supplied');
});
