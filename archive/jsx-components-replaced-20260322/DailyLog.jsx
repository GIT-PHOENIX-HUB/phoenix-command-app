import React, { useState, useContext } from 'react';
import { glassCard, inputStyle, screenContainer, redGlowOverlay, screenTitle, sectionHeader, labelStyle, primaryButton } from '../theme';
import { LanguageContext } from '../i18n/LanguageContext';

/**
 * DailyLog - Paper-form style daily work log.
 *
 * Props:
 *   userName    - Authenticated user's display name (auto-filled)
 *   onSubmit    - (logData) => Promise<void>
 *   onNavigate  - (screenId) => void
 */
const createEmptyRow = () => ({ taskItem: '', qty: 0, estTime: '', description: '' });

const WorkTable = ({ rows, onRowChange, onAddRow, t }) => (
  <div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 1fr 60px 80px 1fr',
      gap: '6px',
      marginBottom: '6px'
    }}>
      <div style={{ ...labelStyle, textAlign: 'center' }}>#</div>
      <div style={labelStyle}>{t('log.taskItem')}</div>
      <div style={labelStyle}>{t('log.qty')}</div>
      <div style={labelStyle}>{t('log.estTime')}</div>
      <div style={labelStyle}>{t('log.description')}</div>
    </div>
    {rows.map((row, i) => (
      <div key={i} style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr 60px 80px 1fr',
        gap: '6px',
        marginBottom: '6px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: '600'
        }}>{i + 1}</div>
        <input
          type="text"
          value={row.taskItem}
          onChange={(e) => onRowChange(i, 'taskItem', e.target.value)}
          style={{ ...inputStyle, padding: '8px 10px', fontSize: '12px' }}
        />
        <input
          type="number"
          value={row.qty}
          onChange={(e) => onRowChange(i, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
          style={{ ...inputStyle, padding: '8px 10px', fontSize: '12px' }}
          min="0"
        />
        <input
          type="text"
          value={row.estTime}
          onChange={(e) => onRowChange(i, 'estTime', e.target.value)}
          style={{ ...inputStyle, padding: '8px 10px', fontSize: '12px' }}
          placeholder={t('log.estTimePlaceholder')}
        />
        <input
          type="text"
          value={row.description}
          onChange={(e) => onRowChange(i, 'description', e.target.value)}
          style={{ ...inputStyle, padding: '8px 10px', fontSize: '12px' }}
        />
      </div>
    ))}
    <button
      onClick={onAddRow}
      style={{
        marginTop: '8px',
        padding: '8px 16px',
        background: 'rgba(212,175,55,0.15)',
        border: '1px solid rgba(212,175,55,0.4)',
        borderRadius: '6px',
        color: '#D4AF37',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '0.5px'
      }}
    >
      + {t('log.addRow')}
    </button>
  </div>
);

