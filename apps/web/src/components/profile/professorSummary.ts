import { ProfessorType } from "../../DataTypes";

export function professorSummaryLine(professor: Pick<ProfessorType, "department" | "college" | "email" | "positions">): string {
  const title = professor.positions?.[0]?.position;
  const department = professor.department.filter(Boolean).join(", ");
  const college = professor.college.filter(Boolean).join(", ");

  return [title, department, college].filter(Boolean).join(" · ") || professor.email;
}
