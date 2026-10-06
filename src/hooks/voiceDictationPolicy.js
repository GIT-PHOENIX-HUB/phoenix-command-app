const RECOVERABLE_RECOGNITION_ERRORS = new Set(['no-speech']);

export function normalizeRecognitionError(error) {
  if (error === 'not-allowed') {
    return 'denied';
  }
  return String(error ?? 'unknown');
}

export function isRecoverableRecognitionError(error) {
  return RECOVERABLE_RECOGNITION_ERRORS.has(normalizeRecognitionError(error));
}

export function stoppedInterimTranscript(stopRequested, interim) {
  const text = stopRequested ? String(interim ?? '').trim() : '';
  return text ? `${text} ` : null;
}

export function dictationBlocksSubmit(activeField) {
  return activeField !== null;
}

export function dictationButtonIsDisabled(activeField, field, submitting) {
  return Boolean(submitting || (activeField !== null && activeField !== field));
}
