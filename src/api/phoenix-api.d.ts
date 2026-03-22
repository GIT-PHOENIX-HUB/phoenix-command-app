export const MAX_QUERY_LENGTH: number;
export const MAX_DAILY_LOG_LENGTH: number;
export const MAX_CLOCK_NOTE_LENGTH: number;

export function clockInOut(options: {
  action: string;
  location: { lat: number; lng: number } | null;
  note?: string;
  token: string;
}): Promise<any>;

export function submitDailyLog(
  log: {
    date: string;
    technicianName: string;
    jobAddress: string;
    phase: 'rough-in' | 'trim-out';
    completedWork: Array<{ taskItem: string; qty: number; estTime: string; description: string }>;
    incompleteWork: Array<{ taskItem: string; qty: number; estTime: string; description: string }>;
    notes: string;
    materialNeeded: string;
    techSignature: string;
    leadSignature: string;
    photos: string[];
  },
  token: string
): Promise<any>;

export function askPhoenixAI(
  query: string,
  agents?: string[],
  token?: string | null
): Promise<any>;

export function getCurrentLocation(): Promise<{ lat: number; lng: number } | null>;

