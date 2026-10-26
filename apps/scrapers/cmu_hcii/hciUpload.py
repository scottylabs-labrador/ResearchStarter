from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import csv
from pathlib import Path

JSON_FIELDS = {"College", "Department", "Prereqs", "Contact", "Relevant Links", "Keywords"}
BOOL_FIELDS = {"Enable Apply"}

with open(Path(__file__).resolve().parents[1] / 'private.json', mode='r') as file:
    passwords = json.load(file)

uri = f"mongodb+srv://MongoAccess:{passwords['password']}@cluster0.a6odq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    print(f'Available Databases: {client.list_database_names()}')

    research_db = client['CMUResearchDatabase']
    professor_col = research_db['ResearchProjects']

    data_to_insert = []
    with open(Path(__file__).resolve().parent / 'cleaned_project.csv', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            doc = dict(row)
            for field in JSON_FIELDS:
                if field in doc and doc[field]:
                    try:
                        doc[field] = json.loads(doc[field])
                    except json.JSONDecodeError:
                        pass
            for field in BOOL_FIELDS:
                if field in doc:
                    doc[field] = doc[field].lower() == "true"
            data_to_insert.append(doc)

    if data_to_insert:
        result = professor_col.insert_many(data_to_insert)
        print(f"Inserted {len(result.inserted_ids)} documents into MongoDB.")

except Exception as e:
    print(e)
