import assert from 'node:assert/strict';
import test from 'node:test';

import {
  injectConnectSource,
  requireProductionRuntime
} from '../build/runtime-origin.js';

test('production runtime base is required and must use HTTPS', () => {
  assert.throws(
    () => requireProductionRuntime(''),
    /VITE_API_BASE is required/
  );
  assert.throws(
    () => requireProductionRuntime('http://127.0.0.1:9120'),
    /must use HTTPS/
  );
  assert.throws(
    () => requireProductionRuntime('not a URL'),
    /absolute HTTPS URL/
  );
  for (const privateUrl of [
    'https://localhost:9120',
    'https://127.0.0.1:9120',
    'https://10.0.0.8',
    'https://192.168.1.20',
    'https://runtime.internal',
    'https://runtime.example.test'
  ]) {
    assert.throws(
      () => requireProductionRuntime(privateUrl),
      /public gateway hostname/
    );
  }
});

test('production runtime URL is normalized while preserving an optional base path', () => {
  assert.deepEqual(
    requireProductionRuntime(' https://gateway.example.com/runtime/// '),
    {
      baseUrl: 'https://gateway.example.com/runtime',
      origin: 'https://gateway.example.com'
    }
  );
});

test('production runtime URL rejects credentials, queries, and fragments', () => {
  assert.throws(
    () => requireProductionRuntime('https://user:pass@gateway.example.com'),
    /must not contain credentials/
  );
  assert.throws(
    () => requireProductionRuntime('https://gateway.example.com?token=value'),
    /must not contain credentials/
  );
  assert.throws(
    () => requireProductionRuntime('https://gateway.example.com/#private'),
    /must not contain credentials/
  );
});

test('Azure CSP receives only the configured runtime origin', () => {
  const source = {
    globalHeaders: {
      'Content-Security-Policy': (
        "default-src 'self'; connect-src 'self' https://login.microsoftonline.com; "
        + "img-src 'self' data:;"
      )
    }
  };
  const updated = injectConnectSource(source, 'https://gateway.example.com');
  const policy = updated.globalHeaders['Content-Security-Policy'];

  assert.match(
    policy,
    /connect-src 'self' https:\/\/login\.microsoftonline\.com https:\/\/gateway\.example\.com;/
  );
  assert.equal(policy.includes('http://127.0.0.1:9120'), false);
  // Verify the original config object was not mutated (structuredClone isolation).
  assert.doesNotMatch(
    source.globalHeaders['Content-Security-Policy'],
    /https:\/\/gateway\.example\.com(?:[\s;/]|$)/
  );
});

test('Azure CSP injection does not duplicate an existing origin', () => {
  const source = {
    globalHeaders: {
      'Content-Security-Policy': (
        "default-src 'self'; connect-src 'self' https://gateway.example.com;"
      )
    }
  };
  const updated = injectConnectSource(source, 'https://gateway.example.com');
  const matches = updated.globalHeaders['Content-Security-Policy']
    .match(/https:\/\/gateway\.example\.com/g);
  assert.equal(matches?.length, 1);
});
