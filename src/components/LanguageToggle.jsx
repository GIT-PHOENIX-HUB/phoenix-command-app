import React, { useContext } from 'react';
import { LanguageContext } from '../i18n/LanguageContext';

const LanguageToggle = () => {
  const { t, lang, setLang } = useContext(LanguageContext);

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      style={{
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: 'rgba(255,255,255,0.9)',
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
        e.currentTarget.style.color = '#FFFFFF';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
        e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
      }}
    >
      {t('lang.toggle')}
    </button>
  );
};

export default LanguageToggle;
