import { ResearchType } from "../DataTypes";

export function getDummyResearchForProfessor(
  professorName: string,
  andrewId: string
): ResearchType[] {
  return [
    {
      _id: "dummy-1",
      projectTitle: "StatML Research Assistant",
      contact: { [professorName]: andrewId },
      department: ["Material Engineering"],
      description:
        "viverra sed cursus lorem. elit nibh placerat odio nibh ex dolor hendrerit ipsum elit lobortis, libero, enim. Nunc non quam consectetur ex non nibh quis tincidunt leo. Sed lacus, risus elit quam lacus, volutpat laoreet eget lacus nulla, Ut tincidunt nec risus venenatis ipsum at, ipsum ipsum nulla, sit amet, elit.",
      position: "Undergraduate",
      paidUnpaid: "$13/hr",
      timeAdded: "2025/05/16",
      anticipatedEndDate: "Fall 2026",
      college: ["College of Engineering"],
      keywords: ["AI", "Material Engineering", "Programming"],
    },
    {
      _id: "dummy-2",
      projectTitle: "StatML Research Assistant",
      contact: { [professorName]: andrewId },
      department: ["Material Engineering"],
      description:
        "viverra sed cursus lorem. elit nibh placerat odio nibh ex dolor hendrerit ipsum elit lobortis, libero, enim. Nunc non quam consectetur ex non nibh quis tincidunt leo. Sed lacus, risus elit quam lacus, volutpat laoreet eget lacus nulla, Ut tincidunt nec risus venenatis ipsum at, ipsum ipsum nulla, sit amet, elit.",
      position: "Undergraduate",
      paidUnpaid: "$13/hr",
      timeAdded: "2025/05/16",
      anticipatedEndDate: "Fall 2026",
      college: ["College of Engineering"],
      keywords: ["AI", "Material Engineering", "Programming"],
    },
    {
      _id: "dummy-3",
      projectTitle: "StatML Research Assistant",
      contact: { [professorName]: andrewId },
      department: ["Material Engineering"],
      description:
        "viverra sed cursus lorem. elit nibh placerat odio nibh ex dolor hendrerit ipsum elit lobortis, libero, enim. Nunc non quam consectetur ex non nibh quis tincidunt leo. Sed lacus, risus elit quam lacus, volutpat laoreet eget lacus nulla, Ut tincidunt nec risus venenatis ipsum at, ipsum ipsum nulla, sit amet, elit.",
      position: "Undergraduate",
      paidUnpaid: "$13/hr",
      timeAdded: "2025/05/16",
      anticipatedEndDate: "Fall 2026",
      college: ["College of Engineering"],
      keywords: ["AI", "Material Engineering", "Programming"],
    },
  ];
}
