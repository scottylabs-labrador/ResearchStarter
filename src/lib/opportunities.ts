import { ResearchType } from "../DataTypes";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import { parseContact, toArray } from "../utils";
import DEV_MOCK_RESEARCHES from "../data/devMockResearches";
import { isDevBypass } from "./devBypass";

export const OPPORTUNITIES_URL = "http://localhost:5050/opportunities";

/** A ResearchProjects document in the shape the UI renders. */
export const toResearch = (item: any): ResearchType => ({
  _id: item._id,
  projectTitle: item["Project Title"],
  contact: parseContact(item.Contact),
  department: toArray(item.Department),
  description: item.Description,
  desiredSkillLevel: item["Desired Skill Level"],
  paidUnpaid: item["Paid/Unpaid"],
  position: item.Position,
  prereqs: toArray(item.Prereqs),
  relevantLinks: toArray(item["Relevant Links"]),
  source: item.Source,
  timeAdded: item["Time Added"],
  timeCommitment: item["Time Commitment"],
  anticipatedEndDate: item["Anticipated End Date"],
  keywords: toArray(item.Keywords),
  // Listings posted from the app are saved under "Colleges", the documented schema; older ones use "College".
  college: toArray(item.College ?? item.Colleges),
});

/** Contacts map a name to an Andrew ID, or to a full email for listings posted from the app. */
export const contactEmail = (value: string) => (value.includes("@") ? value : `${value}@andrew.cmu.edu`);

const contactAndrewId = (value: string) => (value.split("@")[0] ?? "").trim().toLowerCase();

export const isListedBy = (research: ResearchType, andrewId: string) =>
  Object.values(research.contact ?? {}).some((value) => contactAndrewId(String(value)) === contactAndrewId(andrewId));

/** Every listing; in the local design preview without a backend, the mock listings. */
export async function fetchOpportunities(): Promise<ResearchType[]> {
  try {
    const res = await fetch(`${OPPORTUNITIES_URL}/`);
    if (!res.ok) throw new Error(res.statusText);
    const data: any[] = await res.json();
    return data.filter((item) => item["Project Title"]).map(toResearch);
  } catch (err) {
    if (isDevBypass) return DEV_MOCK_RESEARCHES;
    throw err;
  }
}

/**
 * A professor's listings. The backend's /opportunities/professor/:andrewId matches contact keys,
 * but contacts are keyed by name, so this filters the full list by contact value instead.
 */
export const listingsBy = (opportunities: ResearchType[], andrewId: string) =>
  opportunities.filter((research) => isListedBy(research, andrewId));

const topicsOf = (research: ResearchType) => [...research.department, ...(research.keywords ?? [])].map((topic) => topic.toLowerCase());

/** Other listings that share a department or keyword with this one, the most shared first. */
export function relatedTo(research: ResearchType, opportunities: ResearchType[], limit = 3): ResearchType[] {
  const topics = new Set(topicsOf(research));
  return opportunities
    .filter((other) => other._id !== research._id)
    .map((other) => ({ other, shared: topicsOf(other).filter((topic) => topics.has(topic)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
}

export async function createOpportunity(opportunity: ResearchOpportunity): Promise<void> {
  const res = await fetch(OPPORTUNITIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(opportunity),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteOpportunity(id: string): Promise<void> {
  const res = await fetch(`${OPPORTUNITIES_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
}
