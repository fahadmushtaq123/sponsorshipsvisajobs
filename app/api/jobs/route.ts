import { MongoClient, ServerApiVersion, Collection, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI; // Use environment variable for security

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let jobsCollection: Collection | null = null;

async function connectToDatabase() {
  if (!jobsCollection) {
    await client.connect();
    const database = client.db("job_board_db"); // Your database name
    jobsCollection = database.collection("jobs"); // Your collection name
  }
  return jobsCollection;
}

export async function GET() {
  try {
    const collection = await connectToDatabase();
    const jobs = await collection.find({}).toArray();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ message: "Failed to fetch jobs", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const collection = await connectToDatabase();
    const jobData = await req.json();
    const result = await collection.insertOne(jobData);
    return NextResponse.json({ message: "Job posted successfully", jobId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to post job:", error);
    return NextResponse.json({ message: "Failed to post job", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const collection = await connectToDatabase();
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