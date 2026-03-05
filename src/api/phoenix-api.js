/**
 * Phoenix Command API Layer
 * Connects to Azure Functions for backend operations
 */

// Validation constants — must match backend limits
const MAX_QUERY_LENGTH = 4000;
const MAX_DAILY_LOG_LENGTH = 10000;
const MAX_CLOCK_NOTE_LENGTH = 500;

const API_BASE = import.meta.env.VITE_API_BASE || "https://phoenix-command-func.azurewebsites.net/api";
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

  const response = await fetch(`${API_BASE}/timeclock`, {
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

  const response = await fetch(`${API_BASE}/dailylog`, {
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
 * Send message to Phoenix AI orchestrator
 * @param {string} query - User's message
 * @param {string[]} agents - Agents to use (default: knowledge_keeper)
 * @param {string} token - Access token (optional)
 */
export async function askPhoenixAI(query, agents = ["knowledge_keeper"], token = null) {
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

  const response = await fetch(`${API_BASE}/orchestrate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      agents,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI query failed: ${response.statusText}`);
  }

  return response.json();
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

