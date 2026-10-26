import { Experience } from "../types/Experience";

export interface StudentProfile {
  name: string;
  email: string;
  image?: string;
  major: string;
  class: string;
  colleges: string[];
  departments: string[];
  bio: string;
  interests: string[];
  experiences: Experience[];
}

// Dev-only sample student for UI preview when the backend is unreachable.
const DEV_MOCK_PROFILE: StudentProfile = {
  name: "Jordan Lee",
  email: "jlee2@andrew.cmu.edu",
  major: "Information Systems",
  class: "Junior",
  colleges: ["Dietrich College of Humanities & Social Sciences"],
  departments: ["Information Systems"],
  bio: "I’m interested in how people make decisions with AI tools, and I’d like to spend next semester helping a lab run user studies. I’ve done a little front-end work and I’m comfortable with Python and R.",
  interests: ["Human-Computer Interaction", "Machine Learning", "Accessibility", "Data Visualization"],
  experiences: [
    {
      id: "mock-exp-1",
      title: "Undergraduate Research Assistant",
      professorOrCompany: "Lauren Herckis",
      topic: "Human-Computer Interaction",
      date: "2025-09-01",
      endDate: "2026-05-01",
      level: "Undergraduate",
      associatedTags: ["User studies", "Qualitative coding", "Figma"],
      description:
        "Ran twelve moderated interviews with faculty about adopting AI teaching tools, then coded transcripts and helped draft the findings section of a workshop paper.",
    },
    {
      id: "mock-exp-2",
      title: "Data Science Intern",
      professorOrCompany: "Pittsburgh Regional Transit",
      topic: "Transportation analytics",
      date: "2025-06-01",
      endDate: "2025-08-15",
      level: "Industry",
      associatedTags: ["Python", "Pandas", "Tableau"],
      description: "Built a ridership dashboard that the planning team now uses for weekly service reviews.",
    },
  ],
};

export default DEV_MOCK_PROFILE;
