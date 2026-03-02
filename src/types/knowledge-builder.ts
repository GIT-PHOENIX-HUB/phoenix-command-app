// ============================================================================
// PHOENIX COMMAND — Knowledge Builder Types
// ============================================================================

export type TopicTag =
  | 'Lighting'
  | 'BranchCircuits'
  | 'MultiWireBranch'
  | 'Feeders'
  | 'Service'
  | 'OCPD'
  | 'Grounding'
  | 'GFCI_AFCI'
  | 'Pools'
  | 'Appliances'
  | 'VoltageDrop';

export interface KnowledgeItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  datePublished: string;
  dateCollected: string;
  images: string[];
  question: string;
  answerChoices: string[];
  correctAnswer: string;
  explanation: string;
  necCitations: string[];
  topicTags: TopicTag[];
  relevanceScore: number;
  servedToCrewDate: string | null;
  servedCount: number;
  fieldNote: string;
}

export interface DailyHuddle {
  date: string;
  items: KnowledgeItem[];
  backup: KnowledgeItem | null;
  weekTheme: string;
  teaserTopic: string;
}

export interface KnowledgeBuilderStats {
  totalItems: number;
  topicDistribution: Record<TopicTag, number>;
  lastCollectionDate: string;
  sourceErrors: number;
  itemsServedThisWeek: number;
}