const DailyLog = ({ userName = '', onSubmit, onNavigate }) => {
  const { t } = useContext(LanguageContext);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const [jobAddress, setJobAddress] = useState('');
  const [phase, setPhase] = useState('rough-in');
  const [completedWork, setCompletedWork] = useState(Array.from({ length: 5 }, createEmptyRow));
  const [incompleteWork, setIncompleteWork] = useState(Array.from({ length: 2 }, createEmptyRow));
  const [notes, setNotes] = useState('');
  const [materialNeeded, setMaterialNeeded] = useState('');
  const [techSigned, setTechSigned] = useState(false);
  const [leadSigned, setLeadSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateRow = (setter) => (index, field, value) => {
    setter(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleSubmitLog = async () => {
    if (!techSigned || !leadSigned) {
      alert(t('log.signaturesRequired'));
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit({
        date: today,
        technicianName: userName,
        jobAddress,
        phase,
        completedWork,
        incompleteWork,
        notes,
        materialNeeded,
        techSignature: techSigned ? 'signed' : '',
        leadSignature: leadSigned ? 'signed' : '',
        photos: []
      });
      alert(t('log.submit') + ' ✓');
      onNavigate('dashboard');
    } catch (error) {
      console.error('Submit failed:', error);
      alert(`Submit failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const phaseButtonStyle = (isActive) => ({
    flex: 1,
    padding: '10px',
    background: isActive ? 'linear-gradient(135deg, #D4AF37, #B8960B)' : 'rgba(255,255,255,0.05)',
    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: isActive ? '#1a1a1a' : 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  });

  return (
    <div style={screenContainer}>
      <div style={redGlowOverlay} />

      <h2 style={{ ...screenTitle, marginBottom: '8px' }}>{t('log.title')}</h2>

      {/* Instructions */}
      <div style={{
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {[1,2,3,4,5,6,7,8].map(n => (
          <div key={n} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
            {n}. {t(`log.instructions.${n}`)}
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div style={glassCard}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>{t('log.techName')}</label>
            <input
              type="text"
              value={userName}
              readOnly
              style={{ ...inputStyle, color: 'rgba(255,255,255,0.5)', cursor: 'default' }}
            />
          </div>
          <div>
            <label style={labelStyle}>{t('log.date')}</label>
            <input
              type="text"
              value={today}
              readOnly
              style={{ ...inputStyle, color: 'rgba(255,255,255,0.5)', cursor: 'default' }}
            />
          </div>
          <div>
            <label style={labelStyle}>{t('log.jobAddress')}</label>
            <input
              type="text"
              value={jobAddress}
              onChange={(e) => setJobAddress(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t('log.phase')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={phaseButtonStyle(phase === 'rough-in')} onClick={() => setPhase('rough-in')}>
                {t('log.roughIn')}
              </button>
              <button style={phaseButtonStyle(phase === 'trim-out')} onClick={() => setPhase('trim-out')}>
                {t('log.trimOut')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Work Section */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <span style={{ fontSize: '18px' }}>✅</span>
          {t('log.completedWork')}
        </h3>
        <WorkTable
          rows={completedWork}
          onRowChange={updateRow(setCompletedWork)}
          onAddRow={() => setCompletedWork(prev => [...prev, createEmptyRow()])}
          t={t}
        />
      </div>

      {/* Incomplete Work Section */}
      <div style={{
        ...glassCard,
        background: 'linear-gradient(165deg, rgba(255,200,0,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,200,0,0.04) 100%)',
        border: '1px solid rgba(255,200,0,0.2)'
      }}>
        <h3 style={{ ...sectionHeader, color: '#FFD700' }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          {t('log.incompleteWork')}
        </h3>
        <WorkTable
          rows={incompleteWork}
          onRowChange={updateRow(setIncompleteWork)}
          onAddRow={() => setIncompleteWork(prev => [...prev, createEmptyRow()])}
          t={t}
        />
      </div>

      {/* Notes Section */}
      <div style={glassCard}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>{t('log.notes')}</label>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={labelStyle}>{t('log.materialNeeded')}</label>
            <textarea
              rows={5}
              value={materialNeeded}
              onChange={(e) => setMaterialNeeded(e.target.value)}
              style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      {/* Signatures Section */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <span style={{ fontSize: '18px' }}>✍️</span>
          {t('log.signatures')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>{t('log.techSignature')}</label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: techSigned ? '1px solid rgba(0,201,167,0.5)' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                checked={techSigned}
                onChange={(e) => setTechSigned(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: techSigned ? '#00C9A7' : 'rgba(255,255,255,0.5)' }}>
                {techSigned ? t('log.signed') : (userName || t('log.unsigned'))}
              </span>
            </label>
          </div>
          <div>
            <label style={labelStyle}>{t('log.leadSignature')}</label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: leadSigned ? '1px solid rgba(0,201,167,0.5)' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                checked={leadSigned}
                onChange={(e) => setLeadSigned(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: leadSigned ? '#00C9A7' : 'rgba(255,255,255,0.5)' }}>
                {leadSigned ? t('log.signed') : t('log.unsigned')}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitLog}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #D4AF37, #B8960B)',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '700',
          cursor: submitting ? 'wait' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          opacity: submitting ? 0.7 : 1,
          boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
          position: 'relative',
          zIndex: 1,
          marginBottom: '20px'
        }}
      >
        {submitting ? '...' : t('log.submit')}
      </button>
    </div>
  );
};

export default DailyLog;


