export interface ResearchAllTypes {
  research: ResearchType[];
}

export interface ResearchType {
  _id: string;
  contact: Record<string, string>;
  department: string[];
  description: string;
  desiredSkillLevel?: string;
  paidUnpaid?: string;
  position?: string;
  prereqs?: string;
  projectTitle: string;
  relevantLinks?: string[];
  source?: string;
  timeAdded?: string;
  timeCommitment?: string;
  anticipatedEndDate?: string;
  // Optional fields from the old structure that might still be in use
  id?: string;
  keywords?: string[];
  colleges?: string[];
  name?: string;
  website?: string;
}

export type ResearchKeysType = keyof ResearchType;
