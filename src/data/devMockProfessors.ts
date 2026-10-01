import { ProfessorType } from "../DataTypes";

// Dev-only sample professors for UI preview when the backend is unreachable.
const DEV_MOCK_PROFESSORS: Record<string, ProfessorType> = {
  lrhercki: {
    _id: "mock-prof-1",
    name: "Lauren Herckis",
    department: ["Human-Computer Interaction"],
    college: ["School of Computer Science"],
    email: "lrhercki@andrew.cmu.edu",
    bio: {
      htmlstripped:
        "Lauren Herckis studies how organizations adopt and implement technology in ways that support human work. Her lab combines qualitative methods with applied AI to improve accessibility and collaboration in research settings.",
    },
    tags: ["HCI", "Accessibility", "AI"],
    positions: [
      {
        institution: "Carnegie Mellon University",
        position: "Associate Professor",
        startDate: "2018",
      },
    ],
  },
  ajones: {
    _id: "mock-prof-2",
    name: "Aaron Jones",
    department: ["Mechanical Engineering"],
    college: ["College of Engineering"],
    email: "ajones@andrew.cmu.edu",
    bio: {
      htmlstripped:
        "Aaron Jones leads a robotics lab focused on soft pneumatic systems for surgical and assistive applications. Students in the lab work on CAD, prototyping, and experimental validation.",
    },
    tags: ["Robotics", "Healthcare", "Prototyping"],
    positions: [
      {
        institution: "Carnegie Mellon University",
        position: "Assistant Professor",
        startDate: "2020",
      },
    ],
  },
};

export function getDevMockProfessor(andrewId: string): ProfessorType | null {
  if (!import.meta.env.DEV || import.meta.env.VITE_DEV_BYPASS_AUTH !== "true") return null;
  const key = andrewId.trim().toLowerCase();
  return DEV_MOCK_PROFESSORS[key] ?? null;
}
