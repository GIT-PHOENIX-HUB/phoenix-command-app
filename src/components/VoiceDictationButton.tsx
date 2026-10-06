import React, { useContext, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { LanguageContext } from '../i18n/LanguageContext';
import { useVoiceDictation } from '../hooks/useVoiceDictation';

interface VoiceDictationButtonProps {
  /** Receives each final transcript chunk — append to the bound field's state. */
  onText: (text: string) => void;
  /** Locks this microphone while the other field or form submission is active. */
  disabled?: boolean;
  /** Reports the whole recognition lifecycle, including stop/finalization settling. */
  onActiveChange?: (active: boolean) => void;
}

/**
 * Mic toggle for dictating into a textarea (Shane's ruling: techs can speak
 * their end-of-day log). Renders three honest states: ready, listening
 * (pulsing + live interim preview), unsupported/denied (disabled + reason).
 */
const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onText,
  disabled = false,
  onActiveChange,
}) => {
  const { t, lang } = useContext(LanguageContext);
  const { supported, active, listening, stopping, interim, error, start, stop } = useVoiceDictation(lang, onText);

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  if (!supported) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
        <MicOff size={14} /> {t('log.voiceUnsupported')}
      </span>
    );
  }

  const denied = error === 'denied';
  const failed = error !== null && error !== 'denied' && error !== 'no-speech';
  const controlDisabled = disabled || stopping;

  const toggle = () => {
    if (controlDisabled) return;
    if (listening) {
      stop();
      return;
    }
    if (start()) onActiveChange?.(true);
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={toggle}
        disabled={controlDisabled}
        aria-pressed={active}
        aria-busy={stopping}
        aria-label={stopping ? t('log.voiceFinishing') : listening ? t('log.voiceStop') : t('log.voiceDictate')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: listening ? '#fff' : 'rgba(255,255,255,0.75)',
          background: listening ? 'rgba(220,38,38,0.85)' : 'rgba(255,255,255,0.06)',
          border: listening ? '1px solid rgba(248,113,113,0.9)' : '1px solid rgba(255,255,255,0.18)',
          borderRadius: '999px',
          cursor: controlDisabled ? 'not-allowed' : 'pointer',
          opacity: controlDisabled ? 0.55 : 1,
          transition: 'all 0.2s ease',
          animation: listening ? 'phoenixMicPulse 1.2s ease-in-out infinite' : 'none',
        }}
      >
        <Mic size={14} />
        {stopping ? t('log.voiceFinishing') : listening ? t('log.voiceStop') : t('log.voiceDictate')}
      </button>
      {listening && interim && (
        <span style={{ fontSize: '11px', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>
          {interim}
        </span>
      )}
      {denied && (
        <span style={{ fontSize: '11px', color: 'rgba(248,113,113,0.9)' }}>{t('log.voiceDenied')}</span>
      )}
      {failed && (
        <span style={{ fontSize: '11px', color: 'rgba(248,113,113,0.9)' }}>{t('log.voiceError')}</span>
      )}
      <style>{`@keyframes phoenixMicPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.45); } 50% { box-shadow: 0 0 0 7px rgba(220,38,38,0); } }`}</style>
    </span>
  );
};

export default VoiceDictationButton;
