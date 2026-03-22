import React from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { PHOENIX_RED } from '../theme';

/**
 * SplashScreen - Login page with dark theme, red glow, and Microsoft SSO button.
 *
 * Props:
 *   inProgress  - MSAL interaction status
 *   isLoading   - Whether a login attempt is in progress
 *   onLogin     - Handler for the sign-in button click
 */
const SplashScreen = ({ inProgress, isLoading, onLogin }) => (
  <div style={{
    width: '100vw',
    height: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, system-ui, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Red glow background effect */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '120vmin',
      height: '120vmin',
      background: 'radial-gradient(circle, rgba(255,100,100,0.15) 0%, rgba(255,50,50,0.08) 30%, rgba(200,20,20,0.03) 50%, transparent 70%)',
      filter: 'blur(40px)',
      pointerEvents: 'none'
    }} />

    {/* Background Phoenix watermark */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vmin',
      height: '80vmin',
      opacity: 0.08,
      pointerEvents: 'none'
    }}>
      <img
        src="/phoenix-logo.png"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 60px rgba(255,50,50,0.5))'
        }}
        onError={(e) => e.target.style.display = 'none'}
      />
    </div>

    {/* Main content card - glass effect */}
    <div style={{
      background: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,100,100,0.2)',
      borderRadius: '24px',
      padding: '60px 50px',
      maxWidth: '440px',
      width: '90%',
      position: 'relative',
      boxShadow: 'inset 0 0 30px rgba(255,50,50,0.05), 0 20px 60px rgba(0,0,0,0.5)',
      zIndex: 10
    }}>
      {/* Top shine effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
        borderRadius: '24px 24px 0 0',
        pointerEvents: 'none'
      }} />

      {/* Phoenix Logo */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <img
          src="/phoenix-logo.png"
          alt="Phoenix Electric"
          style={{
            width: '160px',
            height: 'auto',
            marginBottom: '24px',
            filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.4)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{
          fontSize: '80px',
          marginBottom: '24px',
          filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.6))',
          display: 'none'
        }}>🔥</div>

        <h1 style={{
          color: '#FFFFFF',
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 6px 0',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontFamily: 'Cinzel, Georgia, serif'
        }}>
          PHOENIX
        </h1>

        <div style={{
          color: '#D4AF37',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '6px',
          marginBottom: '12px',
          textTransform: 'uppercase'
        }}>
          ELECTRIC
        </div>

        <div style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '2px',
          marginBottom: '40px',
          textTransform: 'uppercase'
        }}>
          Command Center
        </div>

        {inProgress === InteractionStatus.None ? (
          <button
            onClick={onLogin}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(180deg, rgba(255,26,26,0.95) 0%, rgba(200,20,20,0.9) 100%)',
              border: '1px solid rgba(255,100,100,0.3)',
              color: '#FFFFFF',
              padding: '16px 48px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: isLoading ? 'wait' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(255,26,26,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(255,26,26,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(255,26,26,0.3), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>
        ) : (
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Loading...
          </div>
        )}
      </div>
    </div>

    {/* Bottom accent line */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, transparent 0%, ${PHOENIX_RED} 30%, ${PHOENIX_RED} 70%, transparent 100%)`,
      boxShadow: `0 0 20px rgba(255,26,26,0.5)`
    }} />
  </div>
);

export default SplashScreen;

