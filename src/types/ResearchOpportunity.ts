export interface ResearchOpportunity {
  projectTitle: string;
  contact: Record<string, string>;
  department: string[];
  description: string;
  desiredSkillLevel: string;
  paidUnpaid: string;
  position: string;
  prereqs: string[];
  relevantLinks: string[];
  source: string;
  timeAdded: string;
  timeCommitment: string;
  anticipatedEndDate: string;
  keywords: string[];
  colleges: string[];
  enableApply: boolean;
}

// Fields excluded from the creation form (set programmatically):
//   source      — defaults to "Created by Professor"
//   timeAdded   — defaults to current date (e.g. "4/18/26")
//   enableApply — defaults to false