import React, { createContext, useContext, useState } from 'react';

interface TimerState {
  clockedIn: boolean;
  clockTime: Date | null;
  todayHours: number;
  weekHours: number;
  isLoading: boolean;
}

interface TimerContextValue {
  state: TimerState;
  setClockedIn: (v: boolean) => void;
  setClockTime: (v: Date | null) => void;
  setTodayHours: (v: number) => void;
  setWeekHours: (v: number) => void;
  setIsLoading: (v: boolean) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<Date | null>(null);
  const [todayHours, setTodayHours] = useState(0);
  const [weekHours, setWeekHours] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const value: TimerContextValue = {
    state: { clockedIn, clockTime, todayHours, weekHours, isLoading },
    setClockedIn,
    setClockTime,
    setTodayHours,
    setWeekHours,
    setIsLoading,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = (): TimerContextValue => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider');
  return ctx;
};

