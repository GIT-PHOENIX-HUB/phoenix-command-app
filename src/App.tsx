import React, { useState, useEffect } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { useAuth } from './hooks/useAuth';
import { clockInOut, submitDailyLog, askPhoenixAI, getCurrentLocation } from './api/phoenix-api';
import { colors, typography } from './theme/tokens';
import { LanguageProvider } from './i18n/LanguageContext';

// Layout
import Header from './components/layout/Header';

// Screens
import SplashScreen from './screens/SplashScreen';
import DashboardScreen from './screens/DashboardScreen';
import TimeClockScreen from './screens/TimeClockScreen';
import FilesScreen from './screens/FilesScreen';
import TeamsScreen from './screens/TeamsScreen';
import DailyLogScreen from './screens/DailyLogScreen';

// Chat
import ChatWidget from './components/chat/ChatWidget';

// Types
import type { Screen, ChatMessage, DailyLogFormData } from './types';

// ============================================================================
// PHOENIX COMMAND APP - Component Architecture
// Built for: Shane Warehime, Phoenix Electric
// Refactored: February 2026 — TypeScript + component extraction
// All state management and auth logic remains here in App.tsx
// ============================================================================

const PhoenixCommandApp: React.FC = () => {
  const {
    inProgress,
    isAuthenticated,
    userName: authUserName,
    handleLogin,
    handleLogout,
    getApiToken,
  } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<Date | null>(null);
  const [todayHours, setTodayHours] = useState(0);
  const [weekHours, setWeekHours] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hi! I can help you with job status, customer info, time tracking, finding files in SharePoint, and Service Fusion data." },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [userName, setUserName] = useState('');
  const [jobsThisWeek, setJobsThisWeek] = useState(0);
  const [logsSubmitted, setLogsSubmitted] = useState(0);
  const [customers, setCustomers] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  const [jobFiles, setJobFiles] = useState<{ name: string; type: string; items?: string; size?: string }[]>([]);
  const [sharepointFolders, setSharepointFolders] = useState<string[]>([]);

  // Get user info when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setUserName(authUserName);
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, authUserName]);

  // Handle login with loading state
  const onLogin = async () => {
    try {
      setIsLoading(true);
      await handleLogin();
    } finally {
      setIsLoading(false);
    }
  };

  // Clock in/out handler
  const handleClockToggle = async () => {
    try {
      setIsLoading(true);
      const location = await getCurrentLocation();
      const token = await getApiToken();
      const action = clockedIn ? 'clock_out' : 'clock_in';

      await clockInOut({ action, location, token });

      if (!clockedIn) {
        setClockedIn(true);
        setClockTime(new Date());
      } else {
        setClockedIn(false);
        setClockTime(null);
      }
    } catch (error) {
      console.error('Clock toggle failed:', error);
      alert(`Clock ${clockedIn ? 'out' : 'in'} failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Chat message send handler
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const token = await getApiToken();
      const response = await askPhoenixAI(userMessage, ['knowledge_keeper', 'servicefusion'], token);
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: response.result || response.message || 'I received your message but had trouble processing it.',
      }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: `Sorry, I couldn't process that: ${(error as Error).message}`,
      }]);
    }
  };

  // Daily log submit handler — sends full paper-form contract
  const handleSubmitLog = async (logData: DailyLogFormData) => {
    const token = await getApiToken();
    await submitDailyLog({
      date: logData.date,
      technicianName: logData.technicianName,
      jobAddress: logData.jobAddress,
      phase: logData.phase,
      completedWork: logData.completedWork,
      incompleteWork: logData.incompleteWork,
      notes: logData.notes,
      materialNeeded: logData.materialNeeded,
      techSignature: logData.techSignature,
      leadSignature: logData.leadSignature,
      photos: logData.photos,
    }, token);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // MSAL loading state
  if (inProgress !== InteractionStatus.None) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: typography.fontDisplay,
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,26,26,0.2)',
            borderTopColor: colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />
          <div style={{ fontSize: '24px', letterSpacing: '3px' }}>PHOENIX</div>
          <div style={{ fontSize: '12px', color: colors.accent, marginTop: '8px', letterSpacing: '2px' }}>AUTHENTICATING...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated || currentScreen === 'splash') {
    return (
      <SplashScreen
        inProgress={inProgress}
        isLoading={isLoading}
        onLogin={onLogin}
      />
    );
  }

  return (
    <LanguageProvider>
    <div style={{ fontFamily: typography.fontPrimary }}>
      <Header
        userName={userName}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLogout={handleLogout}
      />

      {currentScreen === 'dashboard' && (
        <DashboardScreen
          clockedIn={clockedIn}
          clockTime={clockTime}
          todayHours={todayHours}
          weekHours={weekHours}
          jobsThisWeek={jobsThisWeek}
          logsSubmitted={logsSubmitted}
          isLoading={isLoading}
          onClockToggle={handleClockToggle}
          onNavigate={setCurrentScreen}
        />
      )}
      {currentScreen === 'timeclock' && (
        <TimeClockScreen weekHours={weekHours} />
      )}
      {currentScreen === 'files' && (
        <FilesScreen
          jobFiles={jobFiles}
          sharepointFolders={sharepointFolders}
        />
      )}
      {currentScreen === 'teams' && <TeamsScreen />}
      {currentScreen === 'dailylog' && (
        <DailyLogScreen
          userName={userName}
          onSubmit={handleSubmitLog}
          onNavigate={setCurrentScreen}
        />
      )}

      <ChatWidget
        showChatWidget={showChatWidget}
        onToggle={() => setShowChatWidget(prev => !prev)}
        chatMessages={chatMessages}
        chatInput={chatInput}
        onInputChange={setChatInput}
        onSend={handleChatSend}
      />
    </div>
    </LanguageProvider>
  );
};

export default PhoenixCommandApp;

