import csv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
import json
import os

CONTACT_IDENTIFIER = "Project Contact:"
DESCRIPTION_IDENTIFIER = "Project Description:"
PREREQ_IDENTIFIER = "Prerequisite Knowledge:"
RELEVANT_IDENTIFIER = "Link(s) to Relevant Papers:"
URLS_IDENTIFIER = "Project URLs:"

current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, '..')
pass_file = os.path.join(parent_dir, "private.json")

with open(pass_file, mode ='r') as file:
    passwords = json.load(file)
    uri = f"mongodb+srv://MongoAccess:{passwords['password']}@cluster0.a6odq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsAllowInvalidCertificates=True)
db = client["CMUResearchDatabase"]
col = db["ResearchProjects"]

# Data (to be uploaded)
scs_data = []

# Goal: parse json

with open(os.path.join(current_dir, 'example_json/Undergraduate Research Opportunities.csv'), encoding="utf-8", mode ='r') as file:
    csvFile = csv.DictReader(file)
    for line in csvFile:
        info = line[""]
        project_contact_i = info.index(CONTACT_IDENTIFIER)
        project_desc_i = info.index(DESCRIPTION_IDENTIFIER)
        project_prereq_i = info.index(PREREQ_IDENTIFIER)
        relevant_i = info.index(RELEVANT_IDENTIFIER)
        project_URL_i = info.index(URLS_IDENTIFIER)

        project_contact = info[project_contact_i + len(CONTACT_IDENTIFIER) : project_desc_i].strip()
        project_desc = info[project_desc_i + len(DESCRIPTION_IDENTIFIER) : project_prereq_i].strip()
        project_prereq = info[project_prereq_i + len(PREREQ_IDENTIFIER) : relevant_i].strip()       
        project_relevant = info[relevant_i + len(RELEVANT_IDENTIFIER) : project_URL_i].strip()
        project_URLs = info[project_URL_i + len(URLS_IDENTIFIER) : len(info)-1].strip()

        name = project_contact.split("-")[0].strip()
        email = project_contact.split("-")[1].strip()
        project_date_added = line["Date Added"]
        project_title = line["Project Title"]
        project_department = line["Department"]
        project_time_commitment = line["Time Commitment (Hours/Week)"]
        project_keywords = line["Keywords"]
        project_apply = line["Accepting Applications?"]
        if(project_apply == "No"):
            project_apply = False
        else:
            project_apply = True
        current_datetime = datetime.now()
        formatted_datetime = current_datetime.strftime("%m/%d/%Y")
        
        temp_dict = {
	    "Project Title": project_title,
            "Contact": {name: email},
            "Department": project_department,
            "Description": "Date Added: " + project_date_added + '\n' + project_desc,
            "Desired Skill Level": "",
            "Paid/Unpaid": "",
            "Position": "",
            "Prereqs": [project_prereq],
            "Relevant Links": project_relevant + project_URLs,
            "Source": "https://www.cs.cmu.edu/research/undergraduate-research-opportunities/",
            "Time Added": formatted_datetime,
            "Time Commitment": project_time_commitment,
            "Anticipated End Date": "",
            "Keywords": [project_keywords],
            "Colleges": ["School of Computer Science"],
            "Enable Apply": project_apply
        }
        scs_data.append(temp_dict)

return_val = col.insert_many(scs_data)
print("inserted them")
