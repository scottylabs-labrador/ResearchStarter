import DEV_MOCK_PROFILE from "./devMockProfile";

export type DevMockRole = "student" | "professor";

type MockUser = {
  id: string;
  name: string;
  email: string;
  andrewId: string;
  isProfessor: boolean;
  firstName: string;
  lastName: string;
  image?: string;
};

type MockSession = {
  user: MockUser;
  session: { id: string; userId: string; expiresAt: Date };
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
};

const studentNames = splitName(DEV_MOCK_PROFILE.name);

const DEV_MOCK_STUDENT_SESSION: MockSession = {
  user: {
    id: "mock-student-user",
    name: DEV_MOCK_PROFILE.name,
    email: DEV_MOCK_PROFILE.email,
    andrewId: DEV_MOCK_PROFILE.email.split("@")[0] ?? "jlee2",
    isProfessor: false,
    firstName: studentNames.firstName,
    lastName: studentNames.lastName,
    image: DEV_MOCK_PROFILE.image,
  },
  session: {
    id: "mock-student-session",
    userId: "mock-student-user",
    expiresAt: new Date(Date.now() + 86_400_000),
  },
};

const DEV_MOCK_PROFESSOR_SESSION: MockSession = {
  user: {
    id: "mock-prof-user",
    name: "Lauren Herckis",
    email: "lrhercki@andrew.cmu.edu",
    andrewId: "lrhercki",
    isProfessor: true,
    firstName: "Lauren",
    lastName: "Herckis",
  },
  session: {
    id: "mock-professor-session",
    userId: "mock-prof-user",
    expiresAt: new Date(Date.now() + 86_400_000),
  },
};

export function getDevMockRole(): DevMockRole {
  const role = import.meta.env.VITE_DEV_MOCK_ROLE;
  return role === "professor" ? "professor" : "student";
}

export function getDevMockSession(): MockSession | null {
  if (!import.meta.env.DEV || import.meta.env.VITE_DEV_BYPASS_AUTH !== "true") return null;
  return getDevMockRole() === "professor" ? DEV_MOCK_PROFESSOR_SESSION : DEV_MOCK_STUDENT_SESSION;
}
