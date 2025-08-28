
import json
from pymongo import MongoClient

# Your MongoDB connection URI
uri = "mongodb+srv://sponsorshipsvisajobs-db:Sanpak1122@cluster0.28a3dng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Select the database and collection
db = client.job_board_db
collection = db.jobs

# Read the jobs.json file
with open('C:\\Users\\Fahad Mushtaq\\Downloads\\sponsorshipsvisajobs-master\\sponsorshipsvisajobs-master\\jobs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Insert the data into the collection
if data:
    collection.insert_many(data)
    print(f"Successfully inserted {len(data)} documents into the jobs collection.")
else:
    print("No data to insert.")

client.close()
