from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import project_scraper
import os

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

        collection = research_db['ResearchProjects']
        projects = project_scraper.scrape_robotics('https://www.ri.cmu.edu/research/projects/')
        for project in projects:
            collection.insert_one(projects[project])
        print("uploaded all to mongo")


    except Exception as e:
        print(e)
