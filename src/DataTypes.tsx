export interface ResearchAllTypes {
  research: ResearchType[];
}

export interface ResearchType {
  id: string;
  type: string;
  name: string;
  email: string;
  officeHours: string;
  topics: string[];
  researches: string[];
  keywords: string[];
  colleges: string[];
  department: string[];
  labs: string[];
  requestedYear: string;
  requestedExp: string;
  timeAvail: string;
  pastPapers: string[];
  description: string;
  website: string;
}

export type ResearchKeysType = keyof ResearchType;
