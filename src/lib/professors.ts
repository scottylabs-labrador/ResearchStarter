import { ProfessorType } from "../DataTypes";
import { getDevMockProfessor } from "../data/devMockProfessors";

const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

const listOf = (value: unknown): string[] => (Array.isArray(value) ? value : value ? [String(value)] : []);

/** A Professors document in the shape the UI renders. */
const toProfessor = (data: any): ProfessorType => ({
  _id: data._id,
  name: data.Name ?? "",
  department: listOf(data.Department),
  college: listOf(data.College),
  email: data.Email ?? data.email ?? "",
  phoneNumber: data["Phone Number"],
  bio: data.Bio,
  media: data.Media,
  positions: data.Positions,
  tags: data.Tags,
  profilePicture: data["Profile Picture"],
});

/** Looks a professor up by Andrew ID, email or id. Resolves null when there is no such professor. */
export async function fetchProfessor(id: string): Promise<ProfessorType | null> {
  try {
    const res = await fetch(`http://localhost:5050/professors/${encodeURIComponent(id.trim())}`);
    if (res.ok) return toProfessor(await res.json());
    if (res.status !== 404) throw new Error(res.statusText);
  } catch (err) {
    if (!isDevBypass) throw err;
  }
  return getDevMockProfessor(id);
}
