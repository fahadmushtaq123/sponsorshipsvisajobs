
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getCollection() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI); // Added for debugging
  const client = await clientPromise;
  const db = client.db("job_board_db");
  return db.collection("jobs");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const collection = await getCollection();
    
    const query: any = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const jobs = (await collection.find(query).sort({ _id: -1 }).toArray()).map(job => ({
      ...job,
      _id: job._id.toString(),
      createdAt: new ObjectId(job._id).getTimestamp(),
    }));
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ message: "Failed to fetch jobs", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const collection = await getCollection();
    const jobData = await req.json();
    console.log("Attempting to insert job data into the database...");
    const result = await collection.insertOne(jobData);
    console.log("Job data inserted successfully. Result:", result);
    return NextResponse.json({ message: "Job posted successfully", jobId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to post job:", error);
    return NextResponse.json({ message: "Failed to post job", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete job:", error);
    return NextResponse.json({ message: "Failed to delete job", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const collection = await getCollection();
    const jobData = await req.json();
    const { id, ...updatedFields } = jobData;

    if (!id) {
      return NextResponse.json({ message: "Job ID is required for update" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const updatedJob = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Job updated successfully", updatedJob: { ...updatedJob, _id: updatedJob?._id.toString() } }, { status: 200 });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json({ message: "Failed to update job", error: (error as Error).message }, { status: 500 });
  }
}
