from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import os
import scraper

current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, '..')
pass_file = os.path.join(parent_dir, "private.json")
with open(pass_file, mode ='r') as file:
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

        collection = research_db['Professors']

        profs = scraper.cmu_scholar_scrape()
        for prof in profs:
            collection.insert_one(profs[prof])
        #x = professor_col.insert_one({"name": "Mackey"})
        print("all professors are in mongo now yay")
    except Exception as e:
        print(e)
