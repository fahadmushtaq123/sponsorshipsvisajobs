import { MongoClient, ServerApiVersion, Collection, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI; // Use environment variable for security

let client: MongoClient | undefined;
let jobsCollection: Collection | null = null;

let connectToDatabase: () => Promise<Collection | null>; // Declare connectToDatabase here, can return null

if (uri && uri !== "YOUR_MONGODB_URI_HERE") {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  connectToDatabase = async () => { // Assign function here
    if (!jobsCollection) {
      await client!.connect(); // Use non-null assertion as client is defined if uri is
      const database = client!.db("job_board_db"); // Your database name
      jobsCollection = database.collection("jobs"); // Your collection name
    }
    return jobsCollection;
  };
} else {
  // Fallback for when URI is not defined
  console.warn("MONGODB_URI is not defined. Database operations will be disabled.");
  connectToDatabase = async () => { // Assign function here
    return null;
  };
}

export async function GET(req: Request) {
  try {
    const collection = await connectToDatabase();
    if (!collection) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single job
      let job;
      // Try to find by ObjectId first
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        job = await collection.findOne({ _id: new ObjectId(id) });
      }

      // If not found by ObjectId, try to find by integer id
      if (!job) {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          job = await collection.findOne({ id: numericId });
        }
      }
      
      if (!job) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
      }
      // Map the _id to id
      const jobWithId = { ...job, id: job._id.toString() };
      return NextResponse.json(jobWithId, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } else {
      // Fetch all jobs
      const jobs = await collection.find({}).toArray();
      // Map the _id to id for each job
      const jobsWithId = jobs.map(job => ({ ...job, id: job._id.toString() }));
      return NextResponse.json(jobsWithId, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ message: "Failed to fetch jobs", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const collection = await connectToDatabase();
    if (!collection) {
      return NextResponse.json({ message: "Database not configured" }, { status: 503 });
    }
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
    if (!collection) {
      return NextResponse.json({ message: "Database not configured" }, { status: 503 });
    }
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