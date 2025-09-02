import GovernmentJobsClient from './government-jobs-client';
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
  title: 'Government Jobs in Pakistan - Latest Vacancies',
  description: 'Find the latest government jobs in Pakistan. We have a wide range of job opportunities in the public sector.',
};

export default async function Page() {
  let jobs = [];
  try {
    const connectedClient = await clientPromise;
    const database = connectedClient.db("job_board_db");
    const collection = database.collection("jobs");

    // Fetch only government jobs
    const fetchedJobs = await collection.find({ location: { $regex: /government/i } }).toArray();
    jobs = fetchedJobs.map(job => ({ ...job, id: job._id.toString() }));

  } catch (error) {
    console.error("Failed to fetch jobs on server:", error);
  }

  return <GovernmentJobsClient initialJobs={jobs} />;
}