// ============================================================================
// PHOENIX COMMAND - Shared Theme Constants
// Extracted from App.jsx to ensure visual consistency across all components
// ============================================================================

export const PHOENIX_RED = '#FF1A1A';
export const PHOENIX_GOLD = '#D4AF37';
export const PHOENIX_BLACK = '#0a0a0a';

// Common glass card style used across Dashboard, Files, Teams, DailyLog screens
export const glassCard = {
  background: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,100,100,0.15)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '20px',
  boxShadow: 'inset 0 0 20px rgba(255,50,50,0.03), 0 8px 32px rgba(0,0,0,0.3)',
  position: 'relative',
  zIndex: 1,
};

// Red gradient button (primary action)
export const primaryButton = {
  background: 'linear-gradient(180deg, rgba(255,26,26,0.95) 0%, rgba(200,20,20,0.9) 100%)',
  border: 'none',
  color: '#FFFFFF',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 20px rgba(255,26,26,0.3)',
};

// Gold gradient button (secondary action, e.g. "Log New Work")
export const goldButton = {
  background: 'linear-gradient(135deg, #D4AF37, #B8960B)',
  color: '#1a1a1a',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
};

// Common text input style
export const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  fontSize: '13px',
  outline: 'none',
  color: '#FFFFFF',
};

// Screen container shared by all inner screens (everything except splash)
export const screenContainer = {
  background: PHOENIX_BLACK,
  minHeight: 'calc(100vh - 160px)',
  padding: '32px 24px',
  position: 'relative',
};

// Subtle red glow background overlay used in most screens
export const redGlowOverlay = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '80%',
  height: '60%',
  background: 'radial-gradient(ellipse, rgba(255,50,50,0.08) 0%, transparent 70%)',
  pointerEvents: 'none',
};

// Screen title style (e.g. "DASHBOARD", "FILES & DOCUMENTS")
export const screenTitle = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '24px',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontFamily: 'Cinzel, Georgia, serif',
  position: 'relative',
  zIndex: 1,
};

// Section header inside glass cards
export const sectionHeader = {
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#FFFFFF',
  letterSpacing: '1px',
};

// Label style for form fields
export const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  marginBottom: '8px',
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

