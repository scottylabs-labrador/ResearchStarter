import csv
import json
import os

HCII_DEPARTMENT_NAME = "Human-Computer Interaction Institute"
HCII_COLLEGE_NAME = "School of Computer Science"


def build_contact_mapping(row):
    name = (row.get("Your Name") or "").strip()
    email = (row.get("Email Contact") or "").strip()

    andrew_id = ""
    if "@" in email:
        andrew_id = email.split("@", 1)[0].strip()

    if not name:
        name = andrew_id or email

    if not name:
        return {}

    return {name: andrew_id}


def reformat_projects(infile, outfile):
    fieldnames = [
        "Project Title",
        "Contact",
        "Description",
        "Prereqs",
        "Time Commitment",
        "Relevant Links",
        "College",
        "Department",
        "Position",
        "Paid/Unpaid",
        "Desired Skill Level",
        "Source",
        "Time Added",
        "Anticipated End Date",
        "Keywords",
        "Enable Apply",
    ]

    base_dir = os.path.dirname(__file__)
    infile_path = os.path.join(base_dir, infile)
    outfile_path = os.path.join(base_dir, outfile)

    with open(infile_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    new_rows = []
    for row in rows:
        parts = [p.strip() for p in row.get("Position Type:", "").split(",")]
        contact_mapping = build_contact_mapping(row)

        new_rows.append({
            "Project Title": (row.get("Project Title") or "").strip(),
            "Contact": json.dumps(contact_mapping),
            "Description": (row.get("Short Description") or "").strip(),
            "Prereqs": json.dumps([(row.get("Desired Skills") or "").strip()]),
            "Time Commitment": (row.get("Time Commitment") or "").strip(),
            "Relevant Links": json.dumps([(row.get("Project URL (optional)") or "").strip()]),
            "College": json.dumps([HCII_COLLEGE_NAME]),
            "Department": json.dumps([HCII_DEPARTMENT_NAME]),
            "Position": parts[0] if len(parts) > 0 else "",
            "Paid/Unpaid": parts[1] if len(parts) > 1 else "",
            "Desired Skill Level": (row.get("Seeking:") or "").strip(),
            "Source": "https://docs.google.com/spreadsheets/d/1AtmjGPa0gTOezwukgJiRWcvzQXZYL1lueRqrE5ayWcQ/edit?gid=1632610366#gid=1632610366",
            "Time Added": "4/4/26",
            "Anticipated End Date": (row.get("Anticipated Project End Date") or "").strip(),
            "Keywords": json.dumps([]),
            "Enable Apply": False,
        })

    with open(outfile_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(new_rows)


if __name__ == "__main__":
    reformat_projects("data.csv", "cleaned_project.csv")