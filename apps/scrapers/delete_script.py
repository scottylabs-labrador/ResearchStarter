from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import csv
from pathlib import Path

with open(Path(__file__).resolve().parent / 'private.json', mode ='r') as file:
    passwords = json.load(file)

    uri = f"mongodb+srv://MongoAccess:{passwords['password']}@cluster0.a6odq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")

        print(f'Available Databases: {client.list_database_names()}')

        research_db = client['CMUResearchDatabase']

        professor_col = research_db['ResearchOpportunities']

        reslult = professor_col.delete_many({})

    except Exception as e:
        print(e)
