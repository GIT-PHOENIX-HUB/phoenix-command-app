export type Screen = 'splash' | 'dashboard' | 'timeclock' | 'files' | 'teams' | 'dailylog' | 'knowledgebuilder';

export interface UserProfile {
  displayName: string;
  email: string;
  id: string;
}

export interface Job {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'completed' | 'pending';
}

export interface TimeEntry {
  clockIn: Date;
  clockOut?: Date;
  jobId: string;
  location?: { lat: number; lng: number } | null;
}

export interface DailyLogEntry {
  id: string;
  date: string;
  customer: string;
  jobNumber: string;
  hours: number;
  workCompleted: string;
  issues: string;
  photos: string[];
}

export interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
}

export interface JobFile {
  name: string;
  type: string;
  items?: string;
  size?: string;
}

export interface DailyLogFormData {
  customer: string;
  jobNumber: string;
  hours: number;
  workCompleted: string;
  issues: string;
}

