import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Job } from '@/context/JobContext'; // Import the Job interface

export async function getJobById(id: string): Promise<Job | null> { // Explicitly type the return
  try {
    const client = await clientPromise;
    const db = client.db("job_board_db");
    const collection = db.collection("jobs");

    const jobDocument = await collection.findOne({ _id: new ObjectId(id) });

    if (jobDocument) {
      // Cast the document to the Job type
      const job: Job = {
        id: jobDocument._id.toString(),
        title: jobDocument.title,
        company: jobDocument.company,
        location: jobDocument.location,
        description: jobDocument.description,
        image: jobDocument.image || null,
        createdAt: new ObjectId(jobDocument._id).getTimestamp(),
      };
      return job;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch job by ID:", error);
    return null;
  }
}