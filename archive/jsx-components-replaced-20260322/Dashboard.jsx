import React, { useContext } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme';
import { LanguageContext } from '../i18n/LanguageContext';

/**
 * Dashboard - Home screen with time status, today's work, and quick stats.
 *
 * Props:
 *   clockedIn       - Boolean clock status
 *   clockTime       - Date object when clocked in, or null
 *   todayHours      - Number of hours today
 *   weekHours       - Number of hours this week
 *   jobsThisWeek    - Count of jobs this week
 *   logsSubmitted   - Count of logs submitted
 *   isLoading       - Loading state for clock toggle
 *   onClockToggle   - Handler for clock in/out
 *   onNavigate      - (screenId) => void
 */
const Dashboard = ({
  clockedIn, clockTime, todayHours, weekHours,
  jobsThisWeek, logsSubmitted, isLoading,
  onClockToggle, onNavigate
}) => {
  const { t } = useContext(LanguageContext);
  return (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />

    <h2 style={screenTitle}>{t('dashboard.title')}</h2>

    {/* Time Status Card */}
    <div style={glassCard}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ ...sectionHeader, margin: 0 }}>
          <Clock size={18} color="#D4AF37" />
          {t('dashboard.timeStatus')}
        </h3>
        <span style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: clockedIn ? '#00C9A7' : 'rgba(255,255,255,0.3)',
          boxShadow: clockedIn ? '0 0 12px rgba(0,201,167,0.6)' : 'none'
        }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
          {clockedIn ? t('dashboard.clockedIn') : t('dashboard.status')}
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
          {clockedIn ? (clockTime ? clockTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--') : t('dashboard.clockedOut')}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('dashboard.today')}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
            {todayHours}h
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('dashboard.thisWeek')}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
            {weekHours}h
          </div>
        </div>
      </div>

      <button
        onClick={onClockToggle}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px',
          background: clockedIn
            ? 'linear-gradient(180deg, rgba(220,20,60,0.9) 0%, rgba(180,20,50,0.95) 100%)'
            : 'linear-gradient(180deg, rgba(0,201,167,0.9) 0%, rgba(0,168,143,0.95) 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '700',
          cursor: isLoading ? 'wait' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          opacity: isLoading ? 0.7 : 1,
          boxShadow: clockedIn ? '0 4px 20px rgba(220,20,60,0.3)' : '0 4px 20px rgba(0,201,167,0.3)'
        }}
      >
        {isLoading ? t('dashboard.processing') : (clockedIn ? t('dashboard.clockOut') : t('dashboard.clockIn'))}
      </button>
    </div>

    {/* Today's Work Card */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📝</span>
        {t('dashboard.todaysWork')}
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
          {t('dashboard.noActivity')}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>
          {t('dashboard.noJobs')}
        </div>
        <div style={{ fontSize: '13px', color: '#D4AF37' }}>
          {t('dashboard.clockInToStart')}
        </div>
      </div>

      <button
        onClick={() => onNavigate('dailylog')}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #D4AF37, #B8960B)',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '700',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
        }}
      >
        {t('dashboard.logNewWork')}
        <ChevronRight size={18} />
      </button>
    </div>

    {/* Quick Stats Card */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📊</span>
        {t('dashboard.quickStats')}
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{t('dashboard.jobsThisWeek')}</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>{jobsThisWeek}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{t('dashboard.logsSubmitted')}</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>{logsSubmitted}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{t('dashboard.nextJob')}</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#FF1A1A' }}>
            {t('dashboard.noRecentSite')}
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;

