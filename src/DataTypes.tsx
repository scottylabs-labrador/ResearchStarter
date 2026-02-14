export interface ResearchAllTypes {
  research: ResearchType[];
}

export interface ResearchType {
  _id: string;
  contact: Record<string, string>; // e.g. { "Lauren Herckis": "lrhercki" }
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
  college?: string[];
  keywords?: string[];
  pfp?: string;
}

export type ResearchKeysType = keyof ResearchType;
