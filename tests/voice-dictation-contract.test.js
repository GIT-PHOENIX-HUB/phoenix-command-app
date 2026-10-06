import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dictationBlocksSubmit,
  dictationButtonIsDisabled,
  isRecoverableRecognitionError,
  normalizeRecognitionError,
  stoppedInterimTranscript,
} from '../src/hooks/voiceDictationPolicy.js';

test('permission errors are normalized while other engine failures stay actionable', () => {
  assert.equal(normalizeRecognitionError('not-allowed'), 'denied');
  assert.equal(normalizeRecognitionError('service-not-allowed'), 'service-not-allowed');
  assert.equal(normalizeRecognitionError('audio-capture'), 'audio-capture');
  assert.equal(normalizeRecognitionError(undefined), 'unknown');
});

test('only a no-speech timeout preserves hands-free dictation intent', () => {
  assert.equal(isRecoverableRecognitionError('no-speech'), true);
  for (const terminal of ['denied', 'audio-capture', 'network', 'language-not-supported', 'start-failed']) {
    assert.equal(isRecoverableRecognitionError(terminal), false, terminal);
  }
});

test('an intentional stop promotes a pending interim phrase exactly once', () => {
  assert.equal(stoppedInterimTranscript(true, '  final field note  '), 'final field note ');
  assert.equal(stoppedInterimTranscript(true, '   '), null);
  assert.equal(stoppedInterimTranscript(false, 'natural timeout phrase'), null);
});

test('one active field locks the other microphone and blocks submission', () => {
  assert.equal(dictationButtonIsDisabled(null, 'notes', false), false);
  assert.equal(dictationButtonIsDisabled('notes', 'notes', false), false);
  assert.equal(dictationButtonIsDisabled('notes', 'materials', false), true);
  assert.equal(dictationButtonIsDisabled(null, 'notes', true), true);
  assert.equal(dictationBlocksSubmit(null), false);
  assert.equal(dictationBlocksSubmit('notes'), true);
  assert.equal(dictationBlocksSubmit('materials'), true);
});
