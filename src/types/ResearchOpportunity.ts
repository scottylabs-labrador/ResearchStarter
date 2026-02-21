export interface ResearchOpportunity {
  id: string;
  positionTitle: string;
  college: string;
  departmentArea: string;
  educationRequirement: string;
  compensationType: string;
  location: string;
  startSemester: string;
  predictedEndSemester: string;
  limitVisibility: boolean;
  limitMajor: string;
  allowDirectApplications: boolean;
  website: string;
  description: string;
  requiredSkills: string[];
}
