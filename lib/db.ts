import { MongoClient, ServerApiVersion, Collection } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

let client: MongoClient | undefined;

async function connectToDatabase(): Promise<Collection> {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined.");
  }

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
  }
  
  const database = client.db("job_board_db");
  return database.collection("jobs");
}

export async function getJobs() {
  const collection = await connectToDatabase();
  const jobs = await collection.find({}).toArray();
  return jobs;
}