export type Screen = 'splash' | 'dashboard' | 'timeclock' | 'files' | 'teams' | 'dailylog';

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

export interface WorkRow {
  taskItem: string;
  qty: number;
  estTime: string;
  description: string;
}

export interface DailyLogEntry {
  id: string;
  date: string;
  technicianName: string;
  jobAddress: string;
  phase: 'rough-in' | 'trim-out';
  completedWork: WorkRow[];
  incompleteWork: WorkRow[];
  notes: string;
  materialNeeded: string;
  techSignature: string;
  leadSignature: string;
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
  date: string;
  technicianName: string;
  jobAddress: string;
  phase: 'rough-in' | 'trim-out';
  completedWork: WorkRow[];
  incompleteWork: WorkRow[];
  notes: string;
  materialNeeded: string;
  techSignature: string;
  leadSignature: string;
  photos: string[];
}

