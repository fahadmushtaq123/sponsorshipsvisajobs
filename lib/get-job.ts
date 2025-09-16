import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getJobById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("job_board_db");
    const collection = db.collection("jobs");

    const job = await collection.findOne({ _id: new ObjectId(id) });

    if (job) {
      return {
        ...job,
        _id: job._id.toString(),
        createdAt: new ObjectId(job._id).getTimestamp(),
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch job by ID:", error);
    return null;
  }
}