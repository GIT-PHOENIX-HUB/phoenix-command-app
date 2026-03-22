import React from 'react';
import { MAX_QUERY_LENGTH } from '../api/phoenix-api';

/**
 * ChatWidget - Floating AI chat button that expands to a chat panel.
 *
 * Props:
 *   showChatWidget    - Boolean visibility state
 *   onToggle          - () => void — toggles visibility
 *   chatMessages      - Array of { role: 'ai'|'user', content: string }
 *   chatInput         - Current input value
 *   onInputChange     - (value) => void
 *   onSend            - () => void
 */
const ChatWidget = ({ showChatWidget, onToggle, chatMessages, chatInput, onInputChange, onSend }) => (
  <>
    {!showChatWidget ? (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,26,26,0.9) 0%, rgba(200,20,20,0.95) 100%)',
          border: '2px solid rgba(212,175,55,0.5)',
          color: '#D4AF37',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255,26,26,0.4), 0 0 40px rgba(255,26,26,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,26,26,0.5), 0 0 60px rgba(255,26,26,0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,26,26,0.4), 0 0 40px rgba(255,26,26,0.2)';
        }}
      >
        🤖
      </button>
    ) : (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        height: '500px',
        background: 'linear-gradient(165deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.99) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 60px rgba(255,26,26,0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        border: '1px solid rgba(255,100,100,0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(255,26,26,0.95) 0%, rgba(200,20,20,0.9) 100%)',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #000000'
        }}>
          <div style={{
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.5px'
          }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            Phoenix AI Assistant
          </div>
          <button
            onClick={onToggle}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(0,0,0,0.3)'
        }}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{
              background: msg.role === 'ai'
                ? 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(255,26,26,0.8) 0%, rgba(200,20,20,0.9) 100%)',
              color: '#FFFFFF',
              padding: '12px 14px',
              borderRadius: msg.role === 'ai' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
              fontSize: '13px',
              lineHeight: '1.5',
              alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
              maxWidth: '85%',
              border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,100,100,0.3)',
              boxShadow: msg.role === 'ai' ? 'none' : '0 2px 8px rgba(255,26,26,0.2)'
            }}>
              {msg.role === 'ai' && <span style={{ color: '#D4AF37', fontWeight: '600' }}>AI: </span>}
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend()}
              placeholder="Ask me anything..."
              maxLength={MAX_QUERY_LENGTH}
              style={{
                flex: 1,
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                color: '#FFFFFF'
              }}
            />
            <button
              onClick={onSend}
              style={{
                background: 'linear-gradient(180deg, rgba(255,26,26,0.95) 0%, rgba(200,20,20,0.9) 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Send
            </button>
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '11px',
            color: chatInput.length > MAX_QUERY_LENGTH * 0.9 ? '#ff6b6b' : 'rgba(255,255,255,0.35)',
            marginTop: '4px',
            paddingRight: '4px'
          }}>
            {chatInput.length}/{MAX_QUERY_LENGTH}
          </div>
        </div>
      </div>
    )}
  </>
);

export default ChatWidget;

