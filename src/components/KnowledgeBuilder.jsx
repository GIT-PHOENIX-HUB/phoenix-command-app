import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Eye, EyeOff, ExternalLink, Calendar, Tag } from 'lucide-react';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import { colors, gradients, shadows, spacing, borderRadius, touchTarget } from '../theme/tokens';
import { fetchDailyHuddle, fetchStats } from '../api/knowledge-builder-api';

/**
 * KnowledgeBuilder — Daily NEC teaching system for Phoenix Electric.
 *
 * Props:
 *   token - Bearer access token for API calls
 */
const KnowledgeBuilder = ({ token }) => {
  const [dailyHuddle, setDailyHuddle] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [data, statsData] = await Promise.all([
          fetchDailyHuddle(token || ''),
          fetchStats(token || ''),
        ]);
        setDailyHuddle(data);
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Failed to load daily huddle');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [token]);

  const toggleAnswer = (id) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // ── Shared sub-components ────────────────────────────────────────────────

  const TopicBadge = ({ tag }) => (
    <span style={{
      background: colors.accent,
      color: '#1a1a1a',
      fontSize: '11px',
      fontWeight: '700',
      padding: '3px 10px',
      borderRadius: `${borderRadius.pill}px`,
      letterSpacing: '0.5px',
    }}>
      {tag}
    </span>
  );

  const NecBadge = ({ citation }) => (
    <span style={{
      background: 'transparent',
      border: '1px solid rgba(255,100,100,0.3)',
      color: 'rgba(255,160,160,0.9)',
      fontSize: '11px',
      fontWeight: '600',
      padding: '2px 8px',
      borderRadius: `${borderRadius.pill}px`,
      letterSpacing: '0.5px',
    }}>
      {citation}
    </span>
  );

  const ImageArea = ({ images, title }) => (
    <div style={{
      width: '100%',
      paddingTop: '56.25%', // 16:9
      position: 'relative',
      borderRadius: `${borderRadius.lg}px`,
      overflow: 'hidden',
      marginBottom: `${spacing.md}px`,
      background: 'rgba(0,0,0,0.4)',
      border: `1px solid ${colors.borderWhiteLight}`,
    }}>
      {images && images.length > 0 ? (
        <img
          src={images[0]}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${spacing.sm}px`,
          color: colors.textSecondary,
        }}>
          <BookOpen size={32} color={colors.accent} />
          <span style={{ fontSize: '12px', letterSpacing: '1px' }}>NEC REFERENCE</span>
        </div>
      )}
    </div>
  );

  const KnowledgeCard = ({ item, isBackup = false }) => {
    const revealed = revealedAnswers.has(item.id);
    return (
      <div style={{ ...glassCard, marginBottom: '20px' }}>
        {/* Backup label */}
        {isBackup && (
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            color: colors.accent,
            letterSpacing: '2px',
            marginBottom: `${spacing.sm}px`,
            textTransform: 'uppercase',
          }}>
            BACKUP / ADDITIONAL
          </div>
        )}

        {/* Topic badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: `${spacing.sm}px` }}>
          {item.topicTags.map((tag) => <TopicBadge key={tag} tag={tag} />)}
        </div>

        {/* Title + source */}
        <div style={{ marginBottom: `${spacing.sm}px` }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: colors.text, marginBottom: '4px' }}>
            {item.title}
          </div>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
          >
            {item.source}
            <ExternalLink size={12} />
          </a>
        </div>

        {/* NEC citation badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: `${spacing.md}px` }}>
          {item.necCitations.map((c) => <NecBadge key={c} citation={c} />)}
        </div>

        {/* Image area */}
        <ImageArea images={item.images} title={item.title} />

        {/* Question */}
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: colors.text,
          lineHeight: '1.6',
          marginBottom: `${spacing.md}px`,
        }}>
          {item.question}
        </div>

        {/* Reveal button */}
        <button
          onClick={() => toggleAnswer(item.id)}
          style={{
            width: '100%',
            padding: '14px',
            background: gradients.goldButton,
            color: '#1a1a1a',
            border: 'none',
            borderRadius: `${borderRadius.lg}px`,
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${spacing.sm}px`,
            boxShadow: shadows.goldButton,
            minHeight: `${touchTarget.minHeight}px`,
            marginBottom: revealed ? `${spacing.md}px` : 0,
          }}
        >
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          {revealed ? 'HIDE ANSWER' : 'TAP TO REVEAL ANSWER'}
        </button>

        {/* Answer reveal section */}
        {revealed && (
          <div style={{
            background: 'rgba(0,201,167,0.1)',
            border: '1px solid rgba(0,201,167,0.2)',
            borderRadius: `${borderRadius.lg}px`,
            padding: `${spacing.md}px`,
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: colors.success,
              marginBottom: `${spacing.sm}px`,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Correct Answer
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: `${spacing.md}px` }}>
              {item.correctAnswer}
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: colors.textSecondary,
              marginBottom: `${spacing.sm}px`,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Explanation
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: `${spacing.md}px` }}>
              {item.explanation}
            </div>

            {item.fieldNote && (
              <>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: `${spacing.sm}px`,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  🔧 Field Note
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                  {item.fieldNote}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div style={{ ...screenContainer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: colors.textSecondary }}>
          <BookOpen size={40} color={colors.accent} />
          <div style={{ marginTop: `${spacing.md}px`, fontSize: '14px', letterSpacing: '2px' }}>LOADING TODAY'S CONTENT...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={screenContainer}>
        <div style={redGlowOverlay} />
        <h2 style={screenTitle}>KNOWLEDGE BUILDER</h2>
        <div style={{ ...glassCard, textAlign: 'center', color: colors.textSecondary }}>
          <div style={{ fontSize: '14px' }}>Unable to load content: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={screenContainer}>
      <div style={redGlowOverlay} />

      <h2 style={screenTitle}>KNOWLEDGE BUILDER</h2>

      {/* Week theme bar */}
      {dailyHuddle?.weekTheme && (
        <div style={{
          ...glassCard,
          background: 'rgba(212,175,55,0.08)',
          border: `1px solid ${colors.borderGold}`,
          display: 'flex',
          alignItems: 'center',
          gap: `${spacing.sm}px`,
          padding: `${spacing.md}px`,
          marginBottom: '20px',
        }}>
          <Calendar size={16} color={colors.accent} />
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Week Theme
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: colors.accent }}>
              {dailyHuddle.weekTheme}
            </div>
          </div>
        </div>
      )}

      {/* Daily items */}
      {dailyHuddle?.items?.map((item) => (
        <KnowledgeCard key={item.id} item={item} />
      ))}

      {/* Backup item */}
      {dailyHuddle?.backup && (
        <KnowledgeCard item={dailyHuddle.backup} isBackup />
      )}

      {/* Teaser topic */}
      {dailyHuddle?.teaserTopic && (
        <div style={{
          ...glassCard,
          display: 'flex',
          alignItems: 'center',
          gap: `${spacing.sm}px`,
          padding: `${spacing.md}px`,
          marginBottom: '20px',
        }}>
          <Tag size={16} color={colors.textSecondary} />
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Coming Up Next
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>
              {dailyHuddle.teaserTopic}
            </div>
          </div>
        </div>
      )}

      {/* Archive button */}
      <button
        style={{
          width: '100%',
          padding: '14px',
          background: gradients.goldButton,
          color: '#1a1a1a',
          border: 'none',
          borderRadius: `${borderRadius.lg}px`,
          fontSize: '14px',
          fontWeight: '700',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${spacing.sm}px`,
          boxShadow: shadows.goldButton,
          minHeight: `${touchTarget.minHeight}px`,
          marginBottom: '20px',
        }}
      >
        <Search size={18} />
        VIEW ARCHIVE
      </button>

      {/* Stats footer */}
      <div style={{ ...glassCard, marginBottom: 0 }}>
        <h3 style={sectionHeader}>
          <BookOpen size={18} color={colors.accent} />
          KNOWLEDGE STATS
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Total items</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: colors.text }}>
              {stats?.totalItems ?? '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Last collection</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: colors.accent }}>
              {stats?.lastCollectionDate ?? dailyHuddle?.date ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBuilder;
