import { useCallback, useEffect, useRef, useState } from 'react';
import {
  isRecoverableRecognitionError,
  normalizeRecognitionError,
  stoppedInterimTranscript,
} from './voiceDictationPolicy';

/**
 * Voice dictation for form fields via the browser's Web Speech API.
 *
 * Honesty contract: `supported` is a real feature-detect — when the browser
 * ships no SpeechRecognition (some iOS/WebView builds), callers render a
 * disabled control with an explanation instead of a button that lies.
 * No audio leaves the device except through the browser's own speech service;
 * nothing is recorded or uploaded by the app itself.
 */

type SpeechRecognitionCtor = new () => any;

const getRecognitionCtor = (): SpeechRecognitionCtor | null => {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export type DictationLang = 'en' | 'es';

const BCP47: Record<DictationLang, string> = {
  en: 'en-US',
  es: 'es-US',
};

export interface VoiceDictation {
  supported: boolean;
  /** True until the recognizer has ended and all final/pending text has been delivered. */
  active: boolean;
  listening: boolean;
  /** The user pressed Stop; final recognition events are still being collected. */
  stopping: boolean;
  /** Live interim transcript while speaking (already-final text is delivered via onFinal). */
  interim: string;
  /** Last error, cleared on the next start(). 'denied' | 'no-speech' | 'aborted' | other engine codes. */
  error: string | null;
  start: () => boolean;
  stop: () => void;
}

/**
 * @param lang    UI language from LanguageContext — dictation follows it.
 * @param onFinal Called with each FINAL transcript chunk (trailing space added);
 *                append it to the bound field's state.
 */
export function useVoiceDictation(lang: DictationLang, onFinal: (text: string) => void): VoiceDictation {
  const ctor = getRecognitionCtor();
  const supported = ctor !== null;

  const [listening, setListening] = useState(false);
  const [active, setActive] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const interimRef = useRef('');
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;
  // User-intent flag: distinguishes a tap on stop from the engine's own end
  // (mobile engines end sessions on silence; we restart only if still wanted).
  const wantedRef = useRef(false);
  // An intentional Stop asks the engine to finalize its current phrase. Keep
  // the form locked until onend, and promote a still-interim phrase if the
  // engine ends without emitting a final result for it.
  const stopRequestedRef = useRef(false);

  const flushStoppedInterim = useCallback(() => {
    const pending = stoppedInterimTranscript(stopRequestedRef.current, interimRef.current);
    interimRef.current = '';
    setInterim('');
    if (pending) onFinalRef.current(pending);
  }, []);

  const stop = useCallback(() => {
    wantedRef.current = false;
    const rec = recognitionRef.current;
    if (!rec) {
      setListening(false);
      setActive(false);
      setStopping(false);
      return;
    }

    stopRequestedRef.current = true;
    setListening(false);
    setStopping(true);
    try {
      rec.stop();
    } catch {
      flushStoppedInterim();
      stopRequestedRef.current = false;
      recognitionRef.current = null;
      setError('stop-failed');
      setActive(false);
      setStopping(false);
    }
  }, [flushStoppedInterim]);

  const start = useCallback(() => {
    if (!ctor || recognitionRef.current) return false;
    setError(null);
    stopRequestedRef.current = false;

    try {
      const rec = new ctor();
      rec.lang = BCP47[lang];
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const text = String(result[0]?.transcript ?? '').trim();
            if (text) onFinalRef.current(text + ' ');
          } else {
            interimText += result[0]?.transcript ?? '';
          }
        }
        interimRef.current = interimText;
        setInterim(interimText);
      };

      rec.onerror = (event: any) => {
        const code = normalizeRecognitionError(event?.error);
        setError(code);
        // `no-speech` is the browser's recoverable silence timeout. Preserve
        // the user's intent so onend restarts hands-free dictation.
        if (!isRecoverableRecognitionError(code)) {
          wantedRef.current = false;
        }
      };

      rec.onend = () => {
        recognitionRef.current = null;
        if (stopRequestedRef.current) {
          flushStoppedInterim();
        } else {
          interimRef.current = '';
          setInterim('');
        }
        stopRequestedRef.current = false;
        setStopping(false);

        if (wantedRef.current && start()) {
          return;
        }

        wantedRef.current = false;
        setListening(false);
        setActive(false);
      };

      recognitionRef.current = rec;
      wantedRef.current = true;
      rec.start();
      setListening(true);
      setActive(true);
      setStopping(false);
      return true;
    } catch {
      setError('start-failed');
      wantedRef.current = false;
      stopRequestedRef.current = false;
      recognitionRef.current = null;
      setListening(false);
      setActive(false);
      setStopping(false);
      return false;
    }
  }, [ctor, flushStoppedInterim, lang]);

  // Never leave the microphone open past unmount.
  useEffect(() => () => {
    wantedRef.current = false;
    stopRequestedRef.current = false;
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    if (rec) {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.stop();
    }
  }, []);

  return { supported, active, listening, stopping, interim, error, start, stop };
}
