import SponsorshipJobsClient from './sponsorship-jobs-client';
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
  // Provide a rejected promise or throw an error if URI is not defined
  clientPromise = Promise.reject(new Error("MONGODB_URI is not defined"));
}

export const metadata = {
  title: 'Sponsorship Visa Jobs - Find Jobs with Visa Sponsorship',
  description: 'Find jobs that offer visa sponsorship. We have a wide range of opportunities for international candidates.',
};

export default async function Page() {
  let jobs = [];
  try {
    const connectedClient = await clientPromise;
    const database = connectedClient.db("job_board_db");
    const collection = database.collection("jobs");

    // Fetch only sponsorship jobs
    const fetchedJobs = await collection.find({ location: { $regex: /sponsorship/i } }).toArray();
    jobs = fetchedJobs.map(job => ({ ...job, id: job._id.toString() }));

  } catch (error) {
    console.error("Failed to fetch jobs on server:", error);
  }

  return <SponsorshipJobsClient initialJobs={jobs} />;
}