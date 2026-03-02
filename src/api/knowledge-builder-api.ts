/**
 * Knowledge Builder API Layer
 * Connects to Azure Functions for NEC daily teaching content
 */

const API_BASE = import.meta.env.VITE_API_BASE || "https://phoenix-command-func.azurewebsites.net/api";
const FUNCTION_KEY = import.meta.env.VITE_FUNCTION_KEY || "";

// ============================================================================
// MOCK DATA — 3 Realistic NEC Items
// ============================================================================

const MOCK_DATA = {
  date: new Date().toISOString().split('T')[0],
  weekTheme: 'GFCI & Grounding Fundamentals',
  teaserTopic: 'Voltage Drop Calculations',
  backup: {
    id: 'kb-backup-001',
    title: 'Small Appliance Branch Circuits — NEC 210.52(B)',
    source: 'NEC 2023',
    sourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-70',
    datePublished: '2022-08-01',
    dateCollected: new Date().toISOString().split('T')[0],
    images: [],
    question: 'How many small appliance branch circuits are required in the kitchen of a dwelling unit, and what is the minimum ampere rating?',
    answerChoices: [
      'A) One 15-ampere circuit',
      'B) Two 20-ampere circuits',
      'C) One 20-ampere circuit',
      'D) Two 15-ampere circuits',
    ],
    correctAnswer: 'B) Two 20-ampere circuits',
    explanation: 'NEC 210.52(B)(1) requires at least two 20-ampere small appliance branch circuits for receptacle outlets in the kitchen, pantry, breakfast room, dining room, or similar area of dwelling units. These circuits shall have no other outlets connected to them.',
    necCitations: ['210.52(B)(1)', '210.52(B)(2)'],
    topicTags: ['Appliances', 'BranchCircuits'],
    relevanceScore: 88,
    servedToCrewDate: null,
    servedCount: 0,
    fieldNote: 'On new residential kitchens, always verify you have 2 separate 20A small appliance circuits before rough-in inspection. Common miss: both circuits sharing the same breaker.',
  },
  items: [
    {
      id: 'kb-001',
      title: 'GFCI Protection Requirements — NEC 210.8(A)',
      source: 'NEC 2023',
      sourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-70',
      datePublished: '2022-08-01',
      dateCollected: new Date().toISOString().split('T')[0],
      images: [],
      question: 'Which of the following locations in a dwelling unit requires GFCI protection for 125-volt, single-phase, 15- and 20-ampere receptacles?',
      answerChoices: [
        'A) Bedrooms only',
        'B) Bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens, and boathouses',
        'C) Living rooms and dining rooms',
        'D) Only locations within 6 feet of a water source',
      ],
      correctAnswer: 'B) Bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens, and boathouses',
      explanation: 'NEC 210.8(A) lists all required GFCI locations for dwelling units. The 2023 NEC expanded GFCI requirements significantly. Key additions include all areas with electrical equipment (e.g., dishwashers, refrigerators). Remember: GFCI protection applies to the receptacle, the circuit, or a GFCI breaker — any method satisfies the code.',
      necCitations: ['210.8(A)', '210.8(A)(1)', '210.8(A)(2)', '210.8(A)(5)'],
      topicTags: ['GFCI_AFCI', 'BranchCircuits'],
      relevanceScore: 95,
      servedToCrewDate: new Date().toISOString().split('T')[0],
      servedCount: 1,
      fieldNote: 'Field tip: When installing GFCI receptacles in a garage, ensure downstream outlets are also protected. Label protected outlets "GFCI Protected — No Equipment Ground" when no ground wire is present.',
    },
    {
      id: 'kb-002',
      title: 'Grounding Electrode Conductor Sizing — NEC 250.66',
      source: 'NEC 2023',
      sourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-70',
      datePublished: '2022-08-01',
      dateCollected: new Date().toISOString().split('T')[0],
      images: [],
      question: 'For a service entrance with 2/0 AWG copper service entrance conductors, what is the minimum size copper grounding electrode conductor (GEC) required by NEC 250.66?',
      answerChoices: [
        'A) 6 AWG copper',
        'B) 4 AWG copper',
        'C) 2 AWG copper',
        'D) 1/0 AWG copper',
      ],
      correctAnswer: 'B) 4 AWG copper',
      explanation: 'Per NEC Table 250.66, when the largest service entrance conductor is 2/0 AWG copper, the minimum GEC size is 4 AWG copper. The GEC size is based on the largest service entrance conductor, not the service size. Always refer to Table 250.66 — do not guess on GEC sizing as undersized GECs are a common inspection failure.',
      necCitations: ['250.66', 'Table 250.66', '250.64'],
      topicTags: ['Grounding', 'Service'],
      relevanceScore: 92,
      servedToCrewDate: new Date().toISOString().split('T')[0],
      servedCount: 1,
      fieldNote: 'Keep a laminated copy of Table 250.66 in your service truck. Inspectors frequently check GEC sizing on commercial and residential service installs. Also verify the GEC is protected from physical damage per 250.64(B).',
    },
  ],
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch the daily huddle of NEC teaching items
 * @param {string} token - Bearer access token
 */
export async function fetchDailyHuddle(token) {
  try {
    const response = await fetch(`${API_BASE}/knowledge-builder/daily`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(FUNCTION_KEY && { 'x-functions-key': FUNCTION_KEY }),
      },
    });

    if (!response.ok) {
      throw new Error(`Daily huddle fetch failed: ${response.statusText}`);
    }

    return response.json();
  } catch {
    // Fall back to mock data when API is unavailable
    return MOCK_DATA;
  }
}

/**
 * Fetch archive of past knowledge items
 * @param {string} token - Bearer access token
 * @param {object} filters - Optional filters (topicTags, dateRange, etc.)
 */
export async function fetchArchive(token, filters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])
  );
  const url = `${API_BASE}/knowledge-builder/archive${params.toString() ? `?${params}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(FUNCTION_KEY && { 'x-functions-key': FUNCTION_KEY }),
      },
    });

    if (!response.ok) {
      throw new Error(`Archive fetch failed: ${response.statusText}`);
    }

    return response.json();
  } catch {
    return { items: [...MOCK_DATA.items, MOCK_DATA.backup].filter(Boolean), total: 3 };
  }
}

/**
 * Fetch knowledge builder stats
 * @param {string} token - Bearer access token
 */
export async function fetchStats(token) {
  try {
    const response = await fetch(`${API_BASE}/knowledge-builder/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(FUNCTION_KEY && { 'x-functions-key': FUNCTION_KEY }),
      },
    });

    if (!response.ok) {
      throw new Error(`Stats fetch failed: ${response.statusText}`);
    }

    return response.json();
  } catch {
    return {
      totalItems: 3,
      topicDistribution: {
        GFCI_AFCI: 1,
        BranchCircuits: 2,
        Grounding: 1,
        Service: 1,
        Appliances: 1,
      },
      lastCollectionDate: new Date().toISOString().split('T')[0],
      sourceErrors: 0,
      itemsServedThisWeek: 2,
    };
  }
}
