import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Screen } from '../types';

interface AppState {
  currentScreen: Screen;
  userName: string;
  jobsThisWeek: number;
  logsSubmitted: number;
  customers: string[];
  jobs: string[];
  jobFiles: { name: string; type: string; items?: string; size?: string }[];
  sharepointFolders: string[];
}

interface AppContextValue {
  state: AppState;
  setCurrentScreen: (screen: Screen) => void;
  setUserName: (name: string) => void;
  setJobsThisWeek: (n: number) => void;
  setLogsSubmitted: (n: number) => void;
  setCustomers: (c: string[]) => void;
  setJobs: (j: string[]) => void;
  setJobFiles: (f: AppState['jobFiles']) => void;
  setSharepointFolders: (f: string[]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userName, setUserName] = useState('');
  const [jobsThisWeek, setJobsThisWeek] = useState(0);
  const [logsSubmitted, setLogsSubmitted] = useState(0);
  const [customers, setCustomers] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  const [jobFiles, setJobFiles] = useState<AppState['jobFiles']>([]);
  const [sharepointFolders, setSharepointFolders] = useState<string[]>([]);

  const value: AppContextValue = {
    state: { currentScreen, userName, jobsThisWeek, logsSubmitted, customers, jobs, jobFiles, sharepointFolders },
    setCurrentScreen,
    setUserName,
    setJobsThisWeek,
    setLogsSubmitted,
    setCustomers,
    setJobs,
    setJobFiles,
    setSharepointFolders,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

