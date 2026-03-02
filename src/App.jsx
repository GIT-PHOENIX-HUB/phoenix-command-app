import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest, apiRequest } from './auth/msalConfig';
import { clockInOut, submitDailyLog, askPhoenixAI, getCurrentLocation } from './api/phoenix-api';
import { LanguageProvider } from './i18n/LanguageContext';

// Components
import SplashScreen from './components/SplashScreen';
import TopMenu from './components/TopMenu';
import Dashboard from './components/Dashboard';
import TimeClock from './components/TimeClock';
import FilesScreen from './components/FilesScreen';
import TeamsScreen from './components/TeamsScreen';
import DailyLog from './components/DailyLog';
import ChatWidget from './components/ChatWidget';

// ============================================================================
// PHOENIX COMMAND APP - Component Architecture
// Built for: Shane Warehime, Phoenix Electric
// Refactored: February 2026 — extracted inline screens to components
// All state management and auth logic remains here in App.jsx
// ============================================================================

const PhoenixCommandApp = () => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [currentScreen, setCurrentScreen] = useState('splash');
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);
  const [todayHours, setTodayHours] = useState(0);
  const [weekHours, setWeekHours] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hi! I can help you with job status, customer info, time tracking, finding files in SharePoint, and Service Fusion data." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [userName, setUserName] = useState('');
  const [jobsThisWeek, setJobsThisWeek] = useState(0);
  const [logsSubmitted, setLogsSubmitted] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobFiles, setJobFiles] = useState([]);
  const [sharepointFolders, setSharepointFolders] = useState([]);

  // Get user info when authenticated
  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      const account = accounts[0];
      setUserName(account.name || account.username || 'User');
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, accounts]);

  // Handle Microsoft login
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      if (error.errorCode === 'popup_window_error') {
        await instance.loginRedirect(loginRequest);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    instance.logoutPopup();
  };

  // Acquire access token for Phoenix API scopes
  const getApiToken = async () => {
    const account = accounts[0];
    if (!account) {
      throw new Error('No authenticated account found');
    }

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...apiRequest,
        account,
      });
      return tokenResponse.accessToken;
    } catch (error) {
      const needsInteraction = error instanceof InteractionRequiredAuthError
        || error?.errorCode === 'interaction_required'
        || error?.errorCode === 'consent_required';

      if (!needsInteraction) {
        throw error;
      }

      const tokenResponse = await instance.acquireTokenPopup({
        ...apiRequest,
        account,
      });
      return tokenResponse.accessToken;
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
      alert(`Clock ${clockedIn ? 'out' : 'in'} failed: ${error.message}`);
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
        content: response.result || response.message || 'I received your message but had trouble processing it.'
      }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: `Sorry, I couldn't process that: ${error.message}`
      }]);
    }
  };

  // Daily log submit handler — acquires token then delegates to API
  const handleSubmitLog = async (logData) => {
    const token = await getApiToken();
    await submitDailyLog({
      customer: logData.customer,
      jobNumber: logData.jobNumber,
      hours: logData.hours,
      workCompleted: logData.workCompleted,
      issues: logData.issues
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
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Cinzel, Georgia, serif'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,26,26,0.2)',
            borderTopColor: '#FF1A1A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ fontSize: '24px', letterSpacing: '3px' }}>PHOENIX</div>
          <div style={{ fontSize: '12px', color: '#D4AF37', marginTop: '8px', letterSpacing: '2px' }}>AUTHENTICATING...</div>
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
        onLogin={handleLogin}
      />
    );
  }

  return (
    <LanguageProvider>
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopMenu
        userName={userName}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLogout={handleLogout}
      />

      {currentScreen === 'dashboard' && (
        <Dashboard
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
        <TimeClock weekHours={weekHours} />
      )}
      {currentScreen === 'files' && (
        <FilesScreen
          jobFiles={jobFiles}
          sharepointFolders={sharepointFolders}
        />
      )}
      {currentScreen === 'teams' && <TeamsScreen />}
      {currentScreen === 'dailylog' && (
        <DailyLog
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

