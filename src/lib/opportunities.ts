import { ResearchType } from "../DataTypes";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import { parseContact, toArray } from "../utils";
import DEV_MOCK_RESEARCHES from "../data/devMockResearches";

export const OPPORTUNITIES_URL = "http://localhost:5050/opportunities";

const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

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
