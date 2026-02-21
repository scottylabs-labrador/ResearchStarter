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
  profilePicture?: string;
}

export type ResearchKeysType = keyof ResearchType;

export interface ProfessorType {
  _id: string;
  name: string;
  department: string[];
  college: string[];
  email: string;
  phoneNumber?: string;
  bio?: Record<string, string>;
  media?: string[];
  positions?: { institution: string; position: string; startDate: string }[];
  tags?: string[];
  profilePicture?: string;
}
