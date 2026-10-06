/**
 * Phoenix Command API Layer
 * Connects to the Phoenix Python runtime (phoenix.runtime.app:gateway, :9120).
 * Prior Azure Functions backend is superseded; VITE_API_BASE overrides per environment.
 */

// Validation constants — must match backend limits
const MAX_QUERY_LENGTH = 4000;
const MAX_DAILY_LOG_LENGTH = 10000;
const MAX_CLOCK_NOTE_LENGTH = 500;

const configuredApiBase = String(import.meta.env.VITE_API_BASE || "")
  .trim()
  .replace(/\/+$/, "");
if (!configuredApiBase && !import.meta.env.DEV) {
  throw new Error("VITE_API_BASE is required for production builds");
}
const API_BASE = configuredApiBase
  || (import.meta.env.DEV ? "http://127.0.0.1:9120" : "");
const FUNCTION_KEY = import.meta.env.VITE_FUNCTION_KEY || "";
const API_SCOPE = import.meta.env.VITE_API_SCOPE
  || `api://${import.meta.env.VITE_AZURE_CLIENT_ID || "8b78f443-e000-4689-ad57-71e4e616960f"}/.default`;

/**
 * Get the current user's access token for API calls
 * @param {object} msalInstance - MSAL instance
 * @param {object} account - Active account
 * @returns {Promise<string>} Access token
 */
async function getAccessToken(msalInstance, account) {
  try {
    const response = await msalInstance.acquireTokenSilent({
      scopes: [API_SCOPE],
      account: account,
    });
    return response.accessToken;
  } catch (error) {
    console.error("Token acquisition failed:", error);
    throw error;
  }
}

/**
 * Clock in or out
 * @param {object} options - Clock options
 * @param {string} options.action - "clock_in" or "clock_out"
 * @param {object} options.location - GPS coordinates {lat, lng}
 * @param {string} options.note - Optional clock note
 * @param {string} options.token - Access token
 */
export async function clockInOut({ action, location, note, token }) {
  if (note && note.length > MAX_CLOCK_NOTE_LENGTH) {
    throw new Error(`Clock note exceeds maximum length of ${MAX_CLOCK_NOTE_LENGTH} characters`);
  }

  const response = await fetch(`${API_BASE}/v1/timeclock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(FUNCTION_KEY && { "x-functions-key": FUNCTION_KEY }),
    },
    body: JSON.stringify({
      action,
      timestamp: new Date().toISOString(),
      location,
      ...(note && { note }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Clock ${action} failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit daily work log
 * @param {object} log - Daily log data
 * @param {string} log.date - Log date
 * @param {string} log.technicianName - Technician's display name
 * @param {string} log.jobAddress - Job name / address
 * @param {string} log.phase - 'rough-in' or 'trim-out'
 * @param {object[]} log.completedWork - Completed work rows
 * @param {object[]} log.incompleteWork - Incomplete work rows
 * @param {string} log.notes - Notes on incomplete items
 * @param {string} log.materialNeeded - Materials needed
 * @param {string} log.techSignature - Technician signature value
 * @param {string} log.leadSignature - Lead signature value
 * @param {string[]} log.photos - Photo URLs (optional)
 * @param {string} token - Access token
 */
export async function submitDailyLog(log, token) {
  if (log.notes && log.notes.length > MAX_DAILY_LOG_LENGTH) {
    throw new Error(`Notes field exceeds maximum length of ${MAX_DAILY_LOG_LENGTH} characters`);
  }
  if (log.materialNeeded && log.materialNeeded.length > MAX_DAILY_LOG_LENGTH) {
    throw new Error(`Material needed field exceeds maximum length of ${MAX_DAILY_LOG_LENGTH} characters`);
  }

  const response = await fetch(`${API_BASE}/v1/dailylog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(FUNCTION_KEY && { "x-functions-key": FUNCTION_KEY }),
    },
    body: JSON.stringify({
      ...log,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Daily log submission failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Send message to Phoenix AI orchestrator via the /v3/chat browser bridge.
 *
 * Runtime contract (phoenix.runtime.app:gateway /v3/chat):
 *   Request  → POST {API_BASE}/v3/chat  { message: string }
 *   Response ← { text: string, ...rest }
 *   Returns  → { result: string, ...rest }   (result = text for backward compat)
 *
 * @param {string} query - User's message
 * @param {string[]} _agents - Reserved for future routing; not forwarded to the
 *   runtime yet (/v3/chat has no agents parameter at the M-1 boundary).
 * @param {string|null} token - ****** (optional; /v3/chat is a tokenless
 *   browser bridge, but the header is forwarded if provided)
 */
export async function askPhoenixAI(query, _agents = ["knowledge_keeper"], token = null) {
  if (query.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (FUNCTION_KEY) {
    headers["x-functions-key"] = FUNCTION_KEY;
  }

  // Runtime chat rides the tokenless browser bridge /v3/chat (M-1 boundary:
  // no Phoenix token in the browser). Legacy single-turn shape { message } is
  // the contract's accepted form; `agents` has no runtime equivalent yet.
  const response = await fetch(`${API_BASE}/v3/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message: query,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI query failed: ${response.statusText}`);
  }

  const payload = await response.json();
  // v3 envelope carries the reply in `text`; keep the caller's `.result` contract.
  return { result: payload.text, ...payload };
}

/**
 * Get current user's GPS location
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        // Return null location if GPS fails (don't block clock in/out)
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

export { MAX_QUERY_LENGTH, MAX_DAILY_LOG_LENGTH, MAX_CLOCK_NOTE_LENGTH };
