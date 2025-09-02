import PakistanJobsClient from './pakistan-jobs-client';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (uri) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  clientPromise = client.connect();
} else {
  console.warn("MONGODB_URI is not defined. Database operations will be disabled.");
  clientPromise = Promise.reject(new Error("MONGODB_URI is not defined"));
}

export const metadata = {
  title: 'Jobs in Pakistan - Find the Latest Job Opportunities',
  description: 'Browse through a wide range of jobs available in Pakistan. Find the latest job openings in various cities and industries.',
};

export default async function Page() {
  let jobs = [];
  try {
    const connectedClient = await clientPromise;
    const database = connectedClient.db("job_board_db");
    const collection = database.collection("jobs");

    // Fetch only Pakistan jobs
    const fetchedJobs = await collection.find({ location: { $regex: /pakistan/i } }).toArray();
    jobs = fetchedJobs.map(job => ({ ...job, id: job._id.toString() }));

  } catch (error) {
    console.error("Failed to fetch jobs on server:", error);
  }

  return <PakistanJobsClient initialJobs={jobs} />;
}