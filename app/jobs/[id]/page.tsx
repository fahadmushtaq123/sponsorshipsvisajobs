import JobDetailsClient from './JobDetailsClient';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://sponsorshipsvisajobs-db:Sanpak1122@cluster0.28a3dng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export async function generateStaticParams() {
  if (!uri) {
    return [];
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const database = client.db("job_board_db");
    const jobsCollection = database.collection("jobs");
    const jobs = await jobsCollection.find({}).toArray();

    return jobs.map((job) => ({
      id: job._id.toString(),
    }));
  } finally {
    await client.close();
  }
}

export default function JobDetailsPage() {
  return <JobDetailsClient />;
}

export const metadata = {
  title: 'Job Details',
  description: 'Details of a specific job.',
};