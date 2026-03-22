import React from 'react';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme';

/**
 * TeamsScreen - Teams quick actions and OneNote integration.
 * Currently static — no dynamic props needed yet.
 */
const TeamsScreen = () => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />

    <h2 style={screenTitle}>TEAMS & COMMUNICATION</h2>

    {/* Quick Actions */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>💬</span>
        QUICK ACTIONS
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: '💬', label: 'Open Teams Messages' },
          { icon: '📢', label: 'View Channels' },
          { icon: '📹', label: 'Start Video Call' }
        ].map((action, idx) => (
          <button
            key={idx}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,100,100,0.2)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              color: '#FFFFFF'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,26,26,0.8) 0%, rgba(200,20,20,0.9) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.2)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>

    {/* OneNote */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📝</span>
        ONENOTE
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: '💾', label: 'Save to OneNote' },
          { icon: '📔', label: 'View My Notebooks' }
        ].map((action, idx) => (
          <button
            key={idx}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              color: '#FFFFFF'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(184,150,11,0.4) 100%)';
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default TeamsScreen;

