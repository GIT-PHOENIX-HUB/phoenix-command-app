import React from 'react';
import { BookOpen, Clock, FileText, Users } from 'lucide-react';

/**
 * TopMenu - Persistent red header with logo, user info, and nav buttons.
 *
 * Props:
 *   userName       - Display name of the authenticated user
 *   currentScreen  - Currently active screen id
 *   onNavigate     - (screenId) => void
 *   onLogout       - Handler for logout button
 */
const TopMenu = ({ userName, currentScreen, onNavigate, onLogout }) => (
  <div style={{
    background: 'linear-gradient(180deg, rgba(255,26,26,0.98) 0%, rgba(200,20,20,0.95) 100%)',
    padding: '16px 24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    position: 'relative'
  }}>
    {/* Black accent line under header */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: '#000000',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
    }} />

    {/* Logo and Company Name */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/phoenix-logo.png"
          alt="Phoenix"
          style={{
            width: '40px',
            height: 'auto',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'inline';
          }}
        />
        <span style={{ fontSize: '32px', display: 'none' }}>🔥</span>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#FFFFFF',
            letterSpacing: '2px',
            fontFamily: 'Cinzel, Georgia, serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            PHOENIX OPS
          </div>
          <div style={{
            fontSize: '11px',
            color: '#D4AF37',
            letterSpacing: '1px'
          }}>
            Command Center
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.9)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #D4AF37, #B8960B)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          color: '#1a1a1a',
          fontSize: '12px'
        }}>
          {userName ? userName.split(' ').map(n => n[0]).join('') : 'U'}
        </div>
        <span style={{ fontWeight: '500' }}>{userName}</span>
        <button
          onClick={onLogout}
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
          Logout
        </button>
      </div>
    </div>

    {/* Menu Buttons */}
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    }}>
      {[
        { id: 'dashboard', label: 'HOME', icon: null },
        { id: 'knowledgebuilder', label: 'KNOWLEDGE', icon: BookOpen },
        { id: 'files', label: 'FILES', icon: FileText },
        { id: 'teams', label: 'TEAMS', icon: Users },
        { id: 'timeclock', label: 'TIME CLOCK', icon: Clock }
      ].map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          style={{
            background: currentScreen === id ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            if (currentScreen !== id) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }
          }}
          onMouseOut={(e) => {
            if (currentScreen !== id) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
        >
          {Icon && <Icon size={16} />}
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default TopMenu;

